import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="paper-texture relative overflow-hidden">
      <div className="shell flex min-h-[62vh] flex-col items-center justify-center py-16 text-center sm:py-24">
        <div className="relative">
          <p className="font-display text-[6.5rem] font-bold leading-none tracking-tight text-forest sm:text-[9rem]">
            404
          </p>
          <span className="absolute -right-6 top-2 rotate-12 text-4xl sm:-right-10 sm:text-5xl" aria-hidden="true">
            🧺
          </span>
          <span className="absolute -left-4 bottom-2 -rotate-12 text-2xl sm:-left-8 sm:text-3xl" aria-hidden="true">
            🥕
          </span>
        </div>

        <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          <SearchX className="size-3.5" aria-hidden="true" />
          পেজটি খুঁজে পাওয়া যায়নি
        </span>

        <h1 className="mt-5 max-w-xl font-display text-2xl font-bold leading-snug text-forest sm:text-3xl">
          এই বাজারে এমন কিছু নেই!
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted">
          আপনি যে পেজটি খুঁজছেন সেটি সরিয়ে ফেলা হয়েছে অথবা লিংকটি ভুল। চলুন,
          আবার বাজারে ফিরে যাই।
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-paper transition hover:bg-forest-light"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            হোম পেজে ফিরে যান
          </Link>
          <Link
            href="/#সব-পণ্য"
            className="inline-flex h-11 items-center rounded-full border border-forest/20 bg-white/60 px-5 text-sm font-semibold text-forest transition hover:border-forest/35 hover:bg-white"
          >
            সব পণ্য দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}
