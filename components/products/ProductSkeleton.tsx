export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse gap-3 rounded-xl border border-line bg-white p-3.5">
      <div className="size-11 shrink-0 rounded-full bg-paper-deep" />
      <div className="min-w-0 flex-1">
        <div className="h-3.5 w-2/3 rounded-full bg-paper-deep" />
        <div className="mt-2 h-2.5 w-1/3 rounded-full bg-paper-deep" />
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="h-6 w-16 rounded-full bg-paper-deep" />
          <div className="h-5 w-14 rounded-full bg-paper-deep" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
