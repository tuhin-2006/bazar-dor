import { auth } from "@/lib/auth";
import { ensureDatabase } from "@/lib/db/ensure";

export async function GET(request: Request) {
  await ensureDatabase();
  return auth.handler(request);
}

export async function POST(request: Request) {
  await ensureDatabase();
  return auth.handler(request);
}
