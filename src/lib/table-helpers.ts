export function normalizeSearch(text: string): string {
  return text.trim().toLowerCase();
}

export function matchesSearch(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return normalizeSearch(haystack).includes(normalizeSearch(needle));
}
