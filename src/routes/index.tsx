import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { brl } from "@/lib/utils";
import { categories } from "@/lib/constants";
import { useTotals, useDailyFlow, useCategoryBreakdown, useFinancialScore, useFinanceStore } from "@/lib/store";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Sparkles, Send, Mic, ArrowUpRight, ArrowDownRight, Zap, Flame, Target, Trophy } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { ClientOnly, ChartSkeleton } from "@/components/ClientOnly";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inteligência Financeira · Premium" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const t = useTotals();
  const flow = useDailyFlow(14);
  const cats = useCategoryBreakdown();
  const score = useFinancialScore();
  const debts = useFinanceStore(s => s.debts);
  const debtTotal = debts.reduce((a, b) => a + (b.total - b.paid), 0);
  const debtPaid = debts.reduce((a, b) => a + b.paid, 0);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
    >
      <PageHeader
        eyebrow="Resumo de Elite"
        title="Bem-vindo, Márcio"
        description="Monitoramento neural ativo. Controle absoluto sobre seu dinheiro."
      />

      <motion.div variants={itemVariant} className="mb-6">
        <HeroCard t={t} debtTotal={debtTotal} />
      </motion.div>

      <motion.div variants={itemVariant} className="mb-6">
        <AIInput />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <motion.div variants={itemVariant} className="xl:col-span-2 rounded-[2rem] p-6 sm:p-8 bg-card border border-border/30 shadow-card relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 relative z-10">
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">Fluxo Neural</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Análise dos últimos 14 dias</p>
            </div>
            <div className="flex gap-1.5 p-1.5 rounded-2xl bg-surface-elevated/40 border border-border/30 backdrop-blur-xl">
              <Chip active>14 d</Chip>
              <Chip>30 d</Chip>
              <Chip>1 a</Chip>
            </div>
          </div>
          <div className="h-[280px] relative z-10">
            <ClientOnly fallback={<ChartSkeleton />}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flow} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.18 158)" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="oklch(0.78 0.18 158)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.68 0.22 22)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.68 0.22 22)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} dx={-10} />
                  <Tooltip content={<ChartTip />} cursor={{ stroke: 'oklch(0.78 0.18 158 / 0.5)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="natural" dataKey="income" stroke="oklch(0.78 0.18 158)" strokeWidth={4} fill="url(#inc)" activeDot={{ r: 6, fill: "oklch(0.78 0.18 158)", stroke: "var(--background)", strokeWidth: 3 }} />
                  <Area type="natural" dataKey="expense" stroke="oklch(0.68 0.22 22)" strokeWidth={2} fill="url(#exp)" />
                </AreaChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </motion.div>

        <motion.div variants={itemVariant}>
          <ScoreCardPremium score={score.score} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <motion.div variants={itemVariant} className="xl:col-span-2">
          <EvolutionBlock balance={t.balance} debtPaid={debtPaid} />
        </motion.div>
        <motion.div variants={itemVariant}>
          <WhereMoneyWent cats={cats} />
        </motion.div>
      </div>

    </motion.div>
  );
}

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
};

function HeroCard({ t, debtTotal }: { t: any; debtTotal: number }) {
  const balance = t.income - t.expense;
  return (
    <div className="rounded-[2.5rem] p-8 sm:p-12 bg-card border border-border/20 shadow-neon relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Patrimônio Líquido</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-success/15 text-success font-bold uppercase tracking-wider shadow-[0_0_10px_var(--color-success)]">+12% este mês</span>
          </div>
          <div className="text-5xl sm:text-7xl font-black tracking-tighter text-gradient-primary drop-shadow-md mb-2">
            {brl(t.balance)}
          </div>
          <p className="text-sm text-muted-foreground font-medium max-w-sm">
            Sobrando <span className="text-foreground font-bold">{brl(balance)}</span> neste mês. Sua projeção indica crescimento contínuo.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <HeroMini label="Entradas" value={brl(t.income)} icon={ArrowUpRight} tone="good" />
          <HeroMini label="Saídas" value={brl(t.expense)} icon={ArrowDownRight} tone="bad" />
        </div>
      </div>
    </div>
  );
}

function HeroMini({ label, value, icon: Icon, tone }: any) {
  const c = tone === "good" ? "text-success" : "text-destructive";
  return (
    <div className="glass rounded-2xl p-4 border border-border/40 flex items-center gap-4 min-w-[200px] shadow-sm">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-surface-elevated ${c}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</div>
        <div className={`text-lg font-extrabold tracking-tight ${c}`}>{value}</div>
      </div>
    </div>
  );
}

function AIInput() {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const parsed = useMemo(() => parseFinancialText(text), [text]);
  const addTransaction = useFinanceStore(s => s.addTransaction);

  const handleSave = () => {
    if (parsed.length === 0) return;
    parsed.forEach(p => {
      addTransaction({
        description: p.description || "Transação manual",
        amount: p.amount,
        type: p.type,
        category: p.category,
        source: "Assistente",
        account: "Pessoal"
      });
    });
    setText("");
  };

  const placeholder = "Digite: 'Gastei 50 no ifood' ou 'Recebi 200 de freela'...";

  return (
    <div className="rounded-[2rem] p-6 bg-surface-elevated/30 border border-border/30 shadow-card relative overflow-hidden backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-glow opacity-10 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="h-8 w-8 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-extrabold tracking-tight">Assistente Financeiro</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Processamento em linguagem natural</p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 rounded-2xl bg-surface/50 border border-border/50 px-4 py-3 focus-within:ring-2 ring-primary/40 focus-within:border-primary/50 transition-all shadow-inner">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/60 font-medium"
          />
          <button className="h-10 w-10 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors" aria-label="Áudio">
            <Mic className="h-5 w-5" />
          </button>
          <button onClick={handleSave} className="h-10 px-5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-extrabold inline-flex items-center gap-2 shadow-neon hover:scale-105 transition-transform">
            <Send className="h-4 w-4" /> 
            <span className="hidden sm:inline">Salvar</span>
          </button>
        </div>

        {/* Sugestões rápidas (Chips) */}
        {!text && (
          <div className="flex flex-wrap gap-2 mt-4">
            <ActionChip icon="🍔" text="Gastei no Ifood" onClick={() => setText("Gastei 0 no ifood")} />
            <ActionChip icon="⛽" text="Abasteci o carro" onClick={() => setText("Gastei 0 no posto")} />
            <ActionChip icon="💸" text="Paguei conta" onClick={() => setText("Paguei 0 de luz")} />
            <ActionChip icon="💰" text="Recebi Pix" onClick={() => setText("Recebi 0 de pix")} />
          </div>
        )}

        <AnimatePresence>
          {parsed.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="grid sm:grid-cols-2 gap-3"
            >
              {parsed.map((p, i) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="rounded-2xl p-4 glass border border-primary/20 flex items-center gap-4 shadow-sm"
                >
                  <div className="h-12 w-12 rounded-xl bg-surface-elevated/80 grid place-items-center text-2xl shadow-inner border border-border/50">
                    {p.type === "income" ? "💰" : "💸"}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{p.description}</div>
                    <div className="text-[10px] uppercase tracking-widest text-primary font-bold">{p.category}</div>
                  </div>
                  <div className={`text-lg font-black tabular-nums ${p.type === "income" ? "text-success" : "text-destructive"}`}>
                    {brl(p.amount)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ActionChip({ icon, text, onClick }: { icon: string, text: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated/40 border border-border/40 hover:bg-surface-elevated hover:border-border/60 transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground"
    >
      <span>{icon}</span> {text}
    </button>
  );
}

// ... Rest of the components (ScoreCardPremium, EvolutionBlock, WhereMoneyWent, parseFinancialText) ...

function ScoreCardPremium({ score }: { score: number }) {
  // Animando o valor
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setVal(score), 300);
    return () => clearTimeout(t);
  }, [score]);

  // Lógica emocional
  let toneClass = "text-success";
  let msg = "Seu império está prosperando! Continue assim.";
  let glowColor = "oklch(0.78 0.18 158)";
  
  if (score < 500) {
    toneClass = "text-destructive";
    msg = "Seu padrão financeiro exige ajustes imediatos.";
    glowColor = "oklch(0.68 0.22 22)";
  } else if (score < 700) {
    toneClass = "text-warning";
    msg = "Atenção: Seu fluxo atual está comprometido.";
    glowColor = "oklch(0.82 0.17 78)";
  }

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (val / 1000) * circumference;

  return (
    <div className="h-full rounded-[2rem] p-8 bg-card border border-border/30 shadow-card relative overflow-hidden flex flex-col items-center justify-center group">
      <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8 text-center">Saúde Financeira</h3>
      
      <div className="relative h-48 w-48 flex items-center justify-center">
        {/* Glow behind circle */}
        <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ backgroundColor: glowColor }} />
        
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-elevated" />
          <motion.circle
            cx="100" cy="100" r="90" fill="none"
            stroke={glowColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black tabular-nums tracking-tighter drop-shadow-md">{val}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">/ 1000</span>
        </div>
      </div>

      <p className={`mt-8 text-center text-sm font-semibold max-w-[200px] leading-relaxed ${toneClass}`}>
        {msg}
      </p>
    </div>
  );
}

function EvolutionBlock({ balance, debtPaid }: { balance: number; debtPaid: number }) {
  const hasSavings = balance > 0;
  const hasDebtPaid = debtPaid > 0;
  return (
    <div className="rounded-[2rem] p-6 sm:p-8 bg-card border border-border/30 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
          <Trophy className="h-4 w-4 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold tracking-tight">Sua Evolução</h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Conquistas do mês</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 border border-success/30 bg-success/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Target className="h-16 w-16" /></div>
          <div className="text-[10px] font-bold text-success uppercase tracking-widest mb-2">Economia Acumulada</div>
          <div className="text-3xl font-black text-foreground mb-1">{hasSavings ? `+ ${brl(balance)}` : "R$ 0,00"}</div>
          <div className="text-xs font-semibold text-muted-foreground">{hasSavings ? "Você está no verde este mês. Continue assim!" : "Você ainda não tem economia acumulada."}</div>
        </div>
        
        <div className="rounded-2xl p-5 border border-primary/30 bg-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Flame className="h-16 w-16" /></div>
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Dívidas Reduzidas</div>
          <div className="text-3xl font-black text-foreground mb-1">{hasDebtPaid ? `- ${brl(debtPaid)}` : "R$ 0,00"}</div>
          <div className="text-xs font-semibold text-muted-foreground">{hasDebtPaid ? "Sua dívida caiu consideravelmente com os pagamentos." : "Nenhum pagamento de dívida registrado."}</div>
        </div>
      </div>
    </div>
  );
}

function WhereMoneyWent({ cats }: { cats: any[] }) {
  return (
    <div className="rounded-[2rem] p-6 sm:p-8 bg-card border border-border/30 shadow-card h-full">
      <h3 className="text-xl font-extrabold tracking-tight mb-1">Onde seu dinheiro foi</h3>
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-6">Distribuição Neural</p>
      
      <div className="h-48 relative">
        <ClientOnly fallback={<ChartSkeleton />}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={cats} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={4} stroke="none">
                {cats.map((c, i) => <Cell key={i} fill={c.color} style={{ filter: `drop-shadow(0 0 6px ${c.color})` }} />)}
              </Pie>
              <Tooltip content={<ChartTip currency />} cursor={false} />
            </PieChart>
          </ResponsiveContainer>
        </ClientOnly>
      </div>
      
      <ul className="mt-6 space-y-3">
        {cats.slice(0, 3).map((c) => (
          <li key={c.name} className="flex items-center justify-between text-sm glass rounded-xl px-4 py-2 border border-border/20">
            <span className="flex items-center gap-3 font-semibold">
              <span className="inline-block h-3 w-3 rounded-full shadow-sm" style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }} />
              <span>{categories[c.name]?.icon} {c.name}</span>
            </span>
            <span className="font-black tabular-nums">{brl(c.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all duration-300", active ? "bg-primary text-primary-foreground shadow-neon" : "text-muted-foreground hover:text-foreground hover:bg-surface")}>
      {children}
    </button>
  );
}

function ChartTip({ active, payload, label, currency }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3 glass border border-border/50 text-sm shadow-dock backdrop-blur-2xl">
      {label && <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</div>}
      <div className="space-y-1.5">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color || p.payload?.color, boxShadow: `0 0 8px ${p.color || p.payload?.color}` }} />
            <span className="font-semibold text-muted-foreground">{p.name}</span>
            <span className="ml-auto font-black tabular-nums">{brl(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function parseFinancialText(text: string) {
  if (!text.trim()) return [];
  const fragments = text.split(/(?:\s+e\s+|,|\.|;)/i);
  const results: { amount: number; type: "income" | "expense"; category: string; description: string }[] = [];
  for (const originalFragment of fragments) {
    const f = originalFragment.toLowerCase();
    const m = f.match(/(\d+[\.,]?\d*)/);
    if (!m) continue;
    const amount = parseFloat(m[1].replace(",", "."));
    const isIncome = /(ganhe|receb|vendi|venda|entrou|sal[aá]rio|pix)/i.test(f);
    let category = "Outros";
    if (/(venda|vendi|cliente|freela|projeto)/i.test(f)) category = "Vendas";
    else if (/(mercado|feira|açougu|acougu|comida)/i.test(f)) category = "Mercado";
    else if (/(gasolina|combust|álcool|alcool|posto|uber)/i.test(f)) category = "Combustível";
    else if (/(cart[aã]o|fatura)/i.test(f)) category = "Cartão";
    else if (/(luz|água|agua|net|conta|aluguel|ifood|casa)/i.test(f)) category = "Casa";
    else if (/(rem[eé]dio|farm[aá]cia|m[eé]dico|sa[úu]de)/i.test(f)) category = "Saúde";
    else if (/(lazer|cinema|festa|bar|restaurante)/i.test(f)) category = "Lazer";
    else if (/(curso|escola|faculdade|livro)/i.test(f)) category = "Educação";
    results.push({ amount, type: isIncome ? "income" : "expense", category, description: originalFragment.trim() });
  }
  return results;
}
