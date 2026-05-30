import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Acesso · Central Financeira" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode entrar.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao acessar a conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-card/60 border border-border/40 shadow-2xl backdrop-blur-3xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="relative h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-neon overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-white/30"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear", repeatDelay: 6 }}
            />
            <Sparkles className="h-6 w-6 text-primary-foreground relative z-10 drop-shadow-md" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight">{isSignUp ? "Criar Império" : "Bem-vindo, Márcio!"}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isSignUp ? "Inicie sua jornada de inteligência financeira." : "Acesso exclusivo ao seu controle financeiro."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">E-mail</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-surface/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner" 
              placeholder="seu@email.com" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Senha</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-surface/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 mt-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? "Criar Conta" : "Entrar")}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignUp ? "Já tem uma conta? Entrar" : "Não tem conta? Criar agora"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
