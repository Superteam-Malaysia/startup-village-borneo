import path from "node:path";
import { mimeForExtension } from "@/lib/uploads/bucket";
import { uploadPublicPath } from "@/lib/uploads/paths";
import {
  deleteUploadObject,
  writeUploadObject,
} from "@/lib/uploads/storage";

const MAX_BYTES = 1024 * 1024;

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
    throw new Error("Image must be 1 MB or smaller.");
  }

  const buffer = Buffer.from(await params.file.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    throw new Error("Image must be 1 MB or smaller.");
  }

  const filename = `${params.id}.${ext}`;
  const publicPath = uploadPublicPath(params.folder, filename);

  await writeUploadObject({
    publicPath,
    body: buffer,
    contentType: mimeForExtension(ext),
  });

  if (params.previousPublicPath?.startsWith(`/uploads/${params.folder}/`)) {
    const previousName = path.basename(params.previousPublicPath);
    if (previousName !== filename) {
      await deleteUploadObject(params.previousPublicPath);
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
