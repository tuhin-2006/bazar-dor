import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db, schema } from "@/lib/db";

export const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const githubConfigured =
  Boolean(process.env.GITHUB_CLIENT_ID) &&
  Boolean(process.env.GITHUB_CLIENT_SECRET);

const baseURL = process.env.BETTER_AUTH_URL?.trim();
const siteURL = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelURL = process.env.VERCEL_URL?.trim();
const vercelProductionURL = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

const trustedOrigins = [
  "http://localhost:3000",
  baseURL,
  siteURL,
  vercelURL ? `https://${vercelURL}` : null,
  vercelProductionURL ? `https://${vercelProductionURL}` : null,
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  appName: "বাজার দর",
  ...(baseURL ? { baseURL } : {}),
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    // Keep the signed-in session inside a signed cookie for as long as the
    // session itself lives. Serverless hosts (Vercel) run every route in its
    // own function with a separate, ephemeral /tmp folder, so a database-only
    // session written by /api/auth is invisible to the page that renders
    // /product/[slug] or /profile and those pages bounce back to /signin.
    // The cookie is HMAC-signed with BETTER_AUTH_SECRET, so the page can
    // validate it without touching the database.
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      // Google/GitHub verify the email before handing it back, so an existing
      // email/password account with the same address can be linked to the
      // social login instead of failing with "account not linked".
      trustedProviders: ["google", "github"],
      // When a Google/GitHub login is linked to an existing email/password
      // account, copy the provider's name and profile picture onto that user.
      // Without this the linked user keeps a null `image`, so the navbar has
      // no avatar to show.
      updateUserInfoOnLink: true,
      // Email/password sign-ups here are not email-verified (no mail provider
      // is configured), so the default `true` would block every link attempt
      // with `emailVerified: false`. The OAuth provider already proved the
      // user owns the address, so local verification is not required.
      requireLocalEmailVerified: false,
    },
  },
  socialProviders: {
    ...(googleConfigured
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account" as const,
          },
        }
      : {}),
    ...(githubConfigured
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          },
        }
      : {}),
  },
  onAPIError: {
    errorURL: "/signin",
  },
  trustedOrigins,
  plugins: [nextCookies()],
});
