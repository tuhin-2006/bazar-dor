import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  date: string;
  inverted?: boolean;
}

export function Logo({ date, inverted = false }: LogoProps) {
  return (
    <Link
      href="/"
      className="group inline-flex min-w-0 items-center gap-2.5"
      aria-label="বাজার দর — হোম পেজ"
    >
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-lg ring-1 transition-transform duration-300 group-hover:-rotate-6 ${
          inverted
            ? "bg-white/10 ring-white/20"
            : "bg-green-700 ring-green-800/20"
        }`}
      >
        <Image
          src="/logo-icon.png"
          alt=""
          width={18}
          height={18}
          priority
          className="size-[18px] object-contain brightness-0 invert"
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0">
        <span
          className={`block truncate font-display text-[1.05rem] font-bold leading-none tracking-tight ${
            inverted ? "text-white" : "text-ink"
          }`}
        >
          বাজার দর
        </span>
        <span
          className={`mt-1 block truncate text-[9px] font-medium leading-none ${
            inverted ? "text-white/60" : "text-muted"
          }`}
        >
          {date}
        </span>
      </span>
    </Link>
  );
}
