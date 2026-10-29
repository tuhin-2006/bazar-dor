import { formatBanglaDate } from "@/lib/bn";
import { getCategories, getProducts } from "@/lib/products";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { NavbarAuth } from "@/components/layout/NavbarAuth";
import { PriceTicker } from "@/components/layout/PriceTicker";
import { Logo } from "@/components/ui/Logo";

export async function Header() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  const today = formatBanglaDate();

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-xl">
        <div className="shell flex h-16 items-center justify-between gap-3">
          <Logo date={today} />
          <NavbarAuth />
        </div>
      </div>

      <div className="border-b border-line bg-paper">
        <div className="shell">
          <CategoryNav categories={categories} />
        </div>
      </div>

      <PriceTicker products={products} />
    </>
  );
}
