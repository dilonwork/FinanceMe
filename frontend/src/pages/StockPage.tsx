// src/pages/StockPage.tsx
import React, { useState, useEffect } from 'react';
import { type Stock } from '../types';
import { dataService } from '../services/dataService'; // 使用新的 dataService
import './PageStyles.css';

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
  }, []);

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
    return <div className="pg-root"><div className="pg-content text-gray" style={{ textAlign: 'center', marginTop: '2rem' }}>載入中...</div></div>;
  }

  return (
    <div className="pg-root">
      <header className="pg-header">
        <h1 className="pg-header__title">股票投資</h1>
        <p className="pg-header__desc">管理您的股票組合與損益</p>
      </header>

      <div className="pg-content">
        {error && <div className="alert-error" role="alert">{error}</div>}

        <section className="pg-card">
          <h3 className="pg-card__title">🚀 新增股票</h3>
          <input
            type="text"
            placeholder="輸入股票代號或名稱 (例如: TSMC, 2330)"
            className="pg-input"
            value={query}
            onChange={handleQueryChange}
          />
          {fetchedStock && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.8rem', fontSize: '0.85rem' }}>
              <p><strong>代號:</strong> <span className="text-mono">{fetchedStock.symbol}</span></p>
              <p><strong>名稱:</strong> {fetchedStock.name}</p>
              <p><strong>當前股價:</strong> <span className="text-mono text-green">{fetchedStock.currentPrice.toFixed(2)}</span></p>
            </div>
          )}
          <input
            type="number"
            placeholder="購買成本 (例如: 580)"
            className="pg-input"
            value={purchasePrice === 0 ? '' : purchasePrice}
            onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
            min="0"
          />
          <input
            type="number"
            placeholder="股數 (例如: 1000)"
            className="pg-input"
            value={shares === 0 ? '' : shares}
            onChange={(e) => setShares(parseInt(e.target.value, 10))}
            min="0"
          />
          <button
            onClick={handleAddStock}
            className="btn btn-primary"
            disabled={!fetchedStock || purchasePrice <= 0 || shares <= 0}
          >
            ＋ 新增股票
          </button>
        </section>

        <section className="pg-card">
          <h3 className="pg-card__title">💼 我的股票</h3>
          {stocks.length === 0 ? (
            <p className="text-gray" style={{ fontSize: '0.85rem' }}>目前沒有股票投資。</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {stocks.map((stock) => (
                <div key={stock.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e8eaf0', marginBottom: '0.2rem' }}>{stock.name} <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>({stock.symbol})</span></p>
                    <p>當前股價: <span className="text-mono">{stock.currentPrice.toFixed(2)}</span></p>
                    <p>購買成本: <span className="text-mono">{stock.purchasePrice.toFixed(2)}</span></p>
                    <p>持有股數: <span className="text-mono">{stock.shares}</span></p>
                    <p>當前價值: <span className="text-mono text-green">{stock.currentValue.toFixed(2)}</span></p>
                    <p>損益: <span className={`text-mono ${stock.profitLoss >= 0 ? 'text-green' : 'text-red'}`}>
                      {stock.profitLoss >= 0 ? '+' : ''}{stock.profitLoss.toFixed(2)} ({((stock.profitLoss / (stock.purchasePrice * stock.shares)) * 100).toFixed(2)}%)
                    </span></p>
                  </div>
                  <button
                    onClick={() => handleDeleteStock(stock.id)}
                    className="btn btn-danger btn--sm"
                  >
                    刪除
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StockPage;
