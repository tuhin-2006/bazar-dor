import Link from "next/link";
import { ArrowLeft, PackageOpen } from "lucide-react";

interface EmptyCategoryProps {
  categoryName?: string;
}

export function EmptyCategory({ categoryName }: EmptyCategoryProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-dashed border-line bg-white/55 px-5 py-14 text-center sm:py-20">
      <div
        className="dot-grid absolute inset-x-0 top-0 h-28 opacity-30"
        aria-hidden="true"
      />
      <div className="relative">
        <span className="mx-auto grid size-20 place-items-center rounded-[24px] bg-cream text-5xl shadow-sm ring-1 ring-black/[0.03]">
          🧺
        </span>
        <p className="mt-5 font-display text-[3.5rem] font-bold leading-none text-forest/20">
          ৪০৪
        </p>
        <h2 className="mt-3 font-display text-xl font-bold text-forest sm:text-2xl">
          {categoryName
            ? `“${categoryName}” ক্যাটাগরিতে এখন কোনো পণ্য নেই`
            : "ক্যাটাগরিটি খুঁজে পাওয়া যায়নি"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
          {categoryName
            ? "এই ক্যাটাগরিতে পণ্য যুক্ত হলে এখানেই দেখা যাবে। ততক্ষণ অন্য ক্যাটাগরি ঘুরে দেখুন।"
            : "লিংকটি ভুল হতে পারে, অথবা ক্যাটাগরিটি সরিয়ে ফেলা হয়েছে। হোম পেজ থেকে আবার শুরু করুন।"}
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
            className="inline-flex h-11 items-center gap-2 rounded-full border border-forest/20 bg-white px-5 text-sm font-semibold text-forest transition hover:border-forest/35"
          >
            <PackageOpen className="size-4" aria-hidden="true" />
            সব পণ্য দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}
