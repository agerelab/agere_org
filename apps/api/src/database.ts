import { Pool } from "pg";

let pool: Pool | undefined;

function connectionString(): string | undefined {
  const value = process.env.DATABASE_URL?.trim();
  return value ? value : undefined;
}

export function getPool(): Pool | null {
  const url = connectionString();
  if (!url) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 2,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function pingDatabase(): Promise<"ok" | "not-configured"> {
  const current = getPool();
  if (!current) return "not-configured";
  await current.query("select 1");
  return "ok";
}
