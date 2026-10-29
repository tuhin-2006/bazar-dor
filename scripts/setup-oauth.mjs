import { exec } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { resolve } from "node:path";
import { stdin, stdout } from "node:process";

const ENV_PATH = resolve(process.cwd(), ".env.local");
const OPEN_CONSOLES = process.argv.includes("--open");

const PROVIDERS = [
  {
    label: "Google",
    idKey: "GOOGLE_CLIENT_ID",
    secretKey: "GOOGLE_CLIENT_SECRET",
    console: "https://console.cloud.google.com/apis/credentials",
    callback: "http://localhost:3000/api/auth/callback/google",
  },
  {
    label: "GitHub",
    idKey: "GITHUB_CLIENT_ID",
    secretKey: "GITHUB_CLIENT_SECRET",
    console: "https://github.com/settings/developers",
    callback: "http://localhost:3000/api/auth/callback/github",
  },
];

function parseEnv(text) {
  const values = new Map();
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/,
    );
    if (match) values.set(match[1], match[2].trim());
  }

  return values;
}

function serializeEnv(original, updates) {
  const seen = new Set();
  const lines = original.split(/\r?\n/).map((line) => {
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (!match || !updates.has(match[1])) return line;

    seen.add(match[1]);
    return `${match[1]}=${updates.get(match[1])}`;
  });

  for (const [key, value] of updates) {
    if (seen.has(key)) continue;
    lines.push(`${key}=${value}`);
  }

  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

function openUrl(url) {
  const command =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;

  exec(command, () => {});
}

async function main() {
  if (!stdin.isTTY) {
    console.log(
      "This setup needs an interactive terminal. Run `npm run auth:setup`\n" +
        "from your own terminal (or add the 4 keys to .env.local manually).",
    );
    return;
  }

  const original = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
  const current = parseEnv(original);
  const updates = new Map();
  const rl = createInterface({ input: stdin, output: stdout });

  console.log("\nবাজার দর — Google / GitHub OAuth setup\n");
  console.log(
    "প্রতিটি প্রোভাইডারের Client ID ও Secret দিন। কোনোটা বাদ দিতে চাইলে\n" +
      "শুধু Enter চাপুন — সেটা ডেমো মোডেই থাকবে।\n",
  );

  try {
    for (const provider of PROVIDERS) {
      console.log(`── ${provider.label} ─────────────────────────────`);
      console.log(`Console  : ${provider.console}`);
      console.log(`Callback : ${provider.callback}\n`);

      if (OPEN_CONSOLES) openUrl(provider.console);

      const existingId = current.get(provider.idKey) ?? "";
      const existingSecret = current.get(provider.secretKey) ?? "";

      const id = (
        await rl.question(
          `${provider.idKey}${existingId ? " [আছে, Enter = রাখুন]" : ""}: `,
        )
      ).trim();
      const secret = (
        await rl.question(
          `${provider.secretKey}${existingSecret ? " [আছে, Enter = রাখুন]" : ""}: `,
        )
      ).trim();

      if (id) updates.set(provider.idKey, id);
      if (secret) updates.set(provider.secretKey, secret);

      console.log("");
    }
  } finally {
    rl.close();
  }

  if (updates.size === 0) {
    console.log("কোনো নতুন value দেওয়া হয়নি — .env.local অপরিবর্তিত আছে।");
    return;
  }

  const next = serializeEnv(original, updates);
  writeFileSync(ENV_PATH, next, "utf8");

  console.log(`✅ ${updates.size}টি value .env.local-এ সংরক্ষণ করা হয়েছে।`);
  console.log("\nএখন করুন:");
  console.log("  1. npm run auth:check");
  console.log("  2. npm run dev  (আবার চালু করুন)");
  console.log("  3. সাইন আউট করে Google/GitHub দিয়ে আবার সাইন ইন করুন\n");
}

await main();
