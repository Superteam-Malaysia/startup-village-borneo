import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 2 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type SavedUpload = {
  /** Path served from site root, e.g. /uploads/participants/{id}.jpg */
  publicPath: string;
};

export function uploadRootDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim();
  if (configured) return configured;

  const volumeMount = process.env.RAILWAY_VOLUME_MOUNT_PATH?.trim();
  if (volumeMount) return volumeMount;

  return path.join(process.cwd(), "public", "uploads");
}

export function uploadPublicPath(folder: "participants" | "teams", filename: string): string {
  return `/uploads/${folder}/${filename}`;
}

function extensionFor(file: File): string | null {
  return MIME_TO_EXT[file.type] ?? null;
}

async function writeImageUpload(params: {
  file: File;
  folder: "participants" | "teams";
  id: string;
  previousPublicPath?: string | null;
}): Promise<SavedUpload> {
  const ext = extensionFor(params.file);
  if (!ext) {
    throw new Error("Use a JPG, PNG, WebP, or GIF image.");
  }

  if (params.file.size > MAX_BYTES) {
    throw new Error("Image must be 2 MB or smaller.");
  }

  const buffer = Buffer.from(await params.file.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    throw new Error("Image must be 2 MB or smaller.");
  }

  const dir = path.join(uploadRootDir(), params.folder);
  await mkdir(dir, { recursive: true });

  const filename = `${params.id}.${ext}`;
  const absolutePath = path.join(dir, filename);
  await writeFile(absolutePath, buffer);

  const publicPath = `/uploads/${params.folder}/${filename}`;

  if (params.previousPublicPath?.startsWith(`/uploads/${params.folder}/`)) {
    const previousName = path.basename(params.previousPublicPath);
    const previousPath = path.join(dir, previousName);
    if (previousPath !== absolutePath) {
      await unlink(previousPath).catch(() => undefined);
    }
  }

  return { publicPath };
}

export async function saveParticipantAvatar(params: {
  participantId: string;
  file: File;
  previousPublicPath?: string | null;
}) {
  return writeImageUpload({
    file: params.file,
    folder: "participants",
    id: params.participantId,
    previousPublicPath: params.previousPublicPath,
  });
}

export async function saveTeamLogo(params: {
  teamId: string;
  file: File;
  previousPublicPath?: string | null;
}) {
  return writeImageUpload({
    file: params.file,
    folder: "teams",
    id: params.teamId,
    previousPublicPath: params.previousPublicPath,
  });
}
