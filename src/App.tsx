import React, { useState } from 'react';
import { Wallet, Plus, BarChart3, Home, TrendingUp } from 'lucide-react';
import { Expense } from './types/expense';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { TransactionImport } from './components/TransactionImport';
import { AnalyticsPage } from './components/AnalyticsPage';
import { CurrencyToggle } from './components/CurrencyToggle';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { hapticFeedback } from './utils/haptics';

type Page = 'home' | 'analytics';

function App() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleAddExpense = (formData: any) => {
    addExpense(formData);
    setIsFormOpen(false);
  };

  const handleQuickAddExpense = (formData: any) => {
    const newExpense = addExpense(formData);
    // Automatically open edit form for the newly created expense
    if (newExpense) {
      setEditingExpense(newExpense);
      setIsFormOpen(true);
    }
  };

  const handleImportExpenses = (importedExpenses: any[]) => {
    importedExpenses.forEach(expenseData => {
      addExpense(expenseData);
    });
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleUpdateExpense = (formData: any) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
      setEditingExpense(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleOpenForm = () => {
    // Trigger haptic feedback for add button
    hapticFeedback.action();
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handlePageChange = (page: Page) => {
    // Trigger haptic feedback for navigation
    hapticFeedback.navigation();
    setCurrentPage(page);
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative">
        {/* Static gradient overlay for depth */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-xl">
                    <Wallet size={24} className="text-white md:hidden" />
                    <Wallet size={32} className="text-white hidden md:block" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      ExpenseTracker
                    </h1>
                    <p className="text-xs md:text-sm text-gray-600">Manage your expenses with ease</p>
                  </div>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                  <CurrencyToggle />
                  <button
                    onClick={() => handlePageChange('home')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      currentPage === 'home'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    <Home size={20} />
                    Home
                  </button>
                  <button
                    onClick={() => handlePageChange('analytics')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      currentPage === 'analytics'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    <BarChart3 size={20} />
                    Analytics
                  </button>
                  <button
                    onClick={handleOpenForm}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add
                  </button>
                </div>

                {/* Mobile Navigation - Currency Toggle + Add Button */}
                <div className="md:hidden flex items-center gap-2">
                  <CurrencyToggle />
                  <button
                    onClick={handleOpenForm}
                    className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 text-sm"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
            {currentPage === 'home' ? (
              <>
                {/* Summary Section - Now visible on all devices */}
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-white/30 shadow-xl">
                  <ExpenseSummary expenses={expenses} />
                  
                  {/* View Analytics Button */}
                  <div className="mt-4 md:mt-6 text-center">
                    <button
                      onClick={() => handlePageChange('analytics')}
                      className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto text-sm md:text-base"
                    >
                      <TrendingUp size={18} md:size={20} />
                      View Detailed Analytics
                    </button>
                  </div>
                </div>

                {/* Transaction Import - Enhanced shadows */}
                <div className="mb-6 md:mb-8">
                  <TransactionImport onImportExpenses={handleImportExpenses} />
                </div>

                {/* Expenses List - Enhanced shadows */}
                <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/30 shadow-xl">
                  <ExpenseList
                    expenses={expenses}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                    onAddNew={handleOpenForm}
                    onQuickAdd={handleQuickAddExpense}
                  />
                </div>
              </>
            ) : (
              <AnalyticsPage expenses={expenses} />
            )}
          </main>

          {/* Mobile Bottom Navigation with Haptic Feedback */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-2xl">
            <div className="flex items-center justify-around py-2 px-4">
              <button
                onClick={() => handlePageChange('home')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  currentPage === 'home'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600'
                }`}
              >
                <Home size={22} />
                <span className="text-xs font-medium">Home</span>
              </button>
              
              <button
                onClick={() => handlePageChange('analytics')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  currentPage === 'analytics'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                <BarChart3 size={22} />
                <span className="text-xs font-medium">Analytics</span>
              </button>
              
              <button
                onClick={handleOpenForm}
                className="flex flex-col items-center gap-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-xl transform hover:scale-105 transition-all"
              >
                <Plus size={22} />
                <span className="text-xs font-medium">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expense Form Modal */}
        <ExpenseForm
          isOpen={isFormOpen}
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          onCancel={handleCloseForm}
          editingExpense={editingExpense}
        />
      </div>
    </CurrencyProvider>
  );
}

export default App;