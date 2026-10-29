"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="paper-texture">
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <span className="grid size-16 place-items-center rounded-3xl bg-danger-soft text-danger">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-forest sm:text-3xl">
          বাজারে একটু গোলযোগ!
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted">
          ডেটা আনতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন। সমস্যা থেকে গেলে
          হোম পেজে ফিরে যান।
        </p>
        {error.digest ? (
          <p className="mt-2 text-[11px] text-muted/60">রেফারেন্স: {error.digest}</p>
        ) : null}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-paper transition hover:bg-forest-light"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            আবার চেষ্টা করুন
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full border border-forest/20 bg-white/60 px-5 text-sm font-semibold text-forest transition hover:bg-white"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
