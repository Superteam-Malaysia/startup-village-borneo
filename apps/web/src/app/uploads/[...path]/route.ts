import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { uploadRootDir } from "@/lib/uploads/storage";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

type Params = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, { params }: Params) {
  const segments = (await params).path;
  if (!segments?.length || segments.some((part) => part.includes(".."))) {
    return new NextResponse("Not found", { status: 404 });
  }

  const folder = segments[0];
  if (folder !== "participants" && folder !== "teams") {
    return new NextResponse("Not found", { status: 404 });
  }

  const absolutePath = path.join(uploadRootDir(), ...segments);
  const root = path.resolve(uploadRootDir());
  if (!path.resolve(absolutePath).startsWith(root)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await readFile(absolutePath);
    const ext = path.extname(absolutePath).slice(1).toLowerCase();
    return new NextResponse(data, {
      headers: {
        "Content-Type": MIME[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
