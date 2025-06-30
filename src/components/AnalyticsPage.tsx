import React, { useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { Expense } from '../types/expense';
import { ExpenseSummary } from './ExpenseSummary';
import { formatCurrency, getCategoryTotals, getPaymentMethodTotals, filterExpensesByDate } from '../utils/expenseUtils';
import { useCurrency } from '../contexts/CurrencyContext';

interface AnalyticsPageProps {
  expenses: Expense[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ expenses }) => {
  const { currency } = useCurrency();
  
  const analytics = useMemo(() => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const todayExpenses = filterExpensesByDate(expenses, 'today');
    const weekExpenses = filterExpensesByDate(expenses, 'week');
    const monthExpenses = filterExpensesByDate(expenses, 'month');
    
    const categoryTotals = getCategoryTotals(expenses);
    const paymentMethodTotals = getPaymentMethodTotals(expenses);
    
    // Calculate averages
    const avgDaily = monthExpenses.length > 0 ? 
      monthExpenses.reduce((sum, exp) => sum + exp.amount, 0) / 30 : 0;
    const avgWeekly = weekExpenses.length > 0 ? 
      weekExpenses.reduce((sum, exp) => sum + exp.amount, 0) : 0;
    
    // Get top categories and payment methods
    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    const topPaymentMethods = Object.entries(paymentMethodTotals)
      .sort(([, a], [, b]) => b - a);

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });
      
      const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      monthlyTrend.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: monthTotal,
        count: monthExpenses.length
      });
    }

    return {
      totalAmount,
      todayTotal: todayExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      weekTotal: weekExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      monthTotal: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      avgDaily,
      avgWeekly,
      topCategories,
      topPaymentMethods,
      monthlyTrend,
      totalTransactions: expenses.length
    };
  }, [expenses]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <BarChart3 size={32} md:size={36} className="text-blue-600" />
          Expense Analytics
        </h1>
        <p className="text-gray-600 text-sm md:text-base">Detailed insights into your spending patterns</p>
      </div>

      {/* Summary Cards - Always visible */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/30 shadow-xl">
        <ExpenseSummary expenses={expenses} />
      </div>

      {/* Additional Key Metrics - Mobile: 2x2 Grid, Desktop: 1x4 Grid */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/40 shadow-xl">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <TrendingUp size={18} md:size={20} className="text-blue-600" />
          Additional Insights
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 md:p-6 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="p-2 md:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <DollarSign size={16} className="text-white md:hidden" />
                <DollarSign size={24} className="text-white hidden md:block" />
              </div>
            </div>
            <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">Daily Average</h3>
            <p className="text-base md:text-2xl font-bold text-gray-900 leading-tight">{formatCurrency(analytics.avgDaily, currency)}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 md:p-6 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="p-2 md:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <TrendingUp size={16} className="text-white md:hidden" />
                <TrendingUp size={24} className="text-white hidden md:block" />
              </div>
            </div>
            <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">Weekly Total</h3>
            <p className="text-base md:text-2xl font-bold text-gray-900 leading-tight">{formatCurrency(analytics.avgWeekly, currency)}</p>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 md:p-6 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="p-2 md:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Calendar size={16} className="text-white md:hidden" />
                <Calendar size={24} className="text-white hidden md:block" />
              </div>
            </div>
            <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">Total Transactions</h3>
            <p className="text-base md:text-2xl font-bold text-gray-900 leading-tight">{analytics.totalTransactions}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-3 md:p-6 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="p-2 md:p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                <PieChart size={16} className="text-white md:hidden" />
                <PieChart size={24} className="text-white hidden md:block" />
              </div>
            </div>
            <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">Active Categories</h3>
            <p className="text-base md:text-2xl font-bold text-gray-900 leading-tight">{analytics.topCategories.length}</p>
            <p className="text-xs text-gray-500 mt-1">Categories used</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Monthly Trend */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/40 shadow-xl">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
            <TrendingUp size={18} md:size={20} className="text-blue-600" />
            Monthly Spending Trend
          </h3>
          <div className="space-y-4">
            {analytics.monthlyTrend.map((month, index) => {
              const maxAmount = Math.max(...analytics.monthlyTrend.map(m => m.amount));
              const percentage = maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;
              
              return (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{month.month}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(month.amount, currency)}
                      </div>
                      <div className="text-xs text-gray-500">{month.count} transactions</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 shadow-sm"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/40 shadow-xl">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
            <PieChart size={18} md:size={20} className="text-emerald-600" />
            Top Spending Categories
          </h3>
          <div className="space-y-4">
            {analytics.topCategories.map(([category, amount], index) => {
              const percentage = analytics.totalAmount > 0 ? (amount / analytics.totalAmount) * 100 : 0;
              const colors = [
                'from-emerald-500 to-green-500',
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-orange-500 to-red-500',
                'from-indigo-500 to-purple-500'
              ];
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[index]} shadow-sm`}></div>
                      <span className="text-sm font-medium text-gray-900">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-700">
                        {formatCurrency(amount, currency)}
                      </div>
                      <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${colors[index]} transition-all duration-500 shadow-sm`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Methods Analysis */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/40 shadow-xl">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <CreditCard size={18} md:size={20} className="text-indigo-600" />
          Payment Method Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {analytics.topPaymentMethods.map(([method, amount], index) => {
            const percentage = analytics.totalAmount > 0 ? (amount / analytics.totalAmount) * 100 : 0;
            const colors = [
              'from-indigo-500 to-blue-500',
              'from-green-500 to-emerald-500',
              'from-orange-500 to-red-500',
              'from-purple-500 to-pink-500',
              'from-cyan-500 to-blue-500',
              'from-gray-500 to-gray-600'
            ];
            
            return (
              <div key={method} className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[index]} shadow-sm`}></div>
                  <span className="font-medium text-gray-900 text-sm md:text-base">{method}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-lg md:text-xl font-bold text-gray-900">
                    {formatCurrency(amount, currency)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {percentage.toFixed(1)}% of total spending
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${colors[index]} transition-all duration-500 shadow-sm`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};