import React, { useState } from 'react';
import { Zap, Plus, Sparkles } from 'lucide-react';
import { ExpenseFormData } from '../types/expense';
import { parseSemanticInput, EXPENSE_CATEGORIES, getTodayDate } from '../utils/expenseUtils';

interface SemanticExpenseInputProps {
  onSubmit: (data: ExpenseFormData) => void;
}

export const SemanticExpenseInput: React.FC<SemanticExpenseInputProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [parsedData, setParsedData] = useState<Partial<ExpenseFormData> | null>(null);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.trim()) {
      const parsed = parseSemanticInput(value);
      setParsedData(parsed);
    } else {
      setParsedData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsed = parseSemanticInput(input);
    
    // Ensure we have required fields
    const formData: ExpenseFormData = {
      amount: parsed.amount || '0',
      category: parsed.category || 'Other',
      description: parsed.description || input,
      date: getTodayDate(),
      paymentMethod: parsed.paymentMethod || 'Other'
    };

    // Only submit if we have a valid amount
    if (parseFloat(formData.amount) > 0) {
      onSubmit(formData);
      setInput('');
      setParsedData(null);
      setIsExpanded(false);
    }
  };

  const examples = [
    '$15 lunch at subway with card',
    '25 uber to airport cash',
    '$8.50 coffee with apple pay',
    '120 grocery shopping debit',
    '$45 dinner with credit card'
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/60 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} md:size={20} className="text-purple-600" />
        <h3 className="font-semibold text-gray-900 text-sm md:text-base">Quick Add Expense</h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full shadow-sm">
          Auto-opens editor
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Try: $15 lunch with card, 25 uber cash, $8 coffee apple pay..."
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white/80 backdrop-blur-sm shadow-sm text-sm md:text-base"
          />
          <button
            type="submit"
            disabled={!input.trim() || !parsedData?.amount}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Parsed Preview */}
        {parsedData && input.trim() && (
          <div className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-sm border border-purple-200/50 rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Detected (will open editor for refinement):</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {parsedData.amount && (
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <span className="ml-1 font-medium text-green-700">${parsedData.amount}</span>
                </div>
              )}
              {parsedData.category && (
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-1 font-medium text-blue-700">{parsedData.category}</span>
                </div>
              )}
              {parsedData.paymentMethod && (
                <div>
                  <span className="text-gray-600">Payment:</span>
                  <span className="ml-1 font-medium text-indigo-700">{parsedData.paymentMethod}</span>
                </div>
              )}
              {parsedData.description && (
                <div className="col-span-2 md:col-span-1">
                  <span className="text-gray-600">Description:</span>
                  <span className="ml-1 font-medium text-gray-800">{parsedData.description}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Examples */}
        {isExpanded && !input.trim() && (
          <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleInputChange(example)}
                  className="px-2 md:px-3 py-1 bg-white/90 border border-gray-200/50 rounded-full text-xs md:text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-200 transition-colors shadow-sm"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};