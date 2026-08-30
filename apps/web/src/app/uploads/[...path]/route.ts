import { NextResponse } from "next/server";
import { readUploadObject } from "@/lib/uploads/storage";

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

  const object = await readUploadObject(segments);
  if (!object) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(object.data), {
    headers: {
      "Content-Type": object.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
