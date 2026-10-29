import fallbackCategories from "@/lib/data/categories.json";
import fallbackProducts from "@/lib/data/products.json";
import { formatPrice, unitShort } from "@/lib/bn";
import type {
  Category,
  MarketPrice,
  MarketStats,
  Product,
  SortOption,
} from "@/lib/types";

const API_BASE = "https://openapi.programming-hero.com/api/bazardor";

async function fetchBazar<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { accept: "application/json" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(7000),
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const products = await fetchBazar<Product[]>("/products");
  if (Array.isArray(products) && products.length > 0) return products;
  return fallbackProducts as Product[];
}

export async function getCategories(): Promise<Category[]> {
  const categories = await fetchBazar<Category[]>("/categories");
  if (Array.isArray(categories) && categories.length > 0) return categories;
  return fallbackCategories as Category[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getCategoryProducts(slug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.category === slug);
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  if (sort === "price-asc") {
    return [...products].sort((a, b) => a.today - b.today);
  }

  if (sort === "price-desc") {
    return [...products].sort((a, b) => b.today - a.today);
  }

  return products;
}

export function getTopRisers(products: Product[], limit = 6): Product[] {
  return [...products]
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, limit);
}

export function getTopFallers(products: Product[], limit = 6): Product[] {
  return [...products]
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, limit);
}

export function getMarketStats(product: Product): MarketStats {
  const markets = product.markets.length > 0 ? product.markets : [];

  if (markets.length === 0) {
    const fallback: MarketPrice = {
      market: "সারাদেশ",
      division: "বাংলাদেশ",
      min: product.today,
      max: product.today,
    };
    return {
      min: product.today,
      max: product.today,
      average: product.today,
      cheapestMarket: fallback,
      costliestMarket: fallback,
    };
  }

  const cheapestMarket = markets.reduce((lowest, market) =>
    market.min < lowest.min ? market : lowest,
  );
  const costliestMarket = markets.reduce((highest, market) =>
    market.max > highest.max ? market : highest,
  );
  const min = Math.min(...markets.map((market) => market.min));
  const max = Math.max(...markets.map((market) => market.max));
  const average = Math.round(
    markets.reduce((total, market) => total + (market.min + market.max) / 2, 0) /
      markets.length,
  );

  return { min, max, average, cheapestMarket, costliestMarket };
}

export function getMarketSummary(product: Product): string {
  const stats = getMarketStats(product);
  const unit = unitShort(product.unit);

  return `${stats.cheapestMarket.market}-এ আজ সবচেয়ে কম ${formatPrice(
    stats.min,
  )} টাকা/${unit}, আর ${stats.costliestMarket.market}-এ সর্বোচ্চ ${formatPrice(
    stats.max,
  )} টাকা/${unit}। ${product.markets.length}টি বাজারের গড় দাম ${formatPrice(
    stats.average,
  )} টাকা।`;
}

export function getDivisions(products: Product[]): string[] {
  return ["সব", ...new Set(products.flatMap((product) => product.markets.map((market) => market.division)))];
}
