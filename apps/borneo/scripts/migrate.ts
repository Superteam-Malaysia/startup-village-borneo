#!/usr/bin/env tsx
import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const dir = resolve(__dirname, "../drizzle");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const db = postgres(url, { max: 1 });

  for (const file of files) {
    const migration = readFileSync(resolve(dir, file), "utf8");
    await db.unsafe(migration);
    console.log("Migration applied:", file);
  }

  // Don't block deploy on pool teardown; a fresh container starts next boot.
  void db.end({ timeout: 0 }).catch(() => undefined);
  process.exit(0);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
