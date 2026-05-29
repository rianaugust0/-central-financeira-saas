-- Cria a Tabela de Dívidas (debts)
CREATE TABLE public.debts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    total NUMERIC NOT NULL,
    paid NUMERIC NOT NULL DEFAULT 0,
    due_date TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Cria a Tabela de Metas (goals)
CREATE TABLE public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target NUMERIC NOT NULL,
    current NUMERIC NOT NULL DEFAULT 0,
    deadline TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Ativa RLS nas novas tabelas
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Políticas de Dívidas (Debts)
CREATE POLICY "Users can view own debts" ON public.debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own debts" ON public.debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own debts" ON public.debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own debts" ON public.debts FOR DELETE USING (auth.uid() = user_id);

-- Políticas de Metas (Goals)
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);
