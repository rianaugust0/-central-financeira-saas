import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { brl } from "@/lib/utils";
import { categories } from "@/lib/constants";
import { useFinanceStore } from "@/lib/store";
import { Filter, Download, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/transacoes")({
  head: () => ({ meta: [{ title: "Transações · Central Financeira" }] }),
  component: TransacoesPage,
});

function TransacoesPage() {
  const transactions = useFinanceStore(s => s.transactions);
  const addTransaction = useFinanceStore(s => s.addTransaction);
  const removeTransaction = useFinanceStore(s => s.removeTransaction);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", type: "expense", category: "Outros" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    addTransaction({
      description: form.description,
      amount: parseFloat(form.amount.replace(",", ".")),
      type: form.type as any,
      category: form.category,
      source: "Manual",
      account: "Pessoal"
    });
    setShowModal(false);
    setForm({ description: "", amount: "", type: "expense", category: "Outros" });
  };
  const list = useMemo(() => transactions.filter((t) => {
    if (filter !== "all" && t.type !== filter) return false;
    if (q && !`${t.description} ${t.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, filter]);

  const grouped = useMemo(() => {
    const m = new Map<string, typeof transactions>();
    for (const t of list) {
      const k = t.date.slice(0, 10);
      if (!m.has(k)) m.set(k, [] as any);
      m.get(k)!.push(t);
    }
    return Array.from(m.entries());
  }, [list]);

  return (
    <>
      <PageHeader
        eyebrow="Movimentações"
        title="Transações"
        description="Tudo que entrou e saiu, organizado pela IA. Filtre, busque ou exporte."
        actions={
          <>
            <button className="h-10 px-3 rounded-xl border border-border/60 text-sm inline-flex items-center gap-2 hover:bg-surface-elevated"><Download className="h-4 w-4" /> Exportar</button>
            <button onClick={() => setShowModal(true)} className="h-10 px-4 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 shadow-glow"><Plus className="h-4 w-4" /> Nova</button>
          </>
        }
      />

      <div className="rounded-2xl p-4 bg-card border border-border/60 shadow-card">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-elevated/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-1 p-1 rounded-xl bg-surface-elevated/60 border border-border/60">
            {(["all","income","expense"] as const).map((k) => (
              <button key={k} onClick={() => setFilter(k)} className={`px-3 h-8 rounded-lg text-xs font-medium ${filter === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {k === "all" ? "Tudo" : k === "income" ? "Entradas" : "Saídas"}
              </button>
            ))}
          </div>
          <button className="h-10 px-3 rounded-xl border border-border/60 text-sm inline-flex items-center gap-2 hover:bg-surface-elevated"><Filter className="h-4 w-4" /> Filtros</button>
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {grouped.map(([date, items]) => {
          const sum = items.reduce((a, b) => a + (b.type === "income" ? b.amount : -b.amount), 0);
          return (
            <div key={date}>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {new Date(date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                </span>
                <span className={`text-xs font-semibold tabular-nums ${sum >= 0 ? "text-success" : "text-destructive"}`}>{sum >= 0 ? "+" : ""}{brl(sum)}</span>
              </div>
              <ul className="rounded-2xl bg-card border border-border/60 shadow-card divide-y divide-border/50">
                {items.map((tx) => (
                  <li key={tx.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="h-10 w-10 rounded-xl grid place-items-center bg-surface-elevated text-lg">{categories[tx.category]?.icon || "💰"}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{tx.description}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-muted-foreground">{tx.account}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">{tx.category} · {tx.source}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-sm font-semibold tabular-nums ${tx.type === "income" ? "text-success" : "text-foreground"}`}>
                        {tx.type === "income" ? "+" : "−"} {brl(tx.amount)}
                      </div>
                      <button onClick={() => removeTransaction(tx.id)} className="p-2 -mr-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border/50 shadow-2xl rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Nova Transação</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Descrição</label>
                <input required autoFocus value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ex: Conta de luz" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Valor (R$)</label>
                  <input required type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Tipo</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                    <option value="expense">Saída</option>
                    <option value="income">Entrada</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Categoria</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                  {Object.keys(categories).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-xl border border-border/50 font-semibold hover:bg-surface-elevated transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-bold shadow-glow hover:scale-105 transition-transform">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
