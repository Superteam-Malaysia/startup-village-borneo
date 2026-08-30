import path from "node:path";

/** Local dev fallback when Railway Bucket env vars are not set. */
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
