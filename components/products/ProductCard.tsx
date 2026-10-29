import Link from "next/link";
import { formatPrice, unitLabel } from "@/lib/bn";
import { categoryTheme } from "@/lib/category-theme";
import type { Product } from "@/lib/types";
import { PriceBadge } from "@/components/products/PriceBadge";
import { ProductIcon } from "@/components/products/ProductIcon";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const theme = categoryTheme(product.category);

  return (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`${product.nameBn} — ${unitLabel(product.unit)}, আজ ${formatPrice(
        product.today,
      )} টাকা`}
      className="group flex flex-col gap-2.5 rounded-lg border border-line/70 bg-white p-3.5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-lift"
    >
      <div className="flex gap-3">
        <span
          className="grid size-10 shrink-0 place-items-center self-start rounded-full ring-1 ring-black/[0.03]"
          style={{ backgroundColor: theme.tint }}
        >
          <ProductIcon emoji={product.image} className="size-[22px]" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[13px] font-semibold leading-snug text-ink transition group-hover:text-forest">
            {product.nameBn}
          </h3>
          <p className="mt-0.5 text-[10.5px] text-muted">
            {unitLabel(product.unit)}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2">
        <div>
          <p className="text-[9px] font-medium text-muted">আজকের দাম</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="font-display text-[17px] font-bold leading-none text-ink">
              {formatPrice(product.today)}
            </span>
            <span className="text-[10px] font-medium text-muted">টাকা</span>
          </p>
        </div>

        <PriceBadge
          direction={product.change.dir}
          percent={product.change.pct}
        />
      </div>
    </Link>
  );
}
