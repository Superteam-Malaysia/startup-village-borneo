import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | null = null;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

export function getDb() {
  if (!client) {
    client = postgres(getDatabaseUrl(), { prepare: false, max: 10 });
  }
  return drizzle(client, { schema });
}

export async function closeDb() {
  if (client) {
    await client.end({ timeout: 5 });
    client = null;
  }
}
