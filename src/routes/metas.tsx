import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { brl } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store";
import { Plus, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/metas")({
  head: () => ({ meta: [{ title: "Metas · Central Financeira" }] }),
  component: MetasPage,
});

function MetasPage() {
  const goals = useFinanceStore(s => s.goals);
  return (
    <>
      <PageHeader
        eyebrow="Onde você quer chegar"
        title="Suas metas financeiras"
        description="Defina objetivos, acompanhe o progresso e deixe a IA calcular quanto guardar por dia."
        actions={
          <button className="h-10 px-4 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 shadow-glow"><Plus className="h-4 w-4" /> Nova meta</button>
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
                <h3 className="font-semibold mt-3">{g.name}</h3>
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
    </>
  );
}
