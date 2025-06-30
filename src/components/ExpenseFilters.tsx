import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { ExpenseFilters as Filters } from '../types/expense';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../utils/expenseUtils';

interface ExpenseFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onExport: () => void;
  expenseCount: number;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport,
  expenseCount
}) => {
  const handleFilterTypeChange = (type: Filters['type']) => {
    onFiltersChange({ 
      ...filters, 
      type, 
      category: type === 'category' ? filters.category : undefined,
      paymentMethod: type === 'payment' ? filters.paymentMethod : undefined
    });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category || undefined });
  };

  const handlePaymentMethodChange = (paymentMethod: string) => {
    onFiltersChange({ ...filters, paymentMethod: paymentMethod || undefined });
  };

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm: searchTerm || undefined });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/60 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search size={18} md:size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={filters.searchTerm || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white/80 backdrop-blur-sm shadow-sm text-sm md:text-base"
            />
          </div>
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2">
          <Filter size={14} md:size={16} className="text-gray-500" />
          <select
            value={filters.type}
            onChange={(e) => handleFilterTypeChange(e.target.value as Filters['type'])}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white/80 backdrop-blur-sm shadow-sm text-sm md:text-base"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="category">By Category</option>
            <option value="payment">By Payment Method</option>
          </select>
        </div>

        {/* Category Filter */}
        {filters.type === 'category' && (
          <div>
            <select
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white/80 backdrop-blur-sm shadow-sm text-sm md:text-base"
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        )}

        {/* Payment Method Filter */}
        {filters.type === 'payment' && (
          <div>
            <select
              value={filters.paymentMethod || ''}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white/80 backdrop-blur-sm shadow-sm text-sm md:text-base"
            >
              <option value="">All Payment Methods</option>
              {PAYMENT_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={expenseCount === 0}
          className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-sm md:text-base"
        >
          <Download size={14} md:size={16} />
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>

      {/* Results count */}
      <div className="mt-3 text-sm text-gray-600">
        Showing {expenseCount} expense{expenseCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
};