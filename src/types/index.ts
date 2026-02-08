export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface CategoryTotal {
  category: string;
  total: number;
  count: number;
}

export interface DailyTotal {
  date: string;
  total: number;
}
