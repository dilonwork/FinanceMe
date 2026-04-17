// src/pages/ForeignCurrencyPage.tsx
import React from 'react';
import './PageStyles.css';

const ForeignCurrencyPage: React.FC = () => {
  return (
    <div className="pg-root">
      <header className="pg-header">
        <h1 className="pg-header__title">外幣 / 定存</h1>
        <p className="pg-header__desc">管理您的外幣投資、定存及現金</p>
      </header>

      <div className="pg-content">
        <section className="pg-card">
          <h3 className="pg-card__title">💱 即將推出</h3>
          <p className="text-gray" style={{ fontSize: '0.85rem' }}>外幣兌換與定存管理功能正在開發中，敬請期待。</p>
        </section>
      </div>
    </div>
  );
};

export default ForeignCurrencyPage;
