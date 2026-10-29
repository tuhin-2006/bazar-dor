export interface CategoryTheme {
  tint: string;
  accent: string;
  chip: string;
}

export const CATEGORY_THEME: Record<string, CategoryTheme> = {
  chal: { tint: "#F8EBCF", accent: "#9A6A14", chip: "#F4E3BC" },
  dal: { tint: "#F6E8DE", accent: "#92562F", chip: "#F1DDCF" },
  tel: { tint: "#FAF0D3", accent: "#96700F", chip: "#F6E7BE" },
  sobji: { tint: "#E6F2E2", accent: "#35743A", chip: "#DCEED6" },
  mach: { tint: "#E2EFF4", accent: "#28697E", chip: "#D6E9F0" },
  mangsho: { tint: "#F8E5E1", accent: "#A5412E", chip: "#F3D7D1" },
  "dim-dui": { tint: "#FBF3DA", accent: "#8E7013", chip: "#F7ECCB" },
  mosla: { tint: "#F9E7DB", accent: "#A45222", chip: "#F5DCCB" },
};

export const DEFAULT_CATEGORY_THEME: CategoryTheme = {
  tint: "#F3EFE4",
  accent: "#4D5B52",
  chip: "#EAE4D6",
};

export function categoryTheme(slug: string): CategoryTheme {
  return CATEGORY_THEME[slug] ?? DEFAULT_CATEGORY_THEME;
}
