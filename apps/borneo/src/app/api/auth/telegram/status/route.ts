import { NextResponse } from "next/server";
import { getTelegramLoginSessionStatus } from "@/lib/auth/telegram-bot-login";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const status = await getTelegramLoginSessionStatus(token);
  return NextResponse.json(status);
}
