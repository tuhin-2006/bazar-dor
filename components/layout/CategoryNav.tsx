"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import type { Category } from "@/lib/types";
import { ProductIcon } from "@/components/products/ProductIcon";

interface CategoryNavProps {
  categories: Category[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="পণ্যের ক্যাটাগরি"
      className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1.5 sm:pl-8"
    >
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className={`inline-flex shrink-0 items-center gap-1.5 px-1.5 py-1.5 text-[12px] font-semibold transition ${
          pathname === "/"
            ? "text-forest"
            : "text-muted hover:text-ink"
        }`}
      >
        <LayoutGrid className="size-3.5" aria-hidden="true" />
        সব পণ্য
      </Link>

      {categories.map((category) => {
        const active = pathname === `/category/${category.slug}`;

        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            aria-current={active ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-1.5 px-1.5 py-1.5 text-[12px] font-semibold transition ${
              active ? "text-forest" : "text-muted hover:text-ink"
            }`}
          >
            <ProductIcon emoji={category.icon} className="size-4" />
            {category.nameBn}
          </Link>
        );
      })}
    </nav>
  );
}
