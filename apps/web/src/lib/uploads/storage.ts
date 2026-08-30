import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  bucketStorageEnabled,
  deleteBucketObject,
  getBucketObject,
  mimeForExtension,
  publicPathToObjectKey,
  putBucketObject,
} from "@/lib/uploads/bucket";
import { uploadPublicPath, uploadRootDir } from "@/lib/uploads/paths";

export { uploadPublicPath, uploadRootDir };

export function uploadStorageMode(): "bucket" | "disk" {
  return bucketStorageEnabled() ? "bucket" : "disk";
}

export async function readUploadObject(
  segments: string[],
): Promise<{ data: Buffer; contentType: string } | null> {
  const ext = path.extname(segments.join("/")).slice(1).toLowerCase();

  if (bucketStorageEnabled()) {
    const data = await getBucketObject(segments.join("/"));
    if (!data) return null;
    return { data, contentType: mimeForExtension(ext) };
  }

  const absolutePath = path.join(uploadRootDir(), ...segments);
  const root = path.resolve(uploadRootDir());
  if (!path.resolve(absolutePath).startsWith(root)) return null;

  try {
    const { readFile } = await import("node:fs/promises");
    const data = await readFile(absolutePath);
    return { data, contentType: mimeForExtension(ext) };
  } catch {
    return null;
  }
}

export async function deleteUploadObject(publicPath: string | null | undefined) {
  if (!publicPath?.startsWith("/uploads/")) return;

  if (bucketStorageEnabled()) {
    await deleteBucketObject(publicPathToObjectKey(publicPath)).catch(() => undefined);
    return;
  }

  const key = publicPathToObjectKey(publicPath);
  const absolutePath = path.join(uploadRootDir(), key);
  await unlink(absolutePath).catch(() => undefined);
}

export async function writeUploadObject(params: {
  publicPath: string;
  body: Buffer;
  contentType: string;
}) {
  if (bucketStorageEnabled()) {
    await putBucketObject({
      key: publicPathToObjectKey(params.publicPath),
      body: params.body,
      contentType: params.contentType,
    });
    return;
  }

  const key = publicPathToObjectKey(params.publicPath);
  const absolutePath = path.join(uploadRootDir(), key);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, params.body);
}
