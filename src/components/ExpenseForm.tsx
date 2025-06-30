import React, { useState, useEffect } from 'react';
import { Plus, X, DollarSign, Calendar, Tag, FileText, Edit3, CreditCard } from 'lucide-react';
import { ExpenseFormData, Expense } from '../types/expense';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, getTodayDate } from '../utils/expenseUtils';
import { hapticFeedback } from '../utils/haptics';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel?: () => void;
  editingExpense?: Expense | null;
  isOpen: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  editingExpense,
  isOpen
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: '',
    category: '',
    description: '',
    date: getTodayDate(),
    paymentMethod: ''
  });

  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
  const [isQuickAddEdit, setIsQuickAddEdit] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        description: editingExpense.description,
        date: editingExpense.date,
        paymentMethod: editingExpense.paymentMethod
      });
      // Check if this is a recently created expense (within last 5 seconds)
      const createdAt = new Date(editingExpense.createdAt);
      const now = new Date();
      const timeDiff = now.getTime() - createdAt.getTime();
      setIsQuickAddEdit(timeDiff < 5000); // 5 seconds
    } else {
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: getTodayDate(),
        paymentMethod: ''
      });
      setIsQuickAddEdit(false);
    }
    setErrors({});
  }, [editingExpense, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseFormData> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Trigger success haptic feedback
      hapticFeedback.success();
      onSubmit(formData);
      if (!editingExpense) {
        setFormData({
          amount: '',
          category: '',
          description: '',
          date: getTodayDate(),
          paymentMethod: ''
        });
      }
    } else {
      // Trigger error haptic feedback for validation errors
      hapticFeedback.error();
    }
  };

  const handleCancel = () => {
    // Trigger light haptic feedback for cancel action
    hapticFeedback.button();
    if (onCancel) {
      onCancel();
    }
  };

  const handleInputChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  const getFormTitle = () => {
    if (isQuickAddEdit) {
      return (
        <>
          <Edit3 size={28} className="text-purple-600" />
          Refine Your Expense
        </>
      );
    } else if (editingExpense) {
      return (
        <>
          <FileText size={28} className="text-blue-600" />
          Edit Expense
        </>
      );
    } else {
      return (
        <>
          <Plus size={28} className="text-emerald-600" />
          Add Expense
        </>
      );
    }
  };

  const getFormSubtitle = () => {
    if (isQuickAddEdit) {
      return "Review and adjust the details detected from your quick input";
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {getFormTitle()}
              </h2>
              {getFormSubtitle() && (
                <p className="text-sm text-gray-600 mt-1">{getFormSubtitle()}</p>
              )}
            </div>
            {onCancel && (
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-600" />
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag size={16} className="text-blue-600" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <CreditCard size={16} className="text-indigo-600" />
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                  errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select payment method</option>
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-purple-600" />
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="What was this expense for?"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-amber-600" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  {isQuickAddEdit ? 'Keep as is' : 'Cancel'}
                </button>
              )}
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-lg"
              >
                {isQuickAddEdit ? 'Save Changes' : editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};