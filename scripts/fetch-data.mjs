/**
 * Downloads a local snapshot of the BazarDor API.
 * The app uses the live API first and falls back to this snapshot
 * when the API is unreachable (builds, offline demos, etc.).
 *
 * Usage: npm run data:refresh
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const BASE = "https://openapi.programming-hero.com/api/bazardor";
const OUT_DIR = resolve(process.cwd(), "lib/data");

async function get(path) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path}`);
  }

  return response.json();
}

const [products, categories] = await Promise.all([
  get("/products"),
  get("/categories"),
]);

await mkdir(OUT_DIR, { recursive: true });
await writeFile(
  resolve(OUT_DIR, "products.json"),
  `${JSON.stringify(products, null, 2)}\n`,
  "utf8",
);
await writeFile(
  resolve(OUT_DIR, "categories.json"),
  `${JSON.stringify(categories, null, 2)}\n`,
  "utf8",
);

console.log(
  `Saved ${products.length} products and ${categories.length} categories to ${dirname(
    resolve(OUT_DIR, "products.json"),
  )}`,
);
