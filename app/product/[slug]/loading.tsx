export default function ProductLoading() {
  return (
    <div className="shell animate-pulse py-6 sm:py-8">
      <div className="h-3.5 w-48 rounded-full bg-paper-deep" />

      <div className="mt-4 rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex gap-3">
            <div className="size-12 rounded-full bg-paper-deep" />
            <div className="flex-1">
              <div className="h-6 w-48 rounded-md bg-paper-deep" />
              <div className="mt-2 h-3 w-32 rounded-full bg-paper-deep" />
              <div className="mt-3 h-3 w-72 max-w-full rounded-full bg-paper-deep" />
            </div>
          </div>
          <div className="h-24 w-full rounded-lg bg-paper-deep sm:w-40" />
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="h-3.5 w-32 rounded-full bg-paper-deep" />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="h-14 rounded-lg bg-paper-deep" />
          <div className="h-14 rounded-lg bg-paper-deep" />
          <div className="h-14 rounded-lg bg-paper-deep" />
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="h-3.5 w-32 rounded-full bg-paper-deep" />
        <div className="mt-4 space-y-3">
          <div className="h-8 rounded-lg bg-paper-deep" />
          <div className="h-8 rounded-lg bg-paper-deep" />
          <div className="h-8 rounded-lg bg-paper-deep" />
          <div className="h-8 rounded-lg bg-paper-deep" />
        </div>
      </div>
    </div>
  );
}
