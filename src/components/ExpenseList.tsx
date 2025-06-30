import React, { useState, useMemo } from 'react';
import { Plus, Receipt, Calendar, Grid3X3, List, LayoutGrid } from 'lucide-react';
import { Expense, ExpenseFilters as Filters } from '../types/expense';
import { ExpenseItem } from './ExpenseItem';
import { ExpenseFilters } from './ExpenseFilters';
import { SemanticExpenseInput } from './SemanticExpenseInput';
import { filterExpensesByDate, exportExpensesToCSV, groupExpensesByDate, formatDateHeader, formatCurrency } from '../utils/expenseUtils';
import { useCurrency } from '../contexts/CurrencyContext';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onQuickAdd: (data: any) => void;
}

type ViewMode = 'list' | 'grid';

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
  onAddNew,
  onQuickAdd
}) => {
  const { currency } = useCurrency();
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    searchTerm: ''
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid'); // Changed default to grid

  const filteredExpenses = useMemo(() => {
    let filtered = expenses;

    // Apply date filter
    if (filters.type !== 'all' && filters.type !== 'category' && filters.type !== 'payment') {
      filtered = filterExpensesByDate(filtered, filters.type);
    }

    // Apply category filter
    if (filters.type === 'category' && filters.category) {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    // Apply payment method filter
    if (filters.type === 'payment' && filters.paymentMethod) {
      filtered = filtered.filter(expense => expense.paymentMethod === filters.paymentMethod);
    }

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower) ||
        expense.paymentMethod.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filters]);

  const groupedExpenses = useMemo(() => {
    return groupExpensesByDate(filteredExpenses);
  }, [filteredExpenses]);

  const handleExport = () => {
    exportExpensesToCSV(filteredExpenses, currency);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Receipt size={24} md:size={28} className="text-emerald-600" />
          Recent Expenses
        </h2>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-1 shadow-md">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List view"
            >
              <List size={16} md:size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid view"
            >
              <LayoutGrid size={16} md:size={18} />
            </button>
          </div>
          
          <button
            onClick={onAddNew}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 text-sm md:text-base"
          >
            <Plus size={18} md:size={20} />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Semantic Input */}
      <SemanticExpenseInput onSubmit={onQuickAdd} />

      <ExpenseFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
        expenseCount={filteredExpenses.length}
      />

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-lg">
            <Receipt size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {expenses.length === 0 ? 'No expenses yet' : 'No expenses found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {expenses.length === 0
              ? 'Start tracking your expenses by adding your first one!'
              : 'Try adjusting your filters or search terms.'}
          </p>
          {expenses.length === 0 && (
            <button
              onClick={onAddNew}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Add Your First Expense
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedExpenses).map(([date, dayExpenses]) => {
            const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            
            return (
              <div key={date} className="space-y-3">
                {/* Date Header - Mobile optimized */}
                <div className="w-full bg-gradient-to-r from-white/90 via-gray-50/90 to-white/90 backdrop-blur-md rounded-xl px-4 md:px-6 py-3 md:py-4 border border-white/40 shadow-xl block">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Calendar size={18} md:size={20} className="text-emerald-600" />
                      {formatDateHeader(date)}
                    </h2>
                    <div className="text-right">
                      <div className="text-base md:text-lg font-bold text-gray-900">
                        {formatCurrency(dayTotal, currency)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">
                        {dayExpenses.length} expense{dayExpenses.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expenses for this date */}
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'
                    : 'max-w-4xl space-y-3'
                }>
                  {dayExpenses.map(expense => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};