// src/types.ts

export interface Stock {
  id: string; // 用於唯一標識
  symbol: string; // 股票代號，例如 "AAPL"
  name: string; // 股票名稱，例如 "Apple Inc."
  currentPrice: number; // 當前股價
  purchasePrice: number; // 購買成本
  shares: number; // 股數
  currentValue: number; // 當前價值 (currentPrice * shares)
  profitLoss: number; // 損益 (currentValue - (purchasePrice * shares))
}

export interface FinanceData {
  dashboard: {
    totalAssets: number;
    totalDebt: number;
  };
  stocks: Stock[];
  foreignCurrency: any[]; // 待定義
  loans: any[]; // 待定義
}
