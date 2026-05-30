import { create } from "zustand";
import { supabase } from "./supabase";
import { toast } from "sonner";
import { Transaction, Debt, Goal } from "./types";
import { categories } from "./constants";

interface FinanceState {
  transactions: Transaction[];
  debts: Debt[];
  goals: Goal[];
  loading: boolean;
  
  fetchData: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  
  addDebt: (debt: Omit<Debt, "id" | "created_at">) => Promise<void>;
  removeDebt: (id: string) => Promise<void>;
  
  addGoal: (goal: Omit<Goal, "id" | "created_at">) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>()((set, get) => ({
  transactions: [],
  debts: [],
  goals: [],
  loading: false,
  
  fetchData: async () => {
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      set({ transactions: [], debts: [], goals: [], loading: false });
      return;
    }
    
    const [txRes, debtsRes, goalsRes] = await Promise.all([
      supabase.from('transactions').select('*').order('date', { ascending: false }),
      supabase.from('debts').select('*').order('created_at', { ascending: false }),
      supabase.from('goals').select('*').order('created_at', { ascending: false })
    ]);

    if (txRes.error || debtsRes.error || goalsRes.error) {
      console.error("Erro na busca de dados:", txRes.error, debtsRes.error, goalsRes.error);
      toast.error("Erro de conexão com o banco! Verifique se as tabelas foram criadas.");
    }
      
    set({ 
      transactions: txRes.data || [],
      debts: debtsRes.data || [],
      goals: goalsRes.data || [],
      loading: false 
    });
  },
  
  addTransaction: async (tx) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const newTx = {
      ...tx,
      user_id: session.user.id,
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([newTx])
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao inserir transação:", error);
      toast.error("Erro no Banco de Dados: " + error.message);
    } else if (data) {
      set((state) => ({ transactions: [data, ...state.transactions] }));
      toast.success("Transação salva com sucesso!");
    }
  },
  
  removeTransaction: async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      set((state) => ({ transactions: state.transactions.filter(t => t.id !== id) }));
    }
  },

  addDebt: async (debt) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase.from('debts').insert([{ ...debt, user_id: session.user.id }]).select().single();
    if (error) {
      console.error("Erro ao inserir dívida:", error);
      toast.error("Erro no Banco de Dados: " + error.message);
    } else if (data) {
      set((state) => ({ debts: [data, ...state.debts] }));
      toast.success("Dívida salva com sucesso!");
    }
  },
  
  removeDebt: async (id) => {
    const { error } = await supabase.from('debts').delete().eq('id', id);
    if (!error) set((state) => ({ debts: state.debts.filter(d => d.id !== id) }));
  },

  addGoal: async (goal) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase.from('goals').insert([{ ...goal, user_id: session.user.id }]).select().single();
    if (error) {
      console.error("Erro ao inserir meta:", error);
      toast.error("Erro no Banco de Dados: " + error.message);
    } else if (data) {
      set((state) => ({ goals: [data, ...state.goals] }));
      toast.success("Meta salva com sucesso!");
    }
  },

  removeGoal: async (id) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (!error) set((state) => ({ goals: state.goals.filter(g => g.id !== id) }));
  }
}));

// --- Hooks Analíticos (Selectors) --- //

export function useTotals() {
  const transactions = useFinanceStore(s => s.transactions);
  const income = transactions.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  return { income, expense, balance: income - expense };
}

export function useDailyFlow(days = 14) {
  const transactions = useFinanceStore(s => s.transactions);
  const map = new Map<string, { date: string; income: number; expense: number }>();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, { date: key, income: 0, expense: 0 });
  }
  
  for (const t of transactions) {
    const key = t.date.slice(0, 10);
    const e = map.get(key);
    if (!e) continue;
    if (t.type === "income") e.income += t.amount;
    else e.expense += t.amount;
  }
  
  return Array.from(map.values()).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
  }));
}

export function useCategoryBreakdown() {
  const transactions = useFinanceStore(s => s.transactions);
  const m = new Map<string, number>();
  
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    m.set(t.category, (m.get(t.category) || 0) + t.amount);
  }
  
  return Array.from(m.entries()).map(([name, value]) => ({
    name,
    value,
    color: categories[name]?.color || "#94a3b8",
  })).sort((a, b) => b.value - a.value);
}

export function useFinancialScore() {
  const { income, expense } = useTotals();
  const debts = useFinanceStore(s => s.debts);
  
  const debtMonthly = debts.length * 300; // Estimativa simples para o score
  const savings = income - expense;
  const ratio = savings / Math.max(income, 1);
  const debtRatio = debtMonthly / Math.max(income, 1);
  
  let score = 50 + ratio * 600 - debtRatio * 800; // Escalando para 1000
  score = Math.max(0, Math.min(1000, Math.round(score)));
  
  const tone = score >= 700 ? "good" : score >= 450 ? "warn" : "bad";
  const label = score >= 700 ? "Saudável" : score >= 450 ? "Atenção" : "Em risco";
  return { score, label, tone };
}
