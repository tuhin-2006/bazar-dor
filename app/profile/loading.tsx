export default function ProfileLoading() {
  return (
    <div className="flex flex-1 flex-col bg-[#f5f8f4]">
      <div className="shell flex flex-1 flex-col py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[600px] animate-pulse">
          <div className="mb-4">
            <div className="h-5 w-40 rounded-full bg-paper-deep" />
            <div className="mt-2 h-3 w-64 rounded-full bg-paper-deep" />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-paper-deep" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 rounded-full bg-paper-deep" />
                <div className="h-2.5 w-44 rounded-full bg-paper-deep" />
              </div>
            </div>
            <div className="h-9 w-24 rounded-lg bg-paper-deep" />
          </div>

          <div className="mt-4 rounded-xl border border-line bg-white p-4 sm:p-5">
            <div className="h-4 w-16 rounded-full bg-paper-deep" />
            <div className="mt-4 h-3 w-12 rounded-full bg-paper-deep" />
            <div className="mt-2 h-10 w-full rounded-lg bg-paper-deep" />
            <div className="mt-4 h-10 w-full rounded-lg bg-paper-deep" />
          </div>
        </div>
      </div>
    </div>
  );
}
