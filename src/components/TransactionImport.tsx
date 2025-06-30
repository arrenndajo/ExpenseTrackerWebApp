import React, { useState } from 'react';
import { Upload, Zap, CheckCircle } from 'lucide-react';
import { ExpenseFormData } from '../types/expense';
import { parseTransactionText } from '../utils/transactionParser';

interface TransactionImportProps {
  onImportExpenses: (expenses: ExpenseFormData[]) => void;
}

export const TransactionImport: React.FC<TransactionImportProps> = ({ onImportExpenses }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [importText, setImportText] = useState('');
  const [parsedTransactions, setParsedTransactions] = useState<ExpenseFormData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTextImport = async () => {
    if (!importText.trim()) return;
    
    setIsProcessing(true);
    try {
      const transactions = parseTransactionText(importText);
      setParsedTransactions(transactions);
    } catch (error) {
      console.error('Error parsing transactions:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportAll = () => {
    onImportExpenses(parsedTransactions);
    setImportText('');
    setParsedTransactions([]);
    setIsExpanded(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-md rounded-xl shadow-xl border border-blue-200/50 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Smart Transaction Import</h3>
            <p className="text-sm text-gray-600">Import expenses from bank statements or notifications</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
        >
          {isExpanded ? 'Close' : 'Import Transactions'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Manual Import Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Upload size={20} className="text-purple-600" />
              Import Transaction Text
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste transaction notifications, bank statements, or receipts:
                </label>
                <textarea
                  id="transaction-text"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste your transaction notifications here...

Examples:
• Bank SMS: 'DEBIT CARD PURCHASE - STARBUCKS $8.50 on 01/15/2025'
• Credit card alert: 'Transaction Alert: $25.00 at UBER'
• PayPal notification: 'You sent $30.00 to John Doe'
• Multiple transactions (one per line)"
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white/80 backdrop-blur-sm shadow-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleTextImport}
                  disabled={!importText.trim() || isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Parse Transactions
                    </>
                  )}
                </button>

                {parsedTransactions.length > 0 && (
                  <button
                    onClick={handleImportAll}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <CheckCircle size={16} />
                    Import {parsedTransactions.length} Transactions
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Parsed Results */}
          {parsedTransactions.length > 0 && (
            <div className="bg-green-50/80 backdrop-blur-sm rounded-lg p-4 border border-green-200/50 shadow-lg">
              <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-600" />
                Parsed Transactions ({parsedTransactions.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {parsedTransactions.map((transaction, index) => (
                  <div key={index} className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-green-200/50 shadow-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="ml-1 font-medium text-green-700">${transaction.amount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-1 font-medium text-blue-700">{transaction.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment:</span>
                        <span className="ml-1 font-medium text-indigo-700">{transaction.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Description:</span>
                        <span className="ml-1 font-medium text-gray-800">{transaction.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50 shadow-lg">
            <h4 className="font-semibold text-blue-900 mb-3">💡 Quick Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <ul className="space-y-1">
                <li>• Copy multiple transactions at once</li>
                <li>• Works with bank SMS notifications</li>
                <li>• Recognizes credit card alerts</li>
                <li>• Supports PayPal, Venmo notifications</li>
              </ul>
              <ul className="space-y-1">
                <li>• Auto-detects amounts and dates</li>
                <li>• Smart category assignment</li>
                <li>• Payment method recognition</li>
                <li>• Edit results before importing</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};