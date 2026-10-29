import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const ENV_FILES = [".env.local", ".env"];

function parseEnvFile(path) {
  if (!existsSync(path)) return {};

  const values = {};

  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/,
    );
    if (!match) continue;

    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[match[1]] = value;
  }

  return values;
}

const fileEnv = {};
const loadedFiles = [];

for (const file of ENV_FILES) {
  const path = resolve(ROOT, file);
  if (!existsSync(path)) continue;
  loadedFiles.push(file);
  Object.assign(fileEnv, parseEnvFile(path));
}

const env = { ...process.env, ...fileEnv };
const baseURL = (env.BETTER_AUTH_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

const providers = [
  {
    label: "Google",
    callback: `${baseURL}/api/auth/callback/google`,
    idKey: "GOOGLE_CLIENT_ID",
    secretKey: "GOOGLE_CLIENT_SECRET",
    console: "https://console.cloud.google.com/apis/credentials",
  },
  {
    label: "GitHub",
    callback: `${baseURL}/api/auth/callback/github`,
    idKey: "GITHUB_CLIENT_ID",
    secretKey: "GITHUB_CLIENT_SECRET",
    console: "https://github.com/settings/developers",
  },
];

function mask(value) {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

console.log("\nবাজার দর — OAuth configuration check\n");
console.log(`  Base URL : ${baseURL}`);
console.log(
  `  Env files: ${loadedFiles.length ? loadedFiles.join(", ") : "none found"}\n`,
);

let missing = 0;

for (const provider of providers) {
  const clientId = env[provider.idKey]?.trim();
  const clientSecret = env[provider.secretKey]?.trim();
  const configured = Boolean(clientId && clientSecret);

  if (!configured) missing += 1;

  console.log(`${configured ? "✅" : "❌"} ${provider.label}`);

  if (configured) {
    console.log(`     Client ID : ${mask(clientId)}`);
    console.log(`     Secret    : ${mask(clientSecret)}`);
  } else {
    const missingKeys = [
      !clientId ? provider.idKey : null,
      !clientSecret ? provider.secretKey : null,
    ].filter(Boolean);
    console.log(`     Missing   : ${missingKeys.join(", ")}`);
    console.log(`     Console   : ${provider.console}`);
  }

  console.log(`     Callback  : ${provider.callback}\n`);
}

if (missing === providers.length) {
  console.log(
    "⚠️  Only demo sign-in is active. Add real credentials to store your own\n" +
      "   Google/GitHub account. See docs/oauth-setup.md for step-by-step help.\n",
  );
} else if (missing > 0) {
  console.log("ℹ️  One provider is ready; the other still uses the demo account.\n");
} else {
  console.log(
    "🎉 Both providers are ready. Restart `npm run dev`, sign out, then use\n" +
      "   the Google/GitHub buttons to store your real account.\n",
  );
}
