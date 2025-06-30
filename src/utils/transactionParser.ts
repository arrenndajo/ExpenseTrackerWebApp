import { ExpenseFormData } from '../types/expense';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, getTodayDate } from './expenseUtils';

// Enhanced patterns for parsing various transaction formats
const TRANSACTION_PATTERNS = {
  // Amount patterns - more comprehensive with INR support
  amount: [
    /(?:\$|USD\s*|Rs\.?\s*|₹\s*|INR\s*)?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /amount[:\s]*(?:\$|USD\s*|Rs\.?\s*|₹\s*|INR\s*)?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /charged[:\s]*(?:\$|USD\s*|Rs\.?\s*|₹\s*|INR\s*)?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /debited[:\s]*(?:\$|USD\s*|Rs\.?\s*|₹\s*|INR\s*)?(\d+(?:,\d{3})*(?:\.\d{2})?)/i
  ],

  // Date patterns
  date: [
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{4}-\d{2}-\d{2})/,
    /(\d{1,2}-\d{1,2}-\d{4})/,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/i,
    /on\s+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /date[:\s]*(\d{1,2}\/\d{1,2}\/\d{4})/i
  ],

  // Merchant/Description patterns
  merchant: [
    /(?:at|from|to)\s+([A-Z][A-Z\s&.'-]+?)(?:\s+(?:\$|₹|\d+|on|dated|amount))/i,
    /purchase\s*-?\s*([A-Z][A-Z\s&.'-]+?)(?:\s+(?:\$|₹|\d+|#))/i,
    /payment\s*-?\s*([A-Z][A-Z\s&.'-]+?)(?:\s+(?:\$|₹|\d+|#))/i,
    /transaction\s*-?\s*([A-Z][A-Z\s&.'-]+?)(?:\s+(?:\$|₹|\d+|#))/i,
    /([A-Z][A-Z\s&.'-]{3,}?)(?:\s+(?:\$|₹|\d+|#))/
  ],

  // Transaction type patterns
  transactionType: [
    /(debit card|credit card|atm|online|mobile|upi|wallet|cash|bank transfer)/i,
    /(purchase|payment|withdrawal|transfer|deposit)/i
  ]
};

// Enhanced category detection with Indian context
const ENHANCED_CATEGORY_KEYWORDS = {
  'Food & Dining': [
    'starbucks', 'mcdonalds', 'subway', 'dominos', 'pizza', 'restaurant', 'cafe', 'coffee',
    'food', 'dining', 'lunch', 'dinner', 'breakfast', 'meal', 'eat', 'drink', 'bar',
    'kfc', 'burger', 'taco', 'chipotle', 'panera', 'dunkin', 'tim hortons',
    'swiggy', 'zomato', 'foodpanda', 'haldirams', 'ccd', 'barista'
  ],
  'Transportation': [
    'uber', 'lyft', 'taxi', 'cab', 'bus', 'train', 'metro', 'subway', 'gas', 'fuel',
    'parking', 'toll', 'transport', 'airline', 'flight', 'car rental', 'hertz', 'avis',
    'ola', 'rapido', 'auto', 'rickshaw', 'petrol', 'diesel', 'irctc'
  ],
  'Shopping': [
    'amazon', 'walmart', 'target', 'costco', 'ebay', 'store', 'mall', 'shopping',
    'clothes', 'clothing', 'fashion', 'shoes', 'electronics', 'best buy', 'apple store',
    'flipkart', 'myntra', 'ajio', 'nykaa', 'big bazaar', 'reliance', 'dmart'
  ],
  'Entertainment': [
    'netflix', 'spotify', 'movie', 'cinema', 'theater', 'game', 'gaming', 'concert',
    'show', 'entertainment', 'fun', 'amusement', 'disney', 'hulu', 'youtube',
    'bookmyshow', 'pvr', 'inox', 'hotstar', 'prime video', 'zee5'
  ],
  'Bills & Utilities': [
    'electric', 'electricity', 'water', 'gas bill', 'internet', 'phone', 'mobile',
    'utility', 'rent', 'mortgage', 'insurance', 'verizon', 'att', 'comcast',
    'bsnl', 'airtel', 'jio', 'vi', 'vodafone', 'tata power', 'adani', 'bescom'
  ],
  'Healthcare': [
    'doctor', 'hospital', 'pharmacy', 'medical', 'health', 'dentist', 'clinic',
    'medicine', 'prescription', 'cvs', 'walgreens', 'urgent care',
    'apollo', 'fortis', 'max', 'medplus', 'pharmeasy', 'netmeds'
  ],
  'Travel': [
    'hotel', 'motel', 'airbnb', 'booking', 'expedia', 'vacation', 'trip', 'travel',
    'flight', 'airline', 'marriott', 'hilton', 'hyatt',
    'makemytrip', 'goibibo', 'cleartrip', 'yatra', 'oyo', 'treebo'
  ],
  'Education': [
    'school', 'university', 'college', 'tuition', 'book', 'course', 'education',
    'learning', 'training', 'certification', 'amazon books',
    'byju', 'unacademy', 'vedantu', 'coursera', 'udemy'
  ],
  'Personal Care': [
    'salon', 'spa', 'haircut', 'beauty', 'cosmetics', 'gym', 'fitness', 'personal',
    'care', 'massage', 'nail', 'sephora', 'ulta',
    'lakme', 'vlcc', 'jawed habib', 'cult fit', 'gold gym'
  ]
};

// Enhanced payment method detection with Indian context
const ENHANCED_PAYMENT_KEYWORDS = {
  'Credit Card': [
    'credit card', 'visa', 'mastercard', 'amex', 'american express', 'discover',
    'cc purchase', 'credit', 'card ending', 'hdfc', 'icici', 'sbi card', 'axis'
  ],
  'Debit Card': [
    'debit card', 'debit', 'card purchase', 'pos', 'point of sale', 'atm card'
  ],
  'Digital Wallet': [
    'paypal', 'venmo', 'apple pay', 'google pay', 'samsung pay', 'zelle',
    'cashapp', 'wallet', 'digital payment', 'mobile payment', 'upi',
    'paytm', 'phonepe', 'gpay', 'bhim', 'mobikwik', 'freecharge', 'amazon pay'
  ],
  'Bank Transfer': [
    'bank transfer', 'wire transfer', 'ach', 'direct debit', 'online transfer',
    'electronic transfer', 'bank payment', 'neft', 'rtgs', 'imps'
  ],
  'Cash': [
    'cash', 'atm withdrawal', 'cash withdrawal', 'atm', 'cash advance'
  ]
};

export const parseTransactionText = (text: string): ExpenseFormData[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const transactions: ExpenseFormData[] = [];

  for (const line of lines) {
    const transaction = parseTransactionLine(line.trim());
    if (transaction && transaction.amount && parseFloat(transaction.amount) > 0) {
      transactions.push(transaction);
    }
  }

  return transactions;
};

const parseTransactionLine = (line: string): ExpenseFormData | null => {
  if (!line || line.length < 10) return null;

  const transaction: Partial<ExpenseFormData> = {
    date: getTodayDate(),
    paymentMethod: 'Other',
    category: 'Other'
  };

  // Extract amount
  let amount = '';
  for (const pattern of TRANSACTION_PATTERNS.amount) {
    const match = line.match(pattern);
    if (match) {
      amount = match[1].replace(/,/g, ''); // Remove commas
      break;
    }
  }

  if (!amount) return null;
  transaction.amount = amount;

  // Extract date
  for (const pattern of TRANSACTION_PATTERNS.date) {
    const match = line.match(pattern);
    if (match) {
      const dateStr = match[1] || match[0];
      const parsedDate = parseDate(dateStr);
      if (parsedDate) {
        transaction.date = parsedDate;
        break;
      }
    }
  }

  // Extract merchant/description
  let description = '';
  for (const pattern of TRANSACTION_PATTERNS.merchant) {
    const match = line.match(pattern);
    if (match && match[1]) {
      description = match[1].trim();
      break;
    }
  }

  if (!description) {
    // Fallback: clean up the line for description
    description = line
      .replace(/[\$₹]?\d+(?:,\d{3})*(?:\.\d{2})?/g, '') // Remove amounts
      .replace(/\d{1,2}\/\d{1,2}\/\d{4}/g, '') // Remove dates
      .replace(/\s+/g, ' ')
      .trim();
  }

  transaction.description = description || 'Transaction';

  // Detect category
  const lowerLine = line.toLowerCase();
  for (const [category, keywords] of Object.entries(ENHANCED_CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerLine.includes(keyword.toLowerCase()))) {
      transaction.category = category;
      break;
    }
  }

  // Detect payment method
  for (const [paymentMethod, keywords] of Object.entries(ENHANCED_PAYMENT_KEYWORDS)) {
    if (keywords.some(keyword => lowerLine.includes(keyword.toLowerCase()))) {
      transaction.paymentMethod = paymentMethod;
      break;
    }
  }

  return transaction as ExpenseFormData;
};

const parseDate = (dateStr: string): string | null => {
  try {
    // Handle various date formats
    let date: Date;

    if (dateStr.includes('/')) {
      // MM/DD/YYYY or DD/MM/YYYY
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // Assume MM/DD/YYYY for US format
        date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
      } else {
        return null;
      }
    } else if (dateStr.includes('-')) {
      // YYYY-MM-DD or DD-MM-YYYY
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        date = new Date(dateStr);
      } else {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        } else {
          return null;
        }
      }
    } else {
      // Try parsing as-is (for formats like "Jan 15, 2025")
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) return null;

    // Return in YYYY-MM-DD format
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
};

// Export for use in semantic input as well
export { ENHANCED_CATEGORY_KEYWORDS, ENHANCED_PAYMENT_KEYWORDS };