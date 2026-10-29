import { changePrefix, formatPercent } from "@/lib/bn";
import type { ChangeDirection } from "@/lib/types";

interface PriceBadgeProps {
  direction: ChangeDirection;
  percent: number;
  size?: "sm" | "md";
  variant?: "soft" | "plain";
}

const STYLES: Record<ChangeDirection, string> = {
  up: "bg-up-soft text-up",
  down: "bg-down-soft text-down",
  flat: "bg-flat-soft text-flat",
};

const PLAIN_STYLES: Record<ChangeDirection, string> = {
  up: "text-up",
  down: "text-down",
  flat: "text-flat",
};

const LABELS: Record<ChangeDirection, string> = {
  up: "বেড়েছে",
  down: "কমেছে",
  flat: "অপরিবর্তিত",
};

export function PriceBadge({
  direction,
  percent,
  size = "sm",
  variant = "soft",
}: PriceBadgeProps) {
  return (
    <span
      title={`আজকের দাম ${formatPercent(percent)}% ${LABELS[direction]}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-md font-bold tabular-nums ${
        variant === "plain" ? PLAIN_STYLES[direction] : STYLES[direction]
      } ${size === "sm" ? "text-[10.5px]" : "text-xs"} ${
        variant === "plain" ? "" : size === "sm" ? "px-1.5 py-0.5" : "px-2.5 py-1"
      }`}
    >
      <span aria-hidden="true">{changePrefix(direction)}</span>
      <span>
        {formatPercent(percent)}%
        <span className="sr-only"> {LABELS[direction]}</span>
      </span>
    </span>
  );
}
