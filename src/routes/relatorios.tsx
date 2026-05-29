import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { brl } from "@/lib/utils";
import { useTotals, useCategoryBreakdown, useDailyFlow, useFinanceStore } from "@/lib/store";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, FileText } from "lucide-react";
import { ClientOnly, ChartSkeleton } from "@/components/ClientOnly";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios · Central Financeira" }] }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const flow = useDailyFlow(14);
  const cats = useCategoryBreakdown();
  const t = useTotals();
  const transactions = useFinanceStore(s => s.transactions);

  // accounts breakdown
  const accounts = ["Pessoal", "Negócio", "Família"].map((a) => {
    const items = transactions.filter((x) => x.account === a);
    return {
      name: a,
      entradas: items.filter((i) => i.type === "income").reduce((s, i) => s + i.amount, 0),
      saidas: items.filter((i) => i.type === "expense").reduce((s, i) => s + i.amount, 0),
    };
  });

  return (
    <>
      <PageHeader
        eyebrow="Relatórios"
        title="Visão analítica do seu dinheiro"
        description="Compare períodos, contas e categorias. Exporte em PDF ou Excel."
        actions={
          <>
            <button className="h-10 px-3 rounded-xl border border-border/60 text-sm inline-flex items-center gap-2 hover:bg-surface-elevated"><FileText className="h-4 w-4" /> PDF</button>
            <button className="h-10 px-3 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 shadow-glow"><Download className="h-4 w-4" /> Excel</button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl p-5 bg-card border border-border/60 shadow-card">
          <h3 className="font-semibold">Entradas vs Saídas por conta</h3>
          <p className="text-xs text-muted-foreground mb-3">Separação clara entre o seu negócio e a vida pessoal</p>
          <div className="h-72">
            <ClientOnly fallback={<ChartSkeleton />}><ResponsiveContainer width="100%" height="100%">
              <BarChart data={accounts} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.18)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip cursor={{ fill: "rgba(148,163,184,0.12)" }} content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-xl px-3 py-2 glass border border-border/70 text-xs shadow-elevated">
                      <div className="text-muted-foreground mb-1">{label}</div>
                      {payload.map((p: any, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                          <span className="text-muted-foreground">{p.name}</span>
                          <span className="ml-auto font-semibold tabular-nums">{brl(p.value)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }} />
                <Bar dataKey="entradas" fill="#34d399" radius={[8, 8, 0, 0]} />
                <Bar dataKey="saidas" fill="#f87171" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer></ClientOnly>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card border border-border/60 shadow-card">
          <h3 className="font-semibold">Resumo do mês</h3>
          <p className="text-xs text-muted-foreground mb-4">Lucro líquido consolidado</p>
          <ul className="space-y-3">
            {[
              { l: "Faturamento", v: brl(t.income), c: "text-success" },
              { l: "Custos & gastos", v: brl(t.expense), c: "text-destructive" },
              { l: "Lucro líquido", v: brl(t.balance), c: "text-foreground text-lg font-bold" },
              { l: "Margem", v: `${Math.round((t.balance / Math.max(t.income, 1)) * 100)}%`, c: "text-primary" },
            ].map((r) => (
              <li key={r.l} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <span className="text-sm text-muted-foreground">{r.l}</span>
                <span className={`font-semibold tabular-nums ${r.c}`}>{r.v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-5 bg-card border border-border/60 shadow-card">
          <h3 className="font-semibold">Categorias do mês</h3>
          <div className="h-56">
            <ClientOnly fallback={<ChartSkeleton />}><ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cats} dataKey="value" nameKey="name" outerRadius={84} stroke="none">
                  {cats.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Legend formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
              </PieChart>
            </ResponsiveContainer></ClientOnly>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-2xl p-5 bg-card border border-border/60 shadow-card">
          <h3 className="font-semibold">Tendência diária</h3>
          <p className="text-xs text-muted-foreground mb-3">Comportamento dos últimos 14 dias</p>
          <div className="h-56">
            <ClientOnly fallback={<ChartSkeleton />}><ResponsiveContainer width="100%" height="100%">
              <BarChart data={flow} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "rgba(148,163,184,0.12)" }} />
                <Bar dataKey="income" stackId="a" fill="#34d399" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" stackId="a" fill="#f87171" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer></ClientOnly>
          </div>
        </div>
      </div>
    </>
  );
}
