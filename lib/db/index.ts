import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/lib/db/schema";

function resolveDatabaseUrl(): string {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  if (process.env.LIBSQL_DATABASE_URL) return process.env.LIBSQL_DATABASE_URL;
  if (process.env.VERCEL) return "file:/tmp/bazardor.db";
  return "file:./bazardor.db";
}

const globalForDb = globalThis as unknown as {
  __bazardorClient?: ReturnType<typeof createClient>;
};

export const libsqlClient =
  globalForDb.__bazardorClient ??
  createClient({
    url: resolveDatabaseUrl(),
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__bazardorClient = libsqlClient;
}

export const db = drizzle(libsqlClient, { schema });
export { schema };
