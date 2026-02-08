"use client";

import { useState, useEffect } from "react";
import type { Expense } from "@/types";

interface SMSMessage {
  body: string;
  date: number;
  address: string;
}

interface ParsedTransaction {
  amount: number;
  description: string;
  category: string;
  merchantName?: string;
  type: 'debit' | 'credit';
}

// Common bank SMS patterns
const TRANSACTION_PATTERNS = [
  // Pattern 1: Rs/INR/₹ 1,234.56 debited/spent
  /(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)\s*(?:debited|spent|paid|withdrawn)/i,
  // Pattern 2: debited/spent Rs/INR/₹ 1,234.56
  /(?:debited|spent|paid|withdrawn)\s*(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)/i,
  // Pattern 3: for Rs/INR/₹ 1,234.56
  /for\s*(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)/i,
  // Pattern 4: of Rs/INR/₹ 1,234.56
  /of\s*(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)/i,
];

const MERCHANT_PATTERNS = [
  /(?:at|to|@)\s+([A-Z][A-Za-z0-9\s&'-]+?)(?:\s+on|\s+for|\s+Rs|\.|\s+card|$)/i,
  /(?:paid to|sent to)\s+([A-Za-z0-9\s&'-]+)/i,
];

const CATEGORY_KEYWORDS: { [key: string]: string[] } = {
  "Food & Dining": ["swiggy", "zomato", "restaurant", "cafe", "food", "dominos", "pizza", "mcdonald", "kfc", "subway"],
  "Transportation": ["uber", "ola", "rapido", "fuel", "petrol", "diesel", "metro", "taxi", "parking"],
  "Shopping": ["amazon", "flipkart", "myntra", "ajio", "shop", "mall", "store", "retail"],
  "Entertainment": ["netflix", "prime", "hotstar", "spotify", "bookmyshow", "movie", "cinema", "pvr"],
  "Bills & Utilities": ["electricity", "water", "gas", "bill", "recharge", "airtel", "jio", "vodafone", "broadband"],
  "Healthcare": ["pharmacy", "hospital", "clinic", "doctor", "medical", "medicine", "apollo", "medplus"],
  "Groceries": ["grocery", "supermarket", "bigbasket", "grofers", "blinkit", "mart", "dmart"],
  "Education": ["course", "book", "tuition", "education", "udemy", "coursera", "school", "college"],
};

export function useSMSReader() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [messages, setMessages] = useState<SMSMessage[]>([]);

  useEffect(() => {
    // Check if SMS reading is supported (mainly Android with WebOTP API)
    const checkSupport = () => {
      // Web OTP API is available on some Android browsers
      if ('OTPCredential' in window) {
        setIsSupported(true);
      } else {
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    try {
      // For PWA on Android, we need to request permission through native bridge
      // This is a placeholder - actual implementation requires Capacitor/Cordova plugin
      
      // Check if running as installed PWA
      if (window.matchMedia('(display-mode: standalone)').matches) {
        // Request permission via notification API as proxy
        const permission = await Notification.requestPermission();
        setHasPermission(permission === 'granted');
        return permission === 'granted';
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting SMS permission:', error);
      setHasPermission(false);
      return false;
    }
  };

  const parseTransaction = (messageBody: string): ParsedTransaction | null => {
    // Check if it's a transaction message
    const lowerBody = messageBody.toLowerCase();
    if (!lowerBody.includes('debited') && 
        !lowerBody.includes('spent') && 
        !lowerBody.includes('paid') &&
        !lowerBody.includes('withdrawn')) {
      return null;
    }

    // Extract amount
    let amount = 0;
    for (const pattern of TRANSACTION_PATTERNS) {
      const match = messageBody.match(pattern);
      if (match) {
        const amountStr = match[1].replace(/,/g, '');
        amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > 0) break;
      }
    }

    if (amount === 0) return null;

    // Extract merchant name
    let merchantName = '';
    for (const pattern of MERCHANT_PATTERNS) {
      const match = messageBody.match(pattern);
      if (match && match[1]) {
        merchantName = match[1].trim();
        break;
      }
    }

    // Determine category based on keywords
    let category = 'Other';
    const bodyLower = messageBody.toLowerCase();
    
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(keyword => bodyLower.includes(keyword))) {
        category = cat;
        break;
      }
    }

    // Create description
    const description = merchantName || 'Transaction';

    return {
      amount,
      description,
      category,
      merchantName,
      type: 'debit'
    };
  };

  const readSMSMessages = async (): Promise<Expense[]> => {
    // This is a simulated implementation
    // In a real PWA with Capacitor/Cordova, you would use:
    // - @capacitor-community/sms-retriever for Android
    // - cordova-plugin-sms-retriever
    
    const simulatedMessages: SMSMessage[] = [
      {
        body: "Rs 450.00 debited from your account at SWIGGY on 08-Feb-26. Avl bal: Rs 15,234.50",
        date: Date.now() - 3600000,
        address: "HDFCBK"
      },
      {
        body: "Your A/c XX1234 debited with INR 1200.00 on 07-Feb-26 for Amazon transaction. Available balance: 14,034.50",
        date: Date.now() - 86400000,
        address: "ICICIB"
      },
      {
        body: "Rs 85.00 spent at UBER on 07-Feb-26 via Card ending 5678. Avl bal: Rs 12,834.50",
        date: Date.now() - 86400000 * 2,
        address: "SBIIN"
      }
    ];

    const expenses: Expense[] = [];
    
    for (const msg of simulatedMessages) {
      const parsed = parseTransaction(msg.body);
      if (parsed) {
        expenses.push({
          id: `sms-${msg.date}`,
          amount: parsed.amount,
          description: parsed.description,
          category: parsed.category,
          date: new Date(msg.date).toISOString().split('T')[0],
          notes: `Auto-imported from SMS: ${msg.address}`,
          createdAt: new Date(msg.date).toISOString(),
        });
      }
    }

    return expenses;
  };

  return {
    isSupported,
    hasPermission,
    requestPermission,
    readSMSMessages,
    parseTransaction,
  };
}
