"use client";

import { useState, useEffect } from "react";
import { Wallet, PieChart, ArrowRightLeft, Sparkles, TrendingUp, LayoutDashboard, CreditCard, Bell, Search, User, ArrowUpRight, ArrowDownRight, Activity, Send, CheckCircle2, ChevronRight, History } from "lucide-react";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: 'in' | 'out';
  date: string;
};

export default function PremiumDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'extrato' | 'reports'>('dashboard');
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, title: 'Venda de Pastéis (Pix)', amount: 180, type: 'in', date: 'Hoje, 14:30' },
    { id: 2, title: 'Fatura Nubank', amount: 850, type: 'out', date: 'Ontem, 09:00' },
    { id: 3, title: 'Loja de Roupas', amount: 450, type: 'in', date: 'Ontem, 16:45' },
    { id: 4, title: 'Fornecedor (Brás)', amount: 430, type: 'out', date: '25 de Mai, 11:20' },
    { id: 5, title: 'Mercado Assaí', amount: 210.50, type: 'out', date: '24 de Mai, 19:10' },
    { id: 6, title: 'Venda de Pastéis', amount: 95, type: 'in', date: '23 de Mai, 18:00' },
  ]);

  // Derived state
  const totalIn = transactions.filter(t => t.type === 'in').reduce((acc, curr) => acc + curr.amount, 0) + 5170;
  const totalOut = transactions.filter(t => t.type === 'out').reduce((acc, curr) => acc + curr.amount, 0) + 1920;
  const balance = totalIn - totalOut;

  // Filtered transactions for Extrato
  const filteredTransactions = transactions.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Fake AI Parser
  const handleSmartInput = () => {
    if (!inputText.trim()) return;

    const lowerText = inputText.toLowerCase();
    const valueMatch = inputText.match(/(\d+(?:[.,]\d+)?)/);
    let amount = 0;
    if (valueMatch) {
      amount = parseFloat(valueMatch[0].replace(',', '.'));
    }

    if (amount === 0) {
      alert("Não consegui identificar o valor. Tente algo como 'Gastei 50 no mercado'.");
      return;
    }

    const expenseKeywords = ['gastei', 'comprei', 'paguei', 'saída', 'mercado', 'fornecedor', 'fatura'];
    const incomeKeywords = ['vendi', 'recebi', 'ganhei', 'entrou', 'lucro', 'pix'];
    let type: 'in' | 'out' = 'out';
    
    if (incomeKeywords.some(keyword => lowerText.includes(keyword))) {
      type = 'in';
    } else if (expenseKeywords.some(keyword => lowerText.includes(keyword))) {
      type = 'out';
    }

    const newTx: Transaction = {
      id: Date.now(),
      title: inputText.trim(),
      amount: amount,
      type: type,
      date: 'Agora',
    };

    setTransactions([newTx, ...transactions]);
    setInputText("");
    
    // Automatically switch to dashboard if on another tab so they can see the change immediately
    if (activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSmartInput();
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground font-sans">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0 z-40 p-4">
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Márcio</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Início" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<History size={20} />} 
            label="Extrato" 
            active={activeTab === 'extrato'} 
            onClick={() => setActiveTab('extrato')} 
          />
          <NavItem 
            icon={<PieChart size={20} />} 
            label="Relatórios" 
            active={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')} 
          />
          <NavItem 
            icon={<CreditCard size={20} />} 
            label="Cartões" 
            active={false} 
            onClick={() => alert('Em breve!')}
          />
        </nav>
        
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
              <User size={18} className="text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Minha Conta</span>
              <span className="text-xs text-muted-foreground">Ver perfil</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-24 md:pb-0">
        
        {/* TOPBAR */}
        <header className="h-20 border-b border-border bg-background sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white hidden sm:block">
              {activeTab === 'dashboard' && 'Visão Geral'}
              {activeTab === 'extrato' && 'Extrato Completo'}
              {activeTab === 'reports' && 'Meus Relatórios'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 focus-within:border-primary transition-colors">
              <Search className="text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar no extrato..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'extrato') setActiveTab('extrato');
                }}
                className="bg-transparent border-none outline-none text-sm w-56 placeholder:text-muted-foreground text-white" 
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell className="w-6 h-6 text-muted-foreground" />
              <span className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background"></span>
            </button>
          </div>
        </header>

        {/* DYNAMIC CONTENT BASED ON TAB */}
        <div className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-8">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* SMART INPUT - BANCO DIGITAL STYLE */}
              <section className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1 w-full">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Anotar um lançamento rápido</p>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ex: Vendi 120 de pastel..." 
                    className="bg-transparent w-full outline-none text-lg text-white placeholder:text-muted-foreground/50 font-semibold"
                  />
                </div>
                <button 
                  onClick={handleSmartInput}
                  className="w-full sm:w-auto bg-primary text-white rounded-xl px-6 py-3 font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  Registrar
                </button>
              </section>

              {/* ACCOUNT BALANCE */}
              <section className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Wallet className="w-48 h-48 text-white translate-x-10 -translate-y-10" />
                </div>
                
                <div className="relative z-10">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Conta Corrente e Negócios
                  </span>
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-8">
                    {formatCurrency(balance)}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-background rounded-xl p-4 flex-1 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm text-muted-foreground font-medium">Entradas do mês</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{formatCurrency(totalIn)}</span>
                    </div>
                    <div className="bg-background rounded-xl p-4 flex-1 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowDownRight className="w-5 h-5 text-destructive" />
                        <span className="text-sm text-muted-foreground font-medium">Saídas do mês</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{formatCurrency(totalOut)}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* RECENT TRANSACTIONS PREVIEW */}
              <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-white">Últimos Lançamentos</h3>
                  <button 
                    onClick={() => setActiveTab('extrato')}
                    className="text-sm font-medium text-primary flex items-center gap-1 hover:underline"
                  >
                    Ver extrato completo <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {transactions.slice(0, 4).map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </div>
              </section>
            </>
          )}

          {/* TAB: EXTRATO */}
          {activeTab === 'extrato' && (
            <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden min-h-[500px]">
              <div className="p-6 border-b border-border bg-card sticky top-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h3 className="font-semibold text-xl text-white">Extrato de Movimentações</h3>
                
                {/* Mobile Search */}
                <div className="md:hidden flex items-center gap-2 bg-background border border-border rounded-lg px-4 py-2 focus-within:border-primary transition-colors">
                  <Search className="text-muted-foreground w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground text-white" 
                  />
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">Nenhum lançamento encontrado</h4>
                  <p className="text-muted-foreground">Tente buscar por outro termo.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredTransactions.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} showDate />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB: REPORTS */}
          {activeTab === 'reports' && (
            <section className="bg-card rounded-2xl p-12 border border-border shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
              <PieChart className="w-16 h-16 text-primary mb-4 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-2">Relatórios em Construção</h3>
              <p className="text-muted-foreground max-w-md">
                Em breve você terá gráficos completos mostrando exatamente para onde o seu dinheiro está indo, separados por Loja, Pastéis e Família.
              </p>
            </section>
          )}

        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border h-16 flex items-center justify-around z-50 px-2 pb-1">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-medium">Início</span>
        </button>
        <button 
          onClick={() => setActiveTab('extrato')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'extrato' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-medium">Extrato</span>
        </button>
        <button 
          onClick={() => alert('Faturas em breve!')}
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground"
        >
          <CreditCard className="w-6 h-6" />
          <span className="text-[10px] font-medium">Cartões</span>
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'reports' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <PieChart className="w-6 h-6" />
          <span className="text-[10px] font-medium">Resumo</span>
        </button>
      </nav>

    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${active ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-white/5 hover:text-white font-medium'}`}
    >
      <div>{icon}</div>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function TransactionRow({ tx, showDate = false }: { tx: Transaction, showDate?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 sm:p-6 hover:bg-white/5 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
          {tx.type === 'in' ? <ArrowUpRight className="w-5 h-5"/> : <ArrowDownRight className="w-5 h-5"/>}
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <p className="font-semibold text-base text-white truncate">{tx.title}</p>
          <p className="text-sm text-muted-foreground truncate">{tx.date || (tx.type === 'in' ? "Receita" : "Despesa")}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-base sm:text-lg font-bold block ${tx.type === 'in' ? 'text-emerald-500' : 'text-white'}`}>
          {tx.type === 'in' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
        </span>
      </div>
    </div>
  );
}
