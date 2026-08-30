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
import {
  deletePostgresUploadObject,
  postgresStorageEnabled,
  readPostgresUploadObject,
  writePostgresUploadObject,
} from "@/lib/uploads/postgres-storage";
import { uploadPublicPath, uploadRootDir } from "@/lib/uploads/paths";

export { uploadPublicPath, uploadRootDir };

export function uploadStorageMode(): "bucket" | "postgres" | "disk" {
  if (bucketStorageEnabled()) return "bucket";
  if (postgresStorageEnabled()) return "postgres";
  return "disk";
}

export async function readUploadObject(
  segments: string[],
): Promise<{ data: Buffer; contentType: string } | null> {
  const ext = path.extname(segments.join("/")).slice(1).toLowerCase();
  const key = segments.join("/");

  if (bucketStorageEnabled()) {
    const data = await getBucketObject(key);
    if (!data) return null;
    return { data, contentType: mimeForExtension(ext) };
  }

  if (postgresStorageEnabled()) {
    const object = await readPostgresUploadObject(key);
    if (object) return object;
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

  const key = publicPathToObjectKey(publicPath);

  if (bucketStorageEnabled()) {
    await deleteBucketObject(key).catch(() => undefined);
    return;
  }

  if (postgresStorageEnabled()) {
    await deletePostgresUploadObject(key).catch(() => undefined);
    return;
  }

  const absolutePath = path.join(uploadRootDir(), key);
  await unlink(absolutePath).catch(() => undefined);
}

export async function writeUploadObject(params: {
  publicPath: string;
  body: Buffer;
  contentType: string;
}) {
  const key = publicPathToObjectKey(params.publicPath);

  if (bucketStorageEnabled()) {
    await putBucketObject({
      key,
      body: params.body,
      contentType: params.contentType,
    });
    return;
  }

  if (postgresStorageEnabled()) {
    await writePostgresUploadObject({
      key,
      body: params.body,
      contentType: params.contentType,
    });
    return;
  }

  const absolutePath = path.join(uploadRootDir(), key);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, params.body);
}
