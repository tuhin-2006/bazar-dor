import { formatPercent, formatPrice, unitShort } from "@/lib/bn";
import type { Product } from "@/lib/types";

interface PriceHistoryProps {
  product: Product;
}

function percentageChange(from: number, to: number): number {
  if (from === 0) return 0;
  return ((to - from) / from) * 100;
}

export function PriceHistory({ product }: PriceHistoryProps) {
  const history = [
    { label: "গত মাসে", value: product.lastMonth, tone: "muted" },
    { label: "গত সপ্তাহে", value: product.lastWeek, tone: "muted" },
    { label: "গতকাল", value: product.yesterday, tone: "muted" },
    { label: "আজ", value: product.today, tone: "today" },
  ];
  const maximum = Math.max(...history.map((item) => item.value), 1);
  const weekChange = percentageChange(product.lastWeek, product.today);
  const monthChange = percentageChange(product.lastMonth, product.today);
  const yesterdayChange = percentageChange(product.yesterday, product.today);

  const summaries = [
    { label: "গতকালের তুলনায়", value: yesterdayChange },
    { label: "গত সপ্তাহের তুলনায়", value: weekChange },
    { label: "গত মাসের তুলনায়", value: monthChange },
  ];

  return (
    <div className="rounded-[28px] border border-line bg-white/70 p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
            দামের প্রবণতা
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-forest">
            গত এক মাসের পরিবর্তন
          </h2>
        </div>
        <span className="rounded-full bg-cream px-3 py-1 text-[10.5px] font-semibold text-muted">
          প্রতি {unitShort(product.unit)} · টাকায়
        </span>
      </div>

      <div className="mt-6 grid grid-cols-4 items-end gap-2 sm:gap-4">
        {history.map((item) => {
          const height = 24 + (item.value / maximum) * 76;

          return (
            <div key={item.label} className="text-center">
              <p
                className={`font-display text-sm font-bold tabular-nums sm:text-base ${
                  item.tone === "today" ? "text-forest" : "text-ink/65"
                }`}
              >
                {formatPrice(item.value)}
              </p>
              <div className="mt-2 flex h-32 items-end justify-center">
                <div
                  className={`w-full max-w-12 rounded-t-xl transition-all ${
                    item.tone === "today"
                      ? "bg-forest shadow-sm"
                      : "bg-paper-deep"
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <p
                className={`mt-2 text-[10.5px] font-semibold ${
                  item.tone === "today" ? "text-forest" : "text-muted"
                }`}
              >
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line/80 bg-cream/45 py-3">
        {summaries.map((summary) => {
          const up = summary.value > 0.05;
          const down = summary.value < -0.05;

          return (
            <div key={summary.label} className="px-2 text-center">
              <p className="text-[9.5px] font-medium leading-tight text-muted">
                {summary.label}
              </p>
              <p
                className={`mt-1 text-[12px] font-bold tabular-nums ${
                  up ? "text-up" : down ? "text-down" : "text-flat"
                }`}
              >
                {up ? "▲" : down ? "▼" : "—"} {formatPercent(summary.value)}%
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[10.5px] leading-5 text-muted">
        * দামের প্রবণতা গত মাস, গত সপ্তাহ ও গতকালের তথ্যের সঙ্গে তুলনা করে
        দেখানো হয়েছে।
      </p>
    </div>
  );
}
