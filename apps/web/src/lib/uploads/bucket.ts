import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

let client: S3Client | null = null;

export function bucketStorageEnabled(): boolean {
  return Boolean(
    process.env.BUCKET?.trim() &&
      process.env.ACCESS_KEY_ID?.trim() &&
      process.env.SECRET_ACCESS_KEY?.trim() &&
      process.env.ENDPOINT?.trim(),
  );
}

function bucketName(): string {
  const name = process.env.BUCKET?.trim();
  if (!name) throw new Error("BUCKET is not configured");
  return name;
}

function s3(): S3Client {
  if (!client) {
    client = new S3Client({
      region: process.env.REGION?.trim() || "auto",
      endpoint: process.env.ENDPOINT!.trim(),
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!.trim(),
        secretAccessKey: process.env.SECRET_ACCESS_KEY!.trim(),
      },
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    });
  }
  return client;
}

export function publicPathToObjectKey(publicPath: string): string {
  return publicPath.replace(/^\/uploads\//, "");
}

export function mimeForExtension(ext: string): string {
  return EXT_TO_MIME[ext.toLowerCase()] ?? "application/octet-stream";
}

export async function putBucketObject(params: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  await s3().send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      CacheControl: "public, max-age=3600",
    }),
  );
}

export async function getBucketObject(key: string): Promise<Buffer | null> {
  try {
    const response = await s3().send(
      new GetObjectCommand({
        Bucket: bucketName(),
        Key: key,
      }),
    );
    if (!response.Body) return null;
    const bytes = await response.Body.transformToByteArray();
    return Buffer.from(bytes);
  } catch {
    return null;
  }
}

export async function deleteBucketObject(key: string) {
  await s3().send(
    new DeleteObjectCommand({
      Bucket: bucketName(),
      Key: key,
    }),
  );
}
