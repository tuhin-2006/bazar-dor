/**
 * Only allow same-origin, app-relative redirects after auth.
 * Also avoid bouncing signed-in users back to the auth screens.
 */
export function safeRedirect(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.includes("\\")) return "/";
  if (/^\/(signin|signup)(?:[/?#]|$)/.test(value)) return "/";
  return value;
}
