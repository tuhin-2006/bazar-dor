import { ArrowDown, ArrowUp, Package } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";

interface ProductSectionProps {
  id: string;
  title: string;
  products: Product[];
  tone?: "up" | "down" | "default";
}

const TONES = {
  up: {
    icon: ArrowUp,
    iconClass: "text-up",
  },
  down: {
    icon: ArrowDown,
    iconClass: "text-down",
  },
  default: {
    icon: Package,
    iconClass: "text-forest",
  },
} as const;

export function ProductSection({
  id,
  title,
  products,
  tone = "default",
}: ProductSectionProps) {
  const { icon: Icon, iconClass } = TONES[tone];

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <div className="flex items-center gap-2">
        <Icon
          className={`size-3.5 ${iconClass}`}
          strokeWidth={3}
          aria-hidden="true"
        />
        <h2
          id={`${id}-heading`}
          className="font-display text-[17px] font-bold text-ink sm:text-lg"
        >
          {title}
        </h2>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
