import { ProductGridSkeleton } from "@/components/products/ProductSkeleton";

export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      <div className="shell pt-5 sm:pt-6">
        <div className="h-[210px] rounded-2xl border border-line bg-paper-deep/60" />
      </div>

      <div className="shell space-y-9 pb-12 pt-7 sm:space-y-10">
        <div>
          <div className="h-6 w-40 rounded-md bg-paper-deep" />
          <div className="mt-3">
            <ProductGridSkeleton count={6} />
          </div>
        </div>

        <div>
          <div className="h-6 w-40 rounded-md bg-paper-deep" />
          <div className="mt-3">
            <ProductGridSkeleton count={6} />
          </div>
        </div>

        <div>
          <div className="h-6 w-32 rounded-md bg-paper-deep" />
          <div className="mt-3">
            <ProductGridSkeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
