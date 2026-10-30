import { db, mongoClient } from "@/lib/db";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

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
  database: mongodbAdapter(db, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    // Keep the signed-in session inside a signed cookie for as long as the
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  account: {
    accountLinking: {
      enabled: true,

      trustedProviders: ["google", "github"],
      // When a Google/GitHub login is linked to an existing email/password

      updateUserInfoOnLink: true,
      // Email/password sign-ups here are not email-verified (no mail provider
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
            overrideUserInfoOnSignIn: true,
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
