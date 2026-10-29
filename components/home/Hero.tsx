import Image from "next/image";
import { ArrowDown, Leaf } from "lucide-react";
import { formatBanglaDate } from "@/lib/bn";

export function Hero() {
  const today = formatBanglaDate();

  return (
    <section className="shell pt-5 sm:pt-6">
      <div className="relative overflow-hidden rounded-2xl border border-[#dcfce7] bg-[#f7fdf9] px-4 py-5 sm:px-7 sm:py-7 lg:px-9">
        <div
          className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-white/70 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative grid items-center gap-3 sm:grid-cols-[1.35fr_0.65fr] sm:gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-300 bg-green-200 px-3 py-1.5 text-[11px] font-semibold text-green-900">
              <Leaf className="size-3 text-forest" aria-hidden="true" />
              {today}
            </span>

            <h1 className="mt-3 font-display text-[1.7rem] font-bold leading-[1.2] tracking-tight text-ink sm:text-[2.05rem] lg:text-[2.3rem]">
              আজকের বাজারদর দাম এক নজর
            </h1>

            <p className="mt-2 max-w-xl text-[12.5px] leading-6 text-muted sm:text-[13px] sm:leading-7">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও অন্যান্য নিত্যপণ্য —
              বাজারভিত্তিক বিস্তারিত দাম, সবচেয়ে সাশ্রয়ী থেকে দামের পার্থক্য এক
              নজরে।
            </p>

            <a
              href="#সব-পণ্য"
              className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg bg-forest px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-forest-deep"
            >
              সব পণ্য দেখুন
              <ArrowDown className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="mx-auto w-full max-w-[160px] sm:max-w-[210px] lg:max-w-[240px]">
            <Image
              src="/bazar-hero.png"
              alt="তাজা ফল ও সবজিভরা বাজারের ঝুড়ি"
              width={315}
              height={263}
              priority
              sizes="(min-width: 1024px) 240px, (min-width: 640px) 210px, 160px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
