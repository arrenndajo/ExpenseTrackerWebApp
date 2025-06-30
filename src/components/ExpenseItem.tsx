import React from 'react';
import { Edit2, Trash2, Calendar, Tag, CreditCard } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency, formatDate } from '../utils/expenseUtils';
import { useCurrency } from '../contexts/CurrencyContext';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  viewMode?: 'list' | 'grid';
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Food & Dining': 'bg-orange-100 text-orange-800 border-orange-200',
    'Transportation': 'bg-blue-100 text-blue-800 border-blue-200',
    'Shopping': 'bg-pink-100 text-pink-800 border-pink-200',
    'Entertainment': 'bg-purple-100 text-purple-800 border-purple-200',
    'Bills & Utilities': 'bg-red-100 text-red-800 border-red-200',
    'Healthcare': 'bg-green-100 text-green-800 border-green-200',
    'Travel': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Education': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Personal Care': 'bg-teal-100 text-teal-800 border-teal-200',
    'Other': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getPaymentMethodColor = (paymentMethod: string): string => {
  const colors: Record<string, string> = {
    'Cash': 'bg-green-100 text-green-800 border-green-200',
    'Credit Card': 'bg-blue-100 text-blue-800 border-blue-200',
    'Debit Card': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Digital Wallet': 'bg-purple-100 text-purple-800 border-purple-200',
    'Bank Transfer': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Other': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[paymentMethod] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ 
  expense, 
  onEdit, 
  onDelete,
  viewMode = 'list'
}) => {
  const { currency } = useCurrency();
  const isGridView = viewMode === 'grid';

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 md:p-4 hover:shadow-xl hover:bg-white/95 transition-all duration-200 group ${
      isGridView ? 'h-full' : ''
    }`}>
      <div className={`flex ${isGridView ? 'flex-col' : 'items-start justify-between'}`}>
        <div className={`flex-1 min-w-0 ${isGridView ? 'mb-3' : ''}`}>
          <div className={`flex items-center gap-2 mb-2 ${isGridView ? 'flex-wrap' : ''}`}>
            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getCategoryColor(expense.category)}`}>
              {expense.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border shadow-sm ${getPaymentMethodColor(expense.paymentMethod)}`}>
              <CreditCard size={10} className="inline mr-1" />
              {expense.paymentMethod}
            </span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <Calendar size={14} className="mr-1" />
            {formatDate(expense.date)}
          </div>
          
          <h3 className={`font-medium text-gray-900 mb-2 text-sm md:text-base ${isGridView ? '' : 'truncate'}`}>
            {expense.description}
          </h3>
          
          <div className={`font-bold text-gray-900 ${isGridView ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
            {formatCurrency(expense.amount, currency)}
          </div>
        </div>

        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          isGridView ? 'justify-end mt-2' : ''
        }`}>
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm"
            title="Edit expense"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
            title="Delete expense"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};