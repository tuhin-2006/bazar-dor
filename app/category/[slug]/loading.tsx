import { ProductGridSkeleton } from "@/components/products/ProductSkeleton";

export default function CategoryLoading() {
  return (
    <div className="shell animate-pulse py-6 sm:py-8">
      <div className="rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-paper-deep" />
          <div>
            <div className="h-6 w-28 rounded-md bg-paper-deep" />
            <div className="mt-2 h-3 w-44 rounded-full bg-paper-deep" />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2 shadow-card">
        <div className="h-4 w-24 rounded-full bg-paper-deep" />
        <div className="h-5 w-32 rounded-md bg-paper-deep" />
      </div>
      <div className="mt-3">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}
