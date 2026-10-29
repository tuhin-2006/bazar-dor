"use client";

import { useState } from "react";

interface UserAvatarProps {
  name: string;
  src?: string | null;
  /** Sizing/rounding classes for the avatar box, e.g. `size-8 rounded-lg`. */
  className?: string;
  /** Font size for the initials fallback. */
  textClassName?: string;
}

function initialOf(name: string): string {
  const first = Array.from(name.trim())[0];
  return first ? first.toUpperCase() : "?";
}

/**
 * Shows the provider profile picture (e.g. Google) when the user has one, and
 * falls back to the user's initial for email/password accounts or when the
 * remote image fails to load.
 */
export function UserAvatar({
  name,
  src,
  className = "",
  textClassName = "text-[11px]",
}: UserAvatarProps) {
  // Remember which URL failed so a broken Google image shows the initial
  // instead of the browser's broken-image icon.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = failedSrc === src ? null : src;

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden bg-green-50 font-bold text-forest ring-1 ring-green-100 ${className}`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          className="size-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <span className={textClassName}>{initialOf(name)}</span>
      )}
    </span>
  );
}
