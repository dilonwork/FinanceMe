// src/pages/StockPage.tsx
import React, { useState, useEffect } from 'react';
import { type Stock } from '../types';
import { dataService } from '../services/dataService'; // 使用新的 dataService

// 模擬獲取股票即時資訊的函數 (因為不能直接調用外部 API)
// 此函數保持不變，因為它獨立於後端數據持久化
const mockFetchStockInfo = async (query: string) => {
  return new Promise<{ symbol: string; name: string; currentPrice: number }>((resolve) => {
    setTimeout(() => {
      const normalizedQuery = query.toUpperCase();
      if (normalizedQuery.includes('TSMC') || normalizedQuery.includes('2330')) {
        resolve({ symbol: '2330.TW', name: '台積電', currentPrice: 600 + Math.floor(Math.random() * 20 - 10) });
      } else if (normalizedQuery.includes('ASUS') || normalizedQuery.includes('2357')) {
        resolve({ symbol: '2357.TW', name: '華碩', currentPrice: 400 + Math.floor(Math.random() * 10 - 5) });
      } else {
        // 預設值或其他模擬股票
        resolve({ symbol: normalizedQuery, name: `${normalizedQuery} Company`, currentPrice: 100 + Math.floor(Math.random() * 50 - 25) });
      }
    }, 1000); // 模擬網路延遲
  });
};

const StockPage: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [query, setQuery] = useState('');
  const [fetchedStock, setFetchedStock] = useState<{ symbol: string; name: string; currentPrice: number } | null>(null);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 從後端獲取股票列表
  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetched = await dataService.fetchStocks();
        setStocks(fetched);
      } catch (err) {
        setError('無法從後端獲取股票列表。請確保後端伺服器已運行。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStocks();
  }, []); // 空依賴項確保只在組件掛載時執行一次

  const handleQueryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const info = await mockFetchStockInfo(value);
      setFetchedStock(info);
    } else {
      setFetchedStock(null);
    }
  };

  const handleAddStock = async () => {
    if (fetchedStock && purchasePrice > 0 && shares > 0) {
      setError(null);
      try {
        const newStock = await dataService.addStock({
          symbol: fetchedStock.symbol,
          name: fetchedStock.name,
          currentPrice: fetchedStock.currentPrice,
          purchasePrice,
          shares,
        });
        if (newStock) {
          setStocks((prev) => [...prev, newStock]);
          // 清空表單
          setQuery('');
          setFetchedStock(null);
          setPurchasePrice(0);
          setShares(0);
        } else {
          setError('新增股票失敗。');
        }
      } catch (err) {
        setError('新增股票時發生錯誤。');
        console.error(err);
      }
    }
  };

  const handleDeleteStock = async (id: string) => {
    setError(null);
    try {
      const success = await dataService.deleteStock(id);
      if (success) {
        setStocks((prev) => prev.filter((stock) => stock.id !== id));
      } else {
        setError('刪除股票失敗。');
      }
    } catch (err) {
      setError('刪除股票時發生錯誤。');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">載入中...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">股票投資</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">新增股票</h3>
        <input
          type="text"
          placeholder="輸入股票代號或名稱 (例如: TSMC, 2330)"
          className="w-full p-2 border border-gray-300 rounded mb-3"
          value={query}
          onChange={handleQueryChange}
        />
        {fetchedStock && (
          <div className="bg-white p-3 rounded-md shadow-sm mb-3">
            <p><strong>代號:</strong> {fetchedStock.symbol}</p>
            <p><strong>名稱:</strong> {fetchedStock.name}</p>
            <p><strong>當前股價:</strong> {fetchedStock.currentPrice.toFixed(2)}</p>
          </div>
        )}
        <input
          type="number"
          placeholder="購買成本 (例如: 580)"
          className="w-full p-2 border border-gray-300 rounded mb-3"
          value={purchasePrice === 0 ? '' : purchasePrice}
          onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
          min="0"
        />
        <input
          type="number"
          placeholder="股數 (例如: 1000)"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={shares === 0 ? '' : shares}
          onChange={(e) => setShares(parseInt(e.target.value, 10))}
          min="0"
        />
        <button
          onClick={handleAddStock}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          disabled={!fetchedStock || purchasePrice <= 0 || shares <= 0}
        >
          新增股票
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">我的股票</h3>
        {stocks.length === 0 ? (
          <p className="text-gray-500">目前沒有股票投資。</p>
        ) : (
          <div className="space-y-4">
            {stocks.map((stock) => (
              <div key={stock.id} className="border border-gray-200 p-3 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold">{stock.name} ({stock.symbol})</p>
                  <p>當前股價: <span className="font-semibold">{stock.currentPrice.toFixed(2)}</span></p>
                  <p>購買成本: {stock.purchasePrice.toFixed(2)}</p>
                  <p>持有股數: {stock.shares}</p>
                  <p>當前價值: <span className="font-semibold">{stock.currentValue.toFixed(2)}</span></p>
                  <p>損益: <span className={stock.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {stock.profitLoss.toFixed(2)} ({((stock.profitLoss / (stock.purchasePrice * stock.shares)) * 100).toFixed(2)}%)
                </span></p>
                </div>
                <button
                  onClick={() => handleDeleteStock(stock.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition text-sm"
                >
                  刪除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPage;
