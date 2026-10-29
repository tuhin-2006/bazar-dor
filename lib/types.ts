export type ChangeDirection = "up" | "down" | "flat";

export interface PriceChange {
  dir: ChangeDirection;
  pct: number;
}

export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: PriceChange;
  markets: MarketPrice[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export type SortOption = "default" | "price-asc" | "price-desc";

export interface MarketStats {
  min: number;
  max: number;
  average: number;
  cheapestMarket: MarketPrice;
  costliestMarket: MarketPrice;
}
