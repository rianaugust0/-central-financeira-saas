// Hex equivalents of design system oklch tokens — recharts/SVG safe everywhere.
export const chartColors = {
  income: "#34d399",      // oklch(0.78 0.18 158)
  incomeSoft: "#34d39988",
  expense: "#f87171",     // oklch(0.68 0.22 22)
  expenseSoft: "#f8717188",
  warn: "#fbbf24",        // oklch(0.82 0.17 78)
  accent: "#60a5fa",      // oklch(0.72 0.16 250)
  purple: "#c084fc",      // oklch(0.72 0.18 305)
  muted: "#475569",
  grid: "rgba(148,163,184,0.15)",
  axis: "#94a3b8",
  surface: "#1f2937",
};

export const categoryColors: Record<string, string> = {
  Vendas: chartColors.income,
  Cartão: chartColors.expense,
  Mercado: chartColors.accent,
  Combustível: chartColors.warn,
  Insumos: chartColors.purple,
  Casa: chartColors.accent,
  Lazer: chartColors.purple,
  Educação: chartColors.accent,
  Saúde: chartColors.income,
  Outros: chartColors.muted,
};
