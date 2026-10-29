const ICON_FILES: Record<string, string> = {
  "🍚": "1f35a",
  "🫘": "1fad8",
  "🫙": "1fad9",
  "🛢️": "1f6e2",
  "🛢": "1f6e2",
  "🥔": "1f954",
  "🧅": "1f9c5",
  "🌶️": "1f336",
  "🌶": "1f336",
  "🍆": "1f346",
  "🟢": "1f96c",
  "🐟": "1f41f",
  "🐠": "1f420",
  "🦐": "1f990",
  "🍗": "1f357",
  "🥩": "1f969",
  "🍖": "1f356",
  "🦆": "1f986",
  "🥚": "1f95a",
  "🥛": "1f95b",
  "🥣": "1f963",
  "🧈": "1f9c8",
  "🫚": "1fada",
  "🧄": "1f9c4",
  "🍃": "1f343",
  "🥬": "1f96c",
};

interface ProductIconProps {
  emoji: string;
  className?: string;
}

/**
 * Renders a bundled Twemoji SVG so product artwork looks the same on every
 * platform. Windows emoji fonts do not include several newer food emoji.
 */
export function ProductIcon({
  emoji,
  className = "size-[22px]",
}: ProductIconProps) {
  const file = ICON_FILES[emoji.trim()];

  if (!file) {
    return (
      <span className={`leading-none ${className}`} aria-hidden="true">
        {emoji}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/product-icons/${file}.svg`}
      alt=""
      className={`object-contain ${className}`}
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  );
}
