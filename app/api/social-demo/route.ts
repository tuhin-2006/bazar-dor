import { NextResponse } from "next/server";
import { auth, githubConfigured, googleConfigured } from "@/lib/auth";
import { ensureDatabase } from "@/lib/db/ensure";
import { safeRedirect } from "@/lib/safe-redirect";

type DemoProvider = "google" | "github";

const DEMO_USERS: Record<
  DemoProvider,
  { email: string; name: string; password: string }
> = {
  google: {
    email: "google.demo@bazardor.local",
    name: "Google ডেমো ব্যবহারকারী",
    password: "BazarDorDemo#123",
  },
  github: {
    email: "github.demo@bazardor.local",
    name: "GitHub ডেমো ব্যবহারকারী",
    password: "BazarDorDemo#123",
  },
};

function isDemoProvider(value: string | null): value is DemoProvider {
  return value === "google" || value === "github";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const redirectTo = safeRedirect(url.searchParams.get("redirect") ?? "/");

  if (!isDemoProvider(provider)) {
    return NextResponse.redirect(new URL("/signin?error=1", url.origin));
  }

  // When real OAuth credentials exist, the button goes straight to the
  // provider — never hand out a demo session.
  const configured =
    provider === "google" ? googleConfigured : githubConfigured;
  if (configured) {
    return NextResponse.redirect(new URL("/signin", url.origin));
  }

  await ensureDatabase();

  const demo = DEMO_USERS[provider];

  let response = await auth.api.signInEmail({
    body: { email: demo.email, password: demo.password },
    asResponse: true,
  });

  if (!response.ok) {
    response = await auth.api.signUpEmail({
      body: { name: demo.name, email: demo.email, password: demo.password },
      asResponse: true,
    });
  }

  const redirect = NextResponse.redirect(
    new URL(redirectTo, url.origin),
  );

  for (const cookie of response.headers.getSetCookie()) {
    redirect.headers.append("set-cookie", cookie);
  }

  return redirect;
}
