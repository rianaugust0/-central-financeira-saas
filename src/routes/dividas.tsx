import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { brl } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store";
import { AlertTriangle, Calendar, Sparkles, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/dividas")({
  head: () => ({ meta: [{ title: "Dívidas · Central Financeira" }] }),
  component: DividasPage,
});

function DividasPage() {
  const debts = useFinanceStore(s => s.debts);
  const restante = debts.reduce((a, b) => a + (b.total - b.paid), 0);
  const totalPago = debts.reduce((a, b) => a + b.paid, 0);

  return (
    <>
      <PageHeader
        eyebrow="Controle de dívidas"
        title="Suas dívidas, sob controle"
        description="Acompanhe o saldo devedor e o progresso das suas quitações."
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
                <div>
                  <h3 className="text-base font-semibold">{d.name}</h3>
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
