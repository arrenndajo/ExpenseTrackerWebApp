import React from 'react';
import { DollarSign, IndianRupee } from 'lucide-react';
import { useCurrency, Currency } from '../contexts/CurrencyContext';

export const CurrencyToggle: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  return (
    <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-1 shadow-md">
      <button
        onClick={() => handleCurrencyChange('USD')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${
          currency === 'USD'
            ? 'bg-emerald-100 text-emerald-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }`}
        title="US Dollar"
      >
        <DollarSign size={16} />
        <span className="hidden sm:inline">USD</span>
      </button>
      <button
        onClick={() => handleCurrencyChange('INR')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${
          currency === 'INR'
            ? 'bg-emerald-100 text-emerald-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }`}
        title="Indian Rupee"
      >
        <IndianRupee size={16} />
        <span className="hidden sm:inline">INR</span>
      </button>
    </div>
  );
};