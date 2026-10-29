import { defineConfig, type Config } from "drizzle-kit";

const url = process.env.TURSO_DATABASE_URL || "file:./bazardor.db";
const isLocalFile = url.startsWith("file:");

const config: Config = isLocalFile
  ? {
      schema: "./lib/db/schema.ts",
      out: "./drizzle",
      dialect: "sqlite",
      dbCredentials: { url },
      verbose: true,
      strict: false,
    }
  : {
      schema: "./lib/db/schema.ts",
      out: "./drizzle",
      dialect: "turso",
      dbCredentials: {
        url,
        authToken: process.env.TURSO_AUTH_TOKEN ?? "",
      },
      verbose: true,
      strict: false,
    };

export default defineConfig(config);
