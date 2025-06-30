import { useState, useEffect } from 'react';
import { Expense, ExpenseFormData } from '../types/expense';
import { generateId, getTodayDate } from '../utils/expenseUtils';

const STORAGE_KEY = 'expense-tracker-data';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);
    if (savedExpenses) {
      try {
        const parsedExpenses = JSON.parse(savedExpenses);
        // Migrate old expenses that don't have paymentMethod
        const migratedExpenses = parsedExpenses.map((expense: any) => ({
          ...expense,
          paymentMethod: expense.paymentMethod || 'Other'
        }));
        setExpenses(migratedExpenses);
      } catch (error) {
        console.error('Error loading expenses from localStorage:', error);
      }
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (formData: ExpenseFormData): Expense => {
    const newExpense: Expense = {
      id: generateId(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      createdAt: new Date().toISOString()
    };

    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const updateExpense = (id: string, formData: ExpenseFormData): void => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id 
        ? {
            ...expense,
            amount: parseFloat(formData.amount),
            category: formData.category,
            description: formData.description,
            date: formData.date,
            paymentMethod: formData.paymentMethod
          }
        : expense
    ));
  };

  const deleteExpense = (id: string): void => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const getTotalExpenses = (): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getTotalExpenses
  };
};