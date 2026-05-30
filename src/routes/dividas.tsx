import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { brl } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store";
import { AlertTriangle, Calendar, Sparkles, TrendingDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dividas")({
  head: () => ({ meta: [{ title: "Dívidas · Central Financeira" }] }),
  component: DividasPage,
});

function DividasPage() {
  const debts = useFinanceStore(s => s.debts);
  const addDebt = useFinanceStore(s => s.addDebt);
  const removeDebt = useFinanceStore(s => s.removeDebt);
  const restante = debts.reduce((a, b) => a + (b.total - b.paid), 0);
  const totalPago = debts.reduce((a, b) => a + b.paid, 0);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", total: "", paid: "0", due_date: "", color: "#ef4444" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.total || !form.due_date) return;
    addDebt({
      name: form.name,
      total: parseFloat(form.total.replace(",", ".")),
      paid: parseFloat(form.paid.replace(",", ".")) || 0,
      due_date: form.due_date,
      color: form.color,
    });
    setShowModal(false);
    setForm({ name: "", total: "", paid: "0", due_date: "", color: "#ef4444" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Controle de dívidas"
        title="Suas dívidas, sob controle"
        description="Acompanhe o saldo devedor e o progresso das suas quitações."
        actions={
          <button onClick={() => setShowModal(true)} className="h-10 px-4 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 shadow-glow hover:scale-105 transition-transform"><Plus className="h-4 w-4" /> Nova dívida</button>
        }
      />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <SummaryCard label="Total restante" value={brl(restante)} tone="warn" icon={AlertTriangle} />
        <SummaryCard label="Pago até agora" value={brl(totalPago)} tone="good" icon={TrendingDown} />
      </div>

      <div className="grid gap-3">
        {debts.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground border border-dashed border-border/50 rounded-2xl">
            Nenhuma dívida registrada.
          </div>
        ) : debts.map((d) => {
          const pct = d.total > 0 ? Math.round((d.paid / d.total) * 100) : 0;
          return (
            <div key={d.id} className="rounded-2xl p-5 bg-card border border-border/60 shadow-card relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 opacity-80" style={{ backgroundColor: d.color || '#94a3b8' }} />
              <div className="flex items-start justify-between gap-3 pl-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{d.name}</h3>
                    <button onClick={() => removeDebt(d.id)} className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Excluir dívida">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Vencimento: {d.due_date}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold tabular-nums">{brl(d.total - d.paid)}</div>
                  <div className="text-[11px] text-muted-foreground">de {brl(d.total)}</div>
                </div>
              </div>
              <div className="mt-4 pl-2">
                <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                </div>
                <div className="flex justify-between mt-2 text-[11px] text-muted-foreground">
                  <span>{pct}% pago</span>
                  <span>{brl(d.paid)} quitados</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border/50 shadow-2xl rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Nova Dívida</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Credor ou Descrição</label>
                <input required autoFocus value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ex: Financiamento" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Valor Total (R$)</label>
                  <input required type="number" step="0.01" value={form.total} onChange={e => setForm({...form, total: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Já Pago (R$)</label>
                  <input type="number" step="0.01" value={form.paid} onChange={e => setForm({...form, paid: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Vencimento (Dia ou Data)</label>
                  <input required value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ex: Todo dia 15" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Cor</label>
                  <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-full h-10 p-1 rounded-xl bg-surface-elevated border border-border/50 cursor-pointer" />
                </div>
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

function SummaryCard({ label, value, tone = "default", icon: Icon }: any) {
  const toneClass = { default: "text-foreground", good: "text-success", bad: "text-destructive", warn: "text-warning" }[tone as string];
  return (
    <div className="rounded-2xl p-4 bg-card border border-border/60 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className={`text-xl font-bold tabular-nums mt-2 ${toneClass}`}>{value}</div>
    </div>
  );
}
