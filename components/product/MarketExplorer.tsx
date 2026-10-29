"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { formatPrice, unitShort } from "@/lib/bn";
import type { MarketPrice } from "@/lib/types";

interface MarketExplorerProps {
  markets: MarketPrice[];
  unit: string;
  productName: string;
}

export function MarketExplorer({
  markets,
  unit,
  productName,
}: MarketExplorerProps) {
  const divisions = useMemo(
    () => ["সব", ...new Set(markets.map((market) => market.division))],
    [markets],
  );
  const [division, setDivision] = useState("সব");

  const filteredMarkets =
    division === "সব"
      ? markets
      : markets.filter((market) => market.division === division);

  const globalMin = Math.min(...markets.map((market) => market.min));
  const globalMax = Math.max(...markets.map((market) => market.max));
  const span = Math.max(globalMax - globalMin, 1);

  return (
    <div>
      <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {divisions.map((item) => {
          const active = division === item;
          const count =
            item === "সব"
              ? markets.length
              : markets.filter((market) => market.division === item).length;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setDivision(item)}
              aria-pressed={active}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                active
                  ? "border-forest bg-forest text-paper"
                  : "border-line bg-white/60 text-ink/70 hover:border-forest/25 hover:bg-white hover:text-forest"
              }`}
            >
              {item}
              <span
                className={`rounded-full px-1.5 text-[10px] ${
                  active ? "bg-white/15 text-paper" : "bg-paper-deep text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white/70">
        <div className="hidden grid-cols-[1.45fr_0.85fr_0.7fr_0.7fr_0.7fr_1.2fr] gap-3 border-b border-line bg-cream/70 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted md:grid">
          <span>বাজার</span>
          <span>বিভাগ</span>
          <span className="text-right">সর্বনিম্ন</span>
          <span className="text-right">সর্বোচ্চ</span>
          <span className="text-right">গড়</span>
          <span>দামের পরিসর</span>
        </div>

        <div className="divide-y divide-line/70">
          {filteredMarkets.map((market) => {
            const average = Math.round((market.min + market.max) / 2);
            const cheapest = market.min === globalMin;
            const start = ((market.min - globalMin) / span) * 100;
            const width = ((market.max - market.min) / span) * 100;

            return (
              <div
                key={`${market.division}-${market.market}`}
                className={`grid grid-cols-2 gap-x-3 gap-y-2 border-l-2 px-4 py-3 md:grid-cols-[1.45fr_0.85fr_0.7fr_0.7fr_0.7fr_1.2fr] md:items-center ${
                  cheapest
                    ? "border-l-down bg-down-soft/25"
                    : "border-l-transparent"
                }`}
              >
                <div className="col-span-2 flex items-center gap-2 md:col-span-1">
                  <MapPin
                    className="size-3.5 shrink-0 text-forest/50"
                    aria-hidden="true"
                  />
                  <span className="truncate text-[13px] font-semibold text-forest">
                    {market.market}
                  </span>
                  {cheapest ? (
                    <span className="shrink-0 rounded-full bg-down-soft px-1.5 py-0.5 text-[9px] font-bold text-down">
                      সবচেয়ে কম
                    </span>
                  ) : null}
                </div>

                <span className="hidden text-[11.5px] text-muted md:block">
                  {market.division}
                </span>

                <div className="flex items-baseline justify-between md:block md:text-right">
                  <span className="text-[10px] font-medium text-muted md:hidden">
                    সর্বনিম্ন
                  </span>
                  <span className="text-[13px] font-bold tabular-nums text-forest">
                    {formatPrice(market.min)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between md:block md:text-right">
                  <span className="text-[10px] font-medium text-muted md:hidden">
                    সর্বোচ্চ
                  </span>
                  <span className="text-[13px] font-semibold tabular-nums text-ink/80">
                    {formatPrice(market.max)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between md:block md:text-right">
                  <span className="text-[10px] font-medium text-muted md:hidden">
                    গড়
                  </span>
                  <span className="text-[13px] font-semibold tabular-nums text-ink/70">
                    {formatPrice(average)}
                  </span>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2">
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-paper-deep">
                      <span
                        className={`absolute top-0 h-full rounded-full ${
                          cheapest ? "bg-down" : "bg-forest/35"
                        }`}
                        style={{ left: `${start}%`, width: `${width}%` }}
                      />
                    </div>
                    <span className="w-14 shrink-0 text-right text-[10px] font-medium text-muted">
                      {formatPrice(market.min)}–{formatPrice(market.max)}
                    </span>
                  </div>
                  <span className="mt-1 block text-[10px] text-muted md:hidden">
                    {market.division} · টাকা/{unitShort(unit)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-[10.5px] text-muted">
        {productName}-এর {filteredMarkets.length}টি বাজারের তথ্য দেখানো হচ্ছে।
        দাম টাকায়, প্রতি {unitShort(unit)} হিসাবে।
      </p>
    </div>
  );
}
