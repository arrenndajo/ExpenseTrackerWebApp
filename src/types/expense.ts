export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
  createdAt: string;
}

export interface ExpenseFormData {
  amount: string;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
}

export type FilterType = 'all' | 'today' | 'week' | 'month' | 'category' | 'payment';

export interface ExpenseFilters {
  type: FilterType;
  category?: string;
  paymentMethod?: string;
  searchTerm?: string;
}

export interface GroupedExpenses {
  [date: string]: Expense[];
}