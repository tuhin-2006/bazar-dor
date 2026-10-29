import { toBanglaDigits } from "@/lib/bn";
import { getCategories, getProducts, getTopFallers, getTopRisers } from "@/lib/products";
import { Hero } from "@/components/home/Hero";
import { ProductSection } from "@/components/home/ProductSection";
import { ProductCard } from "@/components/products/ProductCard";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const risers = getTopRisers(products, 6);
  const fallers = getTopFallers(products, 6);

  return (
    <>
      <Hero />

      <div className="shell space-y-9 pb-12 pt-7 sm:space-y-10">
        <ProductSection
          id="বেড়েছে"
          title="আজ দাম বেড়েছে"
          products={risers}
          tone="up"
        />

        <ProductSection
          id="কমেছে"
          title="আজ দাম কমেছে"
          products={fallers}
          tone="down"
        />

        <section id="সব-পণ্য" aria-labelledby="all-products-heading" className="scroll-mt-28">
          <h2
            id="all-products-heading"
            className="font-display text-[17px] font-bold text-ink sm:text-lg"
          >
            সব পণ্য
          </h2>
          <p className="mt-1 text-[10.5px] font-medium text-muted">
            মোট {toBanglaDigits(products.length)}টি পণ্য,{" "}
            {toBanglaDigits(categories.length)}টি ক্যাটাগরি
          </p>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
