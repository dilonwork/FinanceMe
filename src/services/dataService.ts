// src/services/dataService.ts
import axios from 'axios';
import type { Stock } from '../types';

const BACKEND_URL = 'http://localhost:3000'; // 後端服務的地址

export const dataService = {
  // 從後端獲取所有股票
  async fetchStocks(): Promise<Stock[]> {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/stocks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stocks:', error);
      return [];
    }
  },

  // 新增股票到後端
  async addStock(stock: Omit<Stock, 'id' | 'currentValue' | 'profitLoss'>): Promise<Stock | undefined> {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/stocks`, stock);
      return response.data;
    } catch (error) {
      console.error('Error adding stock:', error);
      return undefined;
    }
  },

  // 更新股票 (如果需要，但目前 StockPage 沒有編輯功能)
  async updateStock(updatedStock: Stock): Promise<Stock | undefined> {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/stocks/${updatedStock.id}`, updatedStock);
      return response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      return undefined;
    }
  },

  // 從後端刪除股票
  async deleteStock(id: string): Promise<boolean> {
    try {
      await axios.delete(`${BACKEND_URL}/api/stocks/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting stock:', error);
      return false;
    }
  },

  // 可以添加其他模塊的數據操作方法
};
