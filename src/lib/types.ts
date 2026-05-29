export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id?: string;
  description: string;
  amount: number;
  type: TxType;
  category: string;
  source: string;
  date: string; // ISO
  account: "Pessoal" | "Negócio" | "Família" | string;
}

export interface Debt {
  id: string;
  user_id?: string;
  name: string;
  total: number;
  paid: number;
  due_date: string;
  color: string;
  created_at?: string;
}

export interface Goal {
  id: string;
  user_id?: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  created_at?: string;
}
