// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import StockPage from './pages/StockPage';
import ForeignCurrencyPage from './pages/ForeignCurrencyPage';
import LoanPage from './pages/LoanPage';

function App() {
  return (
    <div className="app-container">
      <main className="app-content">
        <Routes>
          <Route path="/"                 element={<DashboardPage />} />
          <Route path="/stocks"           element={<StockPage />} />
          <Route path="/foreign-currency" element={<ForeignCurrencyPage />} />
          <Route path="/loans"            element={<LoanPage />} />
        </Routes>
      </main>
      <Navbar />
    </div>
  );
}

export default App;
