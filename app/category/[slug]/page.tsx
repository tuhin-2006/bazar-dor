import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toBanglaDigits } from "@/lib/bn";
import { categoryTheme } from "@/lib/category-theme";
import {
  getCategories,
  getCategoryBySlug,
  getCategoryProducts,
  sortProducts,
} from "@/lib/products";
import type { SortOption } from "@/lib/types";
import { EmptyCategory } from "@/components/category/EmptyCategory";
import { SortControl } from "@/components/category/SortControl";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductIcon } from "@/components/products/ProductIcon";

export async function generateMetadata(
  props: PageProps<"/category/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: "ক্যাটাগরি খুঁজে পাওয়া যায়নি" };

  return {
    title: `${category.nameBn} — আজকের দাম`,
    description: `${category.nameBn} ক্যাটাগরির সব পণ্যের আজকের বাজারদর, দামের ওঠানামা ও বাজারভিত্তিক তুলনা।`,
  };
}

function parseSort(value: string | string[] | undefined): SortOption {
  if (value === "price-asc" || value === "price-desc") return value;
  return "default";
}

function genitive(name: string): string {
  return /[ািীুূৃেৈোৌ]$/.test(name) ? `${name}র` : `${name}ের`;
}

function categoryIntro(count: number): string {
  return `${toBanglaDigits(count)}টি পণ্যের আজকের দাম ও পরিবর্তন`;
}

export default async function CategoryPage(
  props: PageProps<"/category/[slug]">,
) {
  const [{ slug }, searchParams, categories] = await Promise.all([
    props.params,
    props.searchParams,
    getCategories(),
  ]);

  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const products = await getCategoryProducts(slug);
  const sort = parseSort(searchParams.sort);
  const sortedProducts = sortProducts(products, sort);
  const theme = categoryTheme(category.slug);

  return (
    <div className="flex flex-1 flex-col bg-[#f5f8f4]">
      <div className="shell flex flex-1 flex-col py-6 sm:py-8">
        <section className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-4">
            <span
              className="grid size-13 shrink-0 place-items-center rounded-full"
              style={{ backgroundColor: theme.tint }}
              aria-hidden="true"
            >
              <ProductIcon emoji={category.icon} className="size-7" />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold leading-tight text-ink sm:text-2xl">
                {category.nameBn}
              </h1>
              <p className="mt-1 text-[12px] text-muted sm:text-[13px]">
                {categoryIntro(products.length)}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-3 flex items-center justify-end rounded-xl border border-line bg-white px-3 py-2 shadow-card">
          <SortControl value={sort} />
        </div>

        <p className="mb-2 mt-4 text-[11px] font-medium text-muted">
          {genitive(category.nameBn)} সব পণ্যের দাম
        </p>

        <section
          aria-label={`${category.nameBn} পণ্যের তালিকা`}
        >
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyCategory categoryName={category.nameBn} />
          )}
        </section>
      </div>
    </div>
  );
}
