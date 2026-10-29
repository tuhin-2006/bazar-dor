import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { formatBanglaNumber, formatPrice, unitLabel, unitShort } from "@/lib/bn";
import { categoryTheme } from "@/lib/category-theme";
import {
  getMarketStats,
  getMarketSummary,
  getProductBySlug,
} from "@/lib/products";
import type { Product } from "@/lib/types";
import { getSession } from "@/lib/session";
import { PriceBadge } from "@/components/products/PriceBadge";
import { ProductIcon } from "@/components/products/ProductIcon";

function changeSummary(product: Product): string {
  const diff = Math.round(Math.abs(product.today - product.yesterday));

  if (product.change.dir === "up") {
    return `গতকালের তুলনায় আজ দাম বেড়েছে · ${formatPrice(diff)} টাকা`;
  }

  if (product.change.dir === "down") {
    return `গতকালের তুলনায় আজ দাম কমেছে · ${formatPrice(diff)} টাকা`;
  }

  return "গতকালের তুলনায় আজ দাম অপরিবর্তিত";
}

function genitiveUnit(unit: string): string {
  const label = unitShort(unit);
  return /[ািীুূৃেৈোৌ]$/.test(label) ? `${label}র` : `${label}ের`;
}

function formatAverage(value: number): string {
  return formatBanglaNumber(value, { maximumFractionDigits: 1 });
}

export async function generateMetadata(
  props: PageProps<"/product/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "পণ্য খুঁজে পাওয়া যায়নি" };

  return {
    title: `${product.nameBn} — আজকের বাজারদর`,
    description: getMarketSummary(product),
  };
}

export default async function ProductPage(
  props: PageProps<"/product/[slug]">,
) {
  const { slug } = await props.params;
  const session = await getSession();

  if (!session) {
    redirect(
      `/signin?redirect=${encodeURIComponent(
        `/product/${slug}`,
      )}&reason=protected`,
    );
  }

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const stats = getMarketStats(product);
  const theme = categoryTheme(product.category);

  return (
    <div className="flex flex-1 flex-col bg-[#f5f8f4]">
      <div className="shell flex flex-1 flex-col py-6 sm:py-8">
        <nav
          aria-label="ব্রেডক্রাম্ব"
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto text-[12px] font-medium text-muted"
        >
          <Link
            href="/"
            className="shrink-0 transition hover:text-forest"
          >
            হোম
          </Link>
          <ChevronRight className="size-3 shrink-0 opacity-50" aria-hidden="true" />
          <Link
            href={`/category/${product.category}`}
            className="shrink-0 transition hover:text-forest"
          >
            {product.categoryNameBn}
          </Link>
          <ChevronRight className="size-3 shrink-0 opacity-50" aria-hidden="true" />
          <span className="truncate font-semibold text-forest">
            {product.nameBn}
          </span>
        </nav>

        <section className="mt-4 rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <span
                className="grid size-12 shrink-0 place-items-center rounded-xl"
                style={{ backgroundColor: theme.tint }}
                aria-hidden="true"
              >
                <ProductIcon emoji={product.image} className="size-6" />
              </span>
              <div className="min-w-0">
                <h1 className="font-display text-xl font-bold leading-tight text-ink sm:text-2xl">
                  {product.nameBn}
                </h1>
                <p className="mt-1 text-[12px] font-medium text-muted sm:text-[13px]">
                  {unitLabel(product.unit)} · {product.categoryNameBn}
                </p>
                <p className="mt-1.5 text-[12px] leading-5 text-muted sm:text-[13px]">
                  {changeSummary(product)}
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-xl bg-[#f5f8f4] p-3 text-center sm:w-28">
              <p className="text-[10px] font-medium text-muted">আজকের দাম</p>
              <p className="mt-1 font-display text-[22px] font-bold leading-none text-ink">
                {formatPrice(product.today)}
              </p>
              <p className="mt-1 text-[10px] font-medium text-muted">
                টাকা / {unitShort(product.unit)}
              </p>
              <div className="mt-2 flex justify-center">
                <PriceBadge
                  direction={product.change.dir}
                  percent={product.change.pct}
                  variant="plain"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="price-summary-heading"
          className="mt-4 rounded-xl border border-line bg-white p-5 shadow-card sm:p-6"
        >
          <h2
            id="price-summary-heading"
            className="text-[13px] font-bold text-ink"
          >
            দামের সারসংক্ষেপ
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-line p-4">
              <p className="text-[11px] font-semibold text-down">সর্বনিম্ন দাম</p>
              <p className="mt-1.5 font-display text-xl font-bold leading-none text-down">
                {formatPrice(stats.min)}{" "}
                <span className="text-[11px] font-medium">টাকা</span>
              </p>
              <p className="mt-1.5 text-[11px] text-muted">
                সবচেয়ে কম দামের বাজার
              </p>
            </div>

            <div className="rounded-lg border border-line p-4">
              <p className="text-[11px] font-semibold text-up">সর্বোচ্চ দাম</p>
              <p className="mt-1.5 font-display text-xl font-bold leading-none text-up">
                {formatPrice(stats.max)}{" "}
                <span className="text-[11px] font-medium">টাকা</span>
              </p>
              <p className="mt-1.5 text-[11px] text-muted">
                সবচেয়ে বেশি দামের বাজার
              </p>
            </div>

            <div className="rounded-lg border border-line p-4">
              <p className="text-[11px] font-semibold text-forest">গড় দাম</p>
              <p className="mt-1.5 font-display text-xl font-bold leading-none text-forest">
                {formatPrice(stats.average)}{" "}
                <span className="text-[11px] font-medium">টাকা</span>
              </p>
              <p className="mt-1.5 text-[11px] text-muted">
                প্রতি {genitiveUnit(product.unit)} হিসাব
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="market-prices-heading"
          className="mt-4 rounded-xl border border-line bg-white p-5 shadow-card sm:p-6"
        >
          <h2
            id="market-prices-heading"
            className="text-[13px] font-bold text-ink"
          >
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="mt-4 overflow-x-auto rounded-lg border border-line">
            <table className="w-full border-collapse text-left text-[11.5px] sm:min-w-[520px] sm:text-[12.5px]">
              <thead>
                <tr className="border-b border-line bg-white text-[10px] font-semibold text-muted sm:text-[11px]">
                  <th className="py-3 pl-3 pr-3 font-semibold">বাজার</th>
                  <th className="hidden px-3 py-3 font-semibold sm:table-cell">
                    বিভাগ
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    সর্বনিম্ন
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    সর্বোচ্চ
                  </th>
                  <th className="py-3 pl-3 pr-3 text-right font-semibold">
                    গড়
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {product.markets.map((market) => (
                  <tr key={`${market.market}-${market.division}`}>
                    <td className="py-2.5 pl-3 pr-3 font-medium text-ink">
                      {market.market}
                    </td>
                    <td className="hidden px-3 py-2.5 text-muted sm:table-cell">
                      {market.division}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink/80">
                      {formatPrice(market.min)}{" "}
                      <span className="text-[10px] font-medium">টাকা</span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink/80">
                      {formatPrice(market.max)}{" "}
                      <span className="text-[10px] font-medium">টাকা</span>
                    </td>
                    <td className="py-2.5 pl-3 pr-3 text-right font-semibold tabular-nums text-ink">
                      {formatAverage((market.min + market.max) / 2)}{" "}
                      <span className="text-[10px] font-medium">টাকা</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
