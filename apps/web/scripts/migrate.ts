#!/usr/bin/env tsx
import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const sqlPath = resolve(__dirname, "../drizzle/0000_participants.sql");
  const migration = readFileSync(sqlPath, "utf8");
  const db = postgres(url, { max: 1 });

  await db.unsafe(migration);
  console.log("Migration applied:", sqlPath);
  await db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
