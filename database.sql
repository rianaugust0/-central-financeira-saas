-- Tabela de Transações (Segurança RLS ativada)
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    source TEXT NOT NULL,
    account TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Política 1: Usuário só pode VER suas próprias transações
CREATE POLICY "Users can view own transactions" 
    ON public.transactions FOR SELECT 
    USING (auth.uid() = user_id);

-- Política 2: Usuário só pode INSERIR transações atreladas ao seu próprio ID
CREATE POLICY "Users can insert own transactions" 
    ON public.transactions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Política 3: Usuário só pode ATUALIZAR suas próprias transações
CREATE POLICY "Users can update own transactions" 
    ON public.transactions FOR UPDATE 
    USING (auth.uid() = user_id);

-- Política 4: Usuário só pode DELETAR suas próprias transações
CREATE POLICY "Users can delete own transactions" 
    ON public.transactions FOR DELETE 
    USING (auth.uid() = user_id);
