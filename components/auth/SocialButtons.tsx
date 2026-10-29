"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { GitHubIcon, GoogleIcon } from "@/components/auth/ProviderIcons";

type Provider = "google" | "github";
type SocialPage = "signin" | "signup";

interface SocialButtonsProps {
  callbackURL: string;
  providers?: Record<Provider, boolean>;
  /** Which auth page hosts the buttons — used to send OAuth errors back here. */
  page?: SocialPage;
}

const LABELS: Record<Provider, string> = {
  google: "Google",
  github: "GitHub",
};

/**
 * Where Better Auth should land the user when the provider returns an error
 * (cancelled consent, denied scope, callback mismatch…). Keeping `redirect`
 * lets the user resume the page they started from.
 */
function buildErrorURL(page: SocialPage, callbackURL: string) {
  const params = new URLSearchParams({ error: "1" });
  if (callbackURL !== "/") params.set("redirect", callbackURL);
  return `/${page}?${params.toString()}`;
}

export function SocialButtons({
  callbackURL,
  providers = { google: false, github: false },
  page = "signin",
}: SocialButtonsProps) {
  const [loading, setLoading] = useState<Provider | null>(null);

  // If the user cancels on the provider page and comes back (bfcache/back
  // button), the spinner would otherwise stay on and both buttons would look
  // dead because they are disabled while `loading` is set.
  useEffect(() => {
    const reset = () => setLoading(null);
    window.addEventListener("pageshow", reset);
    window.addEventListener("popstate", reset);
    return () => {
      window.removeEventListener("pageshow", reset);
      window.removeEventListener("popstate", reset);
    };
  }, []);

  async function startSocialSignIn(provider: Provider) {
    setLoading(provider);

    const label = LABELS[provider];

    // No credentials for this provider: fall back to the local demo account.
    // Full navigation is required so the new session cookie is applied.
    if (!providers[provider]) {
      const query = new URLSearchParams({
        provider,
        redirect: callbackURL,
      });
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/api/social-demo?${query.toString()}`);
      return;
    }

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL,
        // Better Auth appends ?error=<code> here; the auth page shows a toast.
        errorCallbackURL: buildErrorURL(page, callbackURL),
      });

      if (error) {
        toast.error(
          authErrorMessage(
            error.message,
            `${label} দিয়ে সাইন ইন শুরু করা যায়নি। আবার চেষ্টা করুন।`,
          ),
        );
        setLoading(null);
        return;
      }

      // On success Better Auth navigates to the provider, so the spinner stays
      // on until the browser leaves this page.
    } catch {
      toast.error(
        `${label} দিয়ে সাইন ইন শুরু করা যায়নি। আবার চেষ্টা করুন।`,
      );
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => startSocialSignIn("google")}
        disabled={loading !== null}
        aria-busy={loading === "google"}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line bg-white text-[11.5px] font-semibold text-ink/80 transition hover:border-forest/25 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading === "google" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        Google দিয়ে চালিয়ে যান
      </button>
      <button
        type="button"
        onClick={() => startSocialSignIn("github")}
        disabled={loading !== null}
        aria-busy={loading === "github"}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line bg-white text-[11.5px] font-semibold text-ink/80 transition hover:border-forest/25 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading === "github" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <GitHubIcon />
        )}
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
