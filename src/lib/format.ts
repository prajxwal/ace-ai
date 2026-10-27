const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

/** "1.5K", "458.4K", as Zoko shows large counts. */
export function formatCompact(n: number): string {
  return compact.format(n);
}
