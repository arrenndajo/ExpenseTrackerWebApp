import { Expense, GroupedExpenses, ExpenseFormData } from '../types/expense';

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Personal Care',
  'Other'
];

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Digital Wallet',
  'Bank Transfer',
  'Other'
];

// Semantic parsing patterns
const SEMANTIC_PATTERNS = {
  // Amount patterns - updated to support both USD and INR
  amount: /(?:\$|usd\s*|₹|rs\.?\s*|inr\s*)?(\d+(?:\.\d{2})?)/i,
  
  // Category keywords
  categories: {
    'Food & Dining': ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'coffee', 'snack', 'meal', 'eat', 'drink'],
    'Transportation': ['uber', 'taxi', 'bus', 'train', 'gas', 'fuel', 'parking', 'metro', 'transport'],
    'Shopping': ['amazon', 'store', 'clothes', 'shopping', 'buy', 'purchase', 'mall', 'online'],
    'Entertainment': ['movie', 'cinema', 'game', 'concert', 'show', 'entertainment', 'fun', 'netflix'],
    'Bills & Utilities': ['bill', 'electric', 'water', 'internet', 'phone', 'utility', 'rent', 'mortgage'],
    'Healthcare': ['doctor', 'medicine', 'pharmacy', 'hospital', 'health', 'medical', 'dentist'],
    'Travel': ['flight', 'hotel', 'vacation', 'trip', 'travel', 'booking', 'airbnb'],
    'Education': ['book', 'course', 'school', 'education', 'tuition', 'class', 'learning'],
    'Personal Care': ['haircut', 'salon', 'spa', 'cosmetics', 'personal', 'beauty', 'gym']
  },

  // Payment method keywords
  paymentMethods: {
    'Cash': ['cash', 'bills', 'coins'],
    'Credit Card': ['credit', 'visa', 'mastercard', 'amex', 'discover'],
    'Debit Card': ['debit', 'card'],
    'Digital Wallet': ['paypal', 'venmo', 'apple pay', 'google pay', 'samsung pay', 'wallet', 'zelle', 'paytm', 'phonepe', 'gpay'],
    'Bank Transfer': ['transfer', 'wire', 'ach', 'bank', 'upi', 'neft', 'rtgs', 'imps']
  }
};

export const parseSemanticInput = (input: string): Partial<ExpenseFormData> => {
  const result: Partial<ExpenseFormData> = {};
  const lowerInput = input.toLowerCase();

  // Extract amount
  const amountMatch = input.match(SEMANTIC_PATTERNS.amount);
  if (amountMatch) {
    result.amount = amountMatch[1];
  }

  // Detect category
  for (const [category, keywords] of Object.entries(SEMANTIC_PATTERNS.categories)) {
    if (keywords.some(keyword => lowerInput.includes(keyword))) {
      result.category = category;
      break;
    }
  }

  // Detect payment method
  for (const [paymentMethod, keywords] of Object.entries(SEMANTIC_PATTERNS.paymentMethods)) {
    if (keywords.some(keyword => lowerInput.includes(keyword))) {
      result.paymentMethod = paymentMethod;
      break;
    }
  }

  // Use the input as description, cleaned up
  result.description = input
    .replace(/^[\$₹]?\d+(?:\.\d{2})?\s*/, '') // Remove amount from beginning
    .replace(/\s+/g, ' ')
    .trim();

  return result;
};

export const formatCurrency = (amount: number, currency: 'USD' | 'INR' = 'USD'): string => {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  }).format(date);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const groupExpensesByDate = (expenses: Expense[]): GroupedExpenses => {
  return expenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as GroupedExpenses);
};

export const filterExpensesByDate = (expenses: Expense[], type: string): Expense[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (type) {
    case 'today':
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const expenseDay = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());
        return expenseDay.getTime() === today.getTime();
      });
    case 'week':
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return expenses.filter(expense => new Date(expense.date) >= weekAgo);
    case 'month':
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      return expenses.filter(expense => new Date(expense.date) >= monthAgo);
    default:
      return expenses;
  }
};

export const getCategoryTotals = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const getPaymentMethodTotals = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    acc[expense.paymentMethod] = (acc[expense.paymentMethod] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const exportExpensesToCSV = (expenses: Expense[], currency: 'USD' | 'INR' = 'USD'): void => {
  const headers = ['Date', 'Category', 'Description', 'Amount', 'Payment Method'];
  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      expense.date,
      expense.category,
      `"${expense.description}"`,
      formatCurrency(expense.amount, currency),
      expense.paymentMethod
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses-${currency}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};