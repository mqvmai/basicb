export const priceMap: Record<number, string> = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

export function formatReviews(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
