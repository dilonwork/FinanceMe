// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

import DashboardPage from './pages/DashboardPage';
import StockPage from './pages/StockPage';
import ForeignCurrencyPage from './pages/ForeignCurrencyPage';
import LoanPage from './pages/LoanPage';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>FinanceMe - Your Personal Finance Tracker</h1>
        <nav className="app-nav">
          <Link to="/" className="nav-item">儀表板</Link>
          <Link to="/stocks" className="nav-item">股票投資</Link>
          <Link to="/foreign-currency" className="nav-item">外幣 / 定存 / 現金</Link>
          <Link to="/loans" className="nav-item">貸款</Link>
        </nav>
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/stocks" element={<StockPage />} />
          <Route path="/foreign-currency" element={<ForeignCurrencyPage />} />
          <Route path="/loans" element={<LoanPage />} />
          {/* 可以添加 404 頁面 */}
        </Routes>
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} FinanceMe</p>
      </footer>
    </div>
  );
}

export default App;
