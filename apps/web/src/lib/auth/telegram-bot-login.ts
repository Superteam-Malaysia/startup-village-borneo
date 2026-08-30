import { and, eq, gt, isNotNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants, telegramLoginSessions, type Participant } from "@/lib/db/schema";
import { createMagicToken } from "@/lib/auth/session";
import { normalizeTelegramUsername } from "@/lib/auth/telegram";
import {
  buildTelegramDeepLink,
  buildTelegramDesktopDeepLink,
  createTelegramStartToken,
  sendTelegramMessage,
} from "@/lib/auth/telegram-api";
import { appOrigin, withBasePath } from "@/lib/auth/session";
import {
  shouldBackfillTelegramAvatar,
} from "@/lib/uploads/telegram-avatar";
import {
  fetchAndStoreTelegramProfilePhoto,
  fetchAndStoreTelegramUserpic,
} from "@/lib/uploads/fetch-telegram-userpic";

const LOGIN_TTL_MS = 10 * 60 * 1000;

export async function createTelegramAppLoginSession(botUsername: string) {
  const db = getDb();
  const startToken = createTelegramStartToken();
  const expiresAt = new Date(Date.now() + LOGIN_TTL_MS);

  await db.insert(telegramLoginSessions).values({
    startToken,
    expiresAt,
    status: "pending",
  });

  return {
    startToken,
    deepLink: buildTelegramDeepLink(botUsername, startToken),
    desktopDeepLink: buildTelegramDesktopDeepLink(botUsername, startToken),
    expiresAt,
  };
}

export async function getTelegramLoginSessionStatus(startToken: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(telegramLoginSessions)
    .where(
      and(
        eq(telegramLoginSessions.startToken, startToken),
        gt(telegramLoginSessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!row) return { status: "expired" as const };

  if (row.status === "complete" && row.finishToken) {
    return {
      status: "complete" as const,
      finishUrl: `${appOrigin()}${withBasePath("/api/auth/telegram/finish")}?token=${row.finishToken}`,
    };
  }

  if (row.status === "rejected") {
    return { status: "rejected" as const, reason: row.telegramUserId ?? "not_registered" };
  }

  return { status: "pending" as const };
}

export async function completeTelegramAppLoginFromBot(params: {
  startToken: string;
  telegramUserId: number;
  username?: string;
  chatId: number;
}) {
  const db = getDb();
  const [session] = await db
    .select()
    .from(telegramLoginSessions)
    .where(
      and(
        eq(telegramLoginSessions.startToken, params.startToken),
        eq(telegramLoginSessions.status, "pending"),
        gt(telegramLoginSessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!session) {
    await sendTelegramMessage(
      params.chatId,
      "This sign-in link expired. Go back to the SVB site and tap “Open in Telegram app” again.",
    );
    return;
  }

  const authUsername = normalizeTelegramUsername(params.username);
  const telegramUserId = String(params.telegramUserId);

  const [linked] = await db
    .select()
    .from(participants)
    .where(eq(participants.telegramUserId, telegramUserId))
    .limit(1);

  let participant: Participant | null = linked ?? null;

  if (!participant && authUsername) {
    const registered = await db
      .select()
      .from(participants)
      .where(isNotNull(participants.telegram));

    participant =
      registered.find(
        (row) => normalizeTelegramUsername(row.telegram) === authUsername,
      ) ?? null;
  }

  if (!participant) {
    await db
      .update(telegramLoginSessions)
      .set({
        status: "rejected",
        telegramUserId: authUsername ? "not_registered" : "missing_telegram",
        completedAt: new Date(),
      })
      .where(eq(telegramLoginSessions.id, session.id));

    await sendTelegramMessage(
      params.chatId,
      authUsername
        ? "That Telegram @username is not on the SVB guest list. Use the same handle you registered with on Luma."
        : "Your Telegram account has no @username. Set one in Telegram settings, then try again.",
    );
    return;
  }

  const finishToken = createMagicToken();
  await db
    .update(telegramLoginSessions)
    .set({
      status: "complete",
      finishToken,
      participantId: participant.id,
      telegramUserId,
      completedAt: new Date(),
    })
    .where(eq(telegramLoginSessions.id, session.id));

  if (participant.telegramUserId !== telegramUserId) {
    await db
      .update(participants)
      .set({ telegramUserId, updatedAt: new Date() })
      .where(eq(participants.id, participant.id));
  }

  if (shouldBackfillTelegramAvatar(participant.avatarUrl)) {
    const publicPath =
      (await fetchAndStoreTelegramUserpic({
        participantId: participant.id,
        telegram: authUsername ?? participant.telegram,
        previousPublicPath: participant.avatarUrl,
      })) ??
      (await fetchAndStoreTelegramProfilePhoto({
        participantId: participant.id,
        telegramUserId,
        previousPublicPath: participant.avatarUrl,
      }));

    if (publicPath) {
      await db
        .update(participants)
        .set({
          avatarUrl: publicPath,
          updatedAt: new Date(),
        })
        .where(eq(participants.id, participant.id));
    }
  }

  const finishUrl = `${appOrigin()}${withBasePath("/api/auth/telegram/finish")}?token=${finishToken}`;

  await sendTelegramMessage(
    params.chatId,
    `Signed in as ${participant.name ?? participant.email}. Tap below to open your SVB profile.`,
    {
      inline_keyboard: [[{ text: "Open SVB profile", url: finishUrl }]],
    },
  );
}

async function participantForTelegramLoginSession(session: {
  id: string;
  participantId: string | null;
  status: string;
}) {
  if (!session.participantId) return null;
  if (session.status !== "complete" && session.status !== "used") return null;

  const db = getDb();
  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.id, session.participantId))
    .limit(1);

  return participant ?? null;
}

async function markTelegramLoginSessionUsed(sessionId: string) {
  const db = getDb();
  await db
    .update(telegramLoginSessions)
    .set({ status: "used", completedAt: new Date() })
    .where(eq(telegramLoginSessions.id, sessionId));
}

/** Resolve a completed bot login by poll token or finish token (idempotent once used). */
export async function resolveTelegramLoginParticipant(params: {
  startToken?: string;
  finishToken?: string;
}) {
  const db = getDb();
  const now = new Date();
  const { startToken, finishToken } = params;

  if (!startToken && !finishToken) return null;

  const [session] = await db
    .select()
    .from(telegramLoginSessions)
    .where(
      and(
        gt(telegramLoginSessions.expiresAt, now),
        startToken
          ? eq(telegramLoginSessions.startToken, startToken)
          : eq(telegramLoginSessions.finishToken, finishToken!),
      ),
    )
    .limit(1);

  if (!session) return null;

  const participant = await participantForTelegramLoginSession(session);
  if (!participant) return null;

  if (session.status === "complete") {
    await markTelegramLoginSessionUsed(session.id);
  }

  return participant;
}

export async function consumeTelegramFinishToken(finishToken: string) {
  return resolveTelegramLoginParticipant({ finishToken });
}

export async function consumeTelegramStartToken(startToken: string) {
  return resolveTelegramLoginParticipant({ startToken });
}
