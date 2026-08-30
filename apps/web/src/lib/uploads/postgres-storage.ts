import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { uploadedImages } from "@/lib/db/schema";

export function postgresStorageEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function readPostgresUploadObject(
  key: string,
): Promise<{ data: Buffer; contentType: string } | null> {
  if (!postgresStorageEnabled()) return null;

  const db = getDb();
  const [row] = await db
    .select({
      contentType: uploadedImages.contentType,
      data: uploadedImages.data,
    })
    .from(uploadedImages)
    .where(eq(uploadedImages.objectKey, key))
    .limit(1);

  if (!row) return null;
  return { data: row.data, contentType: row.contentType };
}

export async function writePostgresUploadObject(params: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const db = getDb();
  await db
    .insert(uploadedImages)
    .values({
      objectKey: params.key,
      contentType: params.contentType,
      data: params.body,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: uploadedImages.objectKey,
      set: {
        contentType: params.contentType,
        data: params.body,
        updatedAt: sql`now()`,
      },
    });
}

export async function deletePostgresUploadObject(key: string) {
  const db = getDb();
  await db.delete(uploadedImages).where(eq(uploadedImages.objectKey, key));
}
