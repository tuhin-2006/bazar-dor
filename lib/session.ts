import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ensureDatabase } from "@/lib/db/ensure";

export async function getSession() {
  const requestHeaders = await headers();
  await ensureDatabase();

  return auth.api.getSession({
    headers: requestHeaders,
  });
}

export type Session = Awaited<ReturnType<typeof getSession>>;
export type SessionUser = NonNullable<Session>["user"];
