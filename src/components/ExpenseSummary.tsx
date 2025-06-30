import React from 'react';
import { DollarSign, TrendingDown, Calendar, PieChart, CreditCard } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency, getCategoryTotals, getPaymentMethodTotals, filterExpensesByDate } from '../utils/expenseUtils';
import { useCurrency } from '../contexts/CurrencyContext';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  const { currency } = useCurrency();
  
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const todayExpenses = filterExpensesByDate(expenses, 'today');
  const thisWeekExpenses = filterExpensesByDate(expenses, 'week');
  const thisMonthExpenses = filterExpensesByDate(expenses, 'month');

  const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const weekTotal = thisWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = getCategoryTotals(expenses);
  const paymentMethodTotals = getPaymentMethodTotals(expenses);
  
  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topPaymentMethods = Object.entries(paymentMethodTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const summaryCards = [
    {
      title: 'Total Expenses',
      amount: totalAmount,
      icon: DollarSign,
      color: 'from-emerald-600 to-emerald-700',
      textColor: 'text-emerald-600',
      bgGradient: 'from-emerald-50 to-green-50'
    },
    {
      title: 'Today',
      amount: todayTotal,
      icon: Calendar,
      color: 'from-blue-600 to-blue-700',
      textColor: 'text-blue-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'This Week',
      amount: weekTotal,
      icon: TrendingDown,
      color: 'from-purple-600 to-purple-700',
      textColor: 'text-purple-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      title: 'This Month',
      amount: monthTotal,
      icon: PieChart,
      color: 'from-amber-600 to-amber-700',
      textColor: 'text-amber-600',
      bgGradient: 'from-amber-50 to-orange-50'
    }
  ];

  return (
    <div className="mb-8">
      <div className={`grid gap-4 md:gap-6 ${expenses.length > 0 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Left Side - Summary Cards in 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`bg-gradient-to-br ${card.bgGradient} rounded-xl shadow-sm border border-white/50 p-4 md:p-6 hover:shadow-md transition-all duration-200 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-3 md:mb-3">
                  <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                    <Icon size={18} className="text-white md:hidden" />
                    <Icon size={24} className="text-white hidden md:block" />
                  </div>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-base md:text-2xl font-bold ${card.textColor} leading-tight`}>
                    {formatCurrency(card.amount, currency)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Middle - Top Categories (Hidden on mobile) */}
        {expenses.length > 0 && topCategories.length > 0 && (
          <div className="hidden md:block bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart size={20} className="text-emerald-600" />
              Top Categories
            </h3>
            <div className="space-y-4">
              {topCategories.map(([category, amount], index) => {
                const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
                const colors = [
                  'bg-gradient-to-r from-emerald-500 to-green-500',
                  'bg-gradient-to-r from-blue-500 to-cyan-500',
                  'bg-gradient-to-r from-purple-500 to-pink-500'
                ];
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${colors[index]} shadow-sm`}></div>
                        <span className="text-sm font-medium text-gray-900">{category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-700">
                          {formatCurrency(amount, currency)}
                        </div>
                        <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[index]} transition-all duration-500 shadow-sm`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right - Top Payment Methods (Hidden on mobile) */}
        {expenses.length > 0 && topPaymentMethods.length > 0 && (
          <div className="hidden md:block bg-gradient-to-br from-white/80 to-indigo-50/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-indigo-600" />
              Payment Methods
            </h3>
            <div className="space-y-4">
              {topPaymentMethods.map(([method, amount], index) => {
                const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
                const colors = [
                  'bg-gradient-to-r from-indigo-500 to-blue-500',
                  'bg-gradient-to-r from-green-500 to-emerald-500',
                  'bg-gradient-to-r from-orange-500 to-red-500'
                ];
                
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${colors[index]} shadow-sm`}></div>
                        <span className="text-sm font-medium text-gray-900">{method}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-700">
                          {formatCurrency(amount, currency)}
                        </div>
                        <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[index]} transition-all duration-500 shadow-sm`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};