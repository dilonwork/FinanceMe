// src/pages/LoanPage.tsx
import React from 'react';
import './PageStyles.css';

const LoanPage: React.FC = () => {
  return (
    <div className="pg-root">
      <header className="pg-header">
        <h1 className="pg-header__title">貸款管理</h1>
        <p className="pg-header__desc">追蹤您的貸款餘額與還款進度</p>
      </header>

      <div className="pg-content">
        <section className="pg-card">
          <h3 className="pg-card__title">🏦 即將推出</h3>
          <p className="text-gray" style={{ fontSize: '0.85rem' }}>貸款管理功能正在開發中，敬請期待。</p>
        </section>
      </div>
    </div>
  );
};

export default LoanPage;
