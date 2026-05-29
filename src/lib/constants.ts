import { categoryColors } from "./chart-colors";

export const categories: Record<string, { color: string; icon: string }> = {
  Vendas: { color: categoryColors.Vendas, icon: "🥟" },
  Cartão: { color: categoryColors.Cartão, icon: "💳" },
  Mercado: { color: categoryColors.Mercado, icon: "🛒" },
  Combustível: { color: categoryColors.Combustível, icon: "⛽" },
  Insumos: { color: categoryColors.Insumos, icon: "📦" },
  Casa: { color: categoryColors.Casa, icon: "🏠" },
  Lazer: { color: categoryColors.Lazer, icon: "🎬" },
  Educação: { color: categoryColors.Educação, icon: "📚" },
  Saúde: { color: categoryColors.Saúde, icon: "💊" },
  Outros: { color: categoryColors.Outros, icon: "✨" },
};
