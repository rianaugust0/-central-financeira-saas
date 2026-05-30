import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { brl } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store";
import { Plus, Sparkles, Trophy, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/metas")({
  head: () => ({ meta: [{ title: "Metas · Central Financeira" }] }),
  component: MetasPage,
});

function MetasPage() {
  const goals = useFinanceStore(s => s.goals);
  const addGoal = useFinanceStore(s => s.addGoal);
  const removeGoal = useFinanceStore(s => s.removeGoal);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", target: "", current: "0", deadline: "", color: "#3b82f6" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.target || !form.deadline) return;
    addGoal({
      name: form.name,
      target: parseFloat(form.target.replace(",", ".")),
      current: parseFloat(form.current.replace(",", ".")) || 0,
      deadline: form.deadline,
      color: form.color,
    });
    setShowModal(false);
    setForm({ name: "", target: "", current: "0", deadline: "", color: "#3b82f6" });
  };
  return (
    <>
      <PageHeader
        eyebrow="Onde você quer chegar"
        title="Suas metas financeiras"
        description="Defina objetivos, acompanhe o progresso e deixe a IA calcular quanto guardar por dia."
        actions={
          <button onClick={() => setShowModal(true)} className="h-10 px-4 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 shadow-glow hover:scale-105 transition-transform"><Plus className="h-4 w-4" /> Nova meta</button>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {goals.map((g) => {
          const pct = Math.round((g.current / g.target) * 100);
          const dias = Math.max(1, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000));
          const porDia = (g.target - g.current) / dias;
          return (
            <div key={g.id} className="rounded-2xl p-5 bg-card border border-border/60 shadow-card relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: g.color || '#3b82f6' }} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="h-8 w-8 rounded-full" style={{ backgroundColor: g.color || '#3b82f6' }} />
                  {pct >= 80 && <span className="text-[10px] px-2 py-1 rounded-md bg-success/15 text-success font-semibold inline-flex items-center gap-1"><Trophy className="h-3 w-3" /> Quase lá</span>}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <h3 className="font-semibold">{g.name}</h3>
                  <button onClick={() => removeGoal(g.id)} className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Excluir meta">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1">{brl(g.current)} <span className="text-sm text-muted-foreground font-normal">/ {brl(g.target)}</span></div>

                <div className="mt-4">
                  <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1.5">{pct}% concluído</div>
                </div>

                <div className="mt-4 rounded-xl bg-surface-elevated/60 border border-border/50 p-3 flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">Guarde <span className="text-foreground font-semibold">{brl(porDia)}/dia</span> para alcançar em {new Date(g.deadline).toLocaleDateString("pt-BR")}.</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border/50 shadow-2xl rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Nova Meta</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Objetivo (Ex: Comprar Carro)</label>
                <input required autoFocus value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Valor Total (R$)</label>
                  <input required type="number" step="0.01" value={form.target} onChange={e => setForm({...form, target: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Já Guardado (R$)</label>
                  <input type="number" step="0.01" value={form.current} onChange={e => setForm({...form, current: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Prazo (Data)</label>
                  <input required type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
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
