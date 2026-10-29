"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import type { SortOption } from "@/lib/types";

interface SortControlProps {
  value: SortOption;
}

const OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "default", label: "ডিফল্ট" },
  { value: "price-asc", label: "দাম: কম থেকে বেশি" },
  { value: "price-desc", label: "দাম: বেশি থেকে কম" },
];

export function SortControl({ value }: SortControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextSort = event.target.value as SortOption;
    const query = nextSort === "default" ? "" : `?sort=${nextSort}`;

    startTransition(() => {
      router.push(`${pathname}${query}`, { scroll: false });
    });
  }

  return (
    <label className="flex items-center gap-2">
      <span className="shrink-0 text-[11px] font-medium text-muted">
        সাজান
      </span>
      <span className="relative inline-flex items-center">
        <select
          value={value}
          onChange={handleChange}
          aria-label="পণ্য সাজানোর নিয়ম"
          className="h-8 appearance-none rounded-lg border border-line bg-white pl-3 pr-8 text-[11.5px] font-semibold text-ink outline-none transition hover:border-forest/30 focus:border-forest/40"
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isPending ? (
          <Loader2
            className="pointer-events-none absolute right-2.5 size-3.5 animate-spin text-muted"
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            className="pointer-events-none absolute right-2.5 size-3.5 text-muted"
            aria-hidden="true"
          />
        )}
      </span>
    </label>
  );
}
