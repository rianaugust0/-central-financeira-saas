import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Receipt, Target, AlertTriangle, BarChart3, Sparkles, Search, Bell, Plus } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Visão geral", icon: LayoutDashboard },
  { to: "/transacoes", label: "Transações", icon: Receipt },
  { to: "/dividas", label: "Dívidas", icon: AlertTriangle },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
];

export function AppShell() {
  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/30">
      <DesktopSidebar />
      
      <main className="flex-1 min-w-0 flex flex-col relative">
        <TopBar />
        <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 pb-28 lg:pb-10 relative z-10">
          <Outlet />
        </div>
        <MobileNav />
      </main>
    </div>
  );
}

function DesktopSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex w-[280px] shrink-0 flex-col border-r border-border/40 bg-gradient-surface px-5 py-8 sticky top-0 h-screen z-20">
      <Brand />
      
      <div className="mt-8 mb-4">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">Menu Principal</div>
        <nav className="flex flex-col gap-2 relative">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/50"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary shadow-neon rounded-2xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 relative z-10 transition-transform group-hover:scale-110", active ? "text-primary-foreground drop-shadow-md" : "")} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto relative rounded-3xl overflow-hidden p-5 border border-primary/20 group cursor-pointer shadow-glow bg-surface-elevated/50">
        <div className="absolute inset-0 bg-gradient-accent opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
        <div className="absolute -right-12 -top-12 h-32 w-32 bg-primary/40 blur-[40px] rounded-full group-hover:bg-primary/60 transition-colors duration-500" />
        <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
          <Sparkles className="h-4 w-4" /> Inteligência Ativa
        </div>
        <p className="relative z-10 text-xs text-muted-foreground leading-relaxed">
          Seu assistente está monitorando o mercado e seus gastos em tempo real.
        </p>
      </div>
    </aside>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 group px-2">
      <div className="relative h-11 w-11 rounded-[14px] bg-gradient-primary grid place-items-center shadow-neon overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-white/30"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear", repeatDelay: 6 }}
        />
        <Sparkles className="h-5 w-5 text-primary-foreground relative z-10 drop-shadow-md" />
      </div>
      <div className="leading-tight">
        <div className="text-lg font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">Central</div>
        <div className="text-[10px] text-primary font-bold uppercase tracking-widest">Financeira</div>
      </div>
    </Link>
  );
}

function TopBar() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: '/login' });
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-border/30">
      <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-10 h-20">
        <div className="lg:hidden"><Brand /></div>
        
        <div className="hidden sm:flex flex-1 max-w-lg relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            placeholder="Pergunte à IA (ex: 'Quanto gastei em ifood?')..."
            className="w-full h-12 pl-12 pr-4 rounded-full bg-surface-elevated/40 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-inner placeholder:text-muted-foreground/60 font-medium"
          />
        </div>
        
        <div className="flex-1 sm:hidden" />
        
        <div className="flex items-center gap-4">
          <button className="h-12 w-12 grid place-items-center rounded-full bg-surface-elevated/40 border border-border/50 relative hover:bg-surface-elevated transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-warning border-2 border-background shadow-[0_0_8px_var(--color-warning)]" />
          </button>
          
          <div onClick={handleLogout} className="h-12 w-12 rounded-full p-[2px] bg-gradient-primary shadow-glow cursor-pointer hover:scale-105 transition-transform" title="Sair do sistema">
            <div className="h-full w-full bg-surface rounded-full grid place-items-center text-[10px] font-bold tracking-tight uppercase">
              Sair
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const { pathname } = useLocation();
  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-sm">
      <div className="glass rounded-[2rem] border border-border/40 shadow-dock p-2.5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
        {nav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex-1 flex flex-col items-center justify-center py-2 h-14"
            >
              {active && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute inset-0 bg-primary/20 rounded-[1.5rem]"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              <Icon className={cn("h-[22px] w-[22px] relative z-10 transition-all duration-300", active ? "text-primary drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-110 -translate-y-1" : "text-muted-foreground")} />
              <AnimatePresence>
                {active && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="text-[9px] font-bold text-primary absolute bottom-1 tracking-wider"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8"
    >
      <div>
        {eyebrow && (
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-3">
            <div className="h-5 w-5 rounded-md bg-primary/20 grid place-items-center">
              <Sparkles className="h-3 w-3" />
            </div>
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">{title}</h1>
        {description && <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </motion.div>
  );
}

export function StatCard({ label, value, delta, tone = "default", icon: Icon }: { label: string; value: string; delta?: string; tone?: "default" | "good" | "bad" | "warn"; icon?: React.ComponentType<{ className?: string }> }) {
  const toneClass = {
    default: "text-foreground",
    good: "text-success",
    bad: "text-destructive",
    warn: "text-warning",
  }[tone];
  
  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="rounded-[2rem] p-6 bg-card border border-border/30 shadow-card relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-[40px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
      
      <div className="flex items-center justify-between relative z-10">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
        {Icon && (
          <div className="h-10 w-10 rounded-2xl bg-surface-elevated/80 border border-border/40 grid place-items-center shadow-sm">
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        )}
      </div>
      
      <div className={cn("text-3xl font-extrabold mt-5 tabular-nums relative z-10 tracking-tighter", toneClass)}>
        {value}
      </div>
      
      {delta && (
        <div className="text-[11px] font-bold text-muted-foreground mt-2 relative z-10">
          {delta}
        </div>
      )}
    </motion.div>
  );
}

export { Plus };
