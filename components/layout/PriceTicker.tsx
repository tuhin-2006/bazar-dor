import { changePrefix, formatPercent, formatPrice, unitShort } from "@/lib/bn";
import type { Product } from "@/lib/types";
import { ProductIcon } from "@/components/products/ProductIcon";

interface PriceTickerProps {
  products: Product[];
}

const CHANGE_STYLES = {
  up: "text-up",
  down: "text-down",
  flat: "text-flat",
} as const;

function TickerItems({ products }: PriceTickerProps) {
  return products.map((product) => (
    <span
      key={product.id}
      className="inline-flex shrink-0 items-center gap-1.5 border-r border-line px-3 text-[10.5px]"
    >
      <ProductIcon emoji={product.image} className="size-3.5" />
      <span className="font-medium text-muted">{product.nameBn}</span>
      <span className="font-semibold tabular-nums text-ink">
        {formatPrice(product.today)} টাকা/{unitShort(product.unit)}
      </span>
      <span
        className={`inline-flex items-center gap-0.5 font-bold tabular-nums ${CHANGE_STYLES[product.change.dir]}`}
      >
        <span aria-hidden="true">{changePrefix(product.change.dir)}</span>
        {formatPercent(product.change.pct)}%
      </span>
    </span>
  ));
}

export function PriceTicker({ products }: PriceTickerProps) {
  return (
    <div
      className="marquee-paused relative flex h-[34px] items-stretch overflow-hidden border-b border-line bg-paper text-ink"
      aria-label="আজকের বাজারদরের লাইভ টিকার"
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="marquee-track h-[34px] items-center">
          <div className="flex h-[34px] items-center">
            <TickerItems products={products} />
          </div>
          <div className="flex h-[34px] items-center" aria-hidden="true">
            <TickerItems products={products} />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-10 bg-gradient-to-l from-paper to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
