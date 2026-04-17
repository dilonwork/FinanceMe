// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import './DashboardPage.css';

interface SummaryCard {
  label: string;
  value: string;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}

const DashboardPage: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const cards: SummaryCard[] = [
    { label: '股票投資', value: 'NT$ 1,200,000', sub: '+8.5% 報酬率', trend: 'up', color: 'card--blue' },
    { label: '外幣 / 定存', value: 'NT$ 980,000', sub: 'USD · JPY · EUR', trend: 'neutral', color: 'card--gold' },
    { label: '貸款餘額', value: 'NT$ 340,000', sub: '剩餘 18 期', trend: 'down', color: 'card--red' },
  ];

  const allocations = [
    { label: '股票', pct: 42, color: '#4EC9B0' },
    { label: '外幣/定存', pct: 35, color: '#60A5FA' },
    { label: '現金', pct: 15, color: '#FBBF24' },
    { label: '其他', pct: 8, color: '#A78BFA' },
  ];

  return (
    <div className={`db-root ${visible ? 'db-root--in' : ''}`}>
      {/* Header */}
      <header className="db-header">
        <div className="db-header__eyebrow">財務總覽</div>
        <h1 className="db-header__title">FinanceMe</h1>
        <p className="db-header__date">{new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      {/* Net Worth Hero */}
      <section className="db-hero">
        <div className="db-hero__label">淨資產</div>
        <div className="db-hero__value">NT$ 2,500,000</div>
        <div className="db-hero__badge db-hero__badge--up">▲ NT$ 102,000 本月</div>
      </section>

      {/* Summary Cards */}
      <section className="db-cards">
        {cards.map((c, i) => (
          <div
            key={c.label}
            className={`db-card ${c.color}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="db-card__label">{c.label}</div>
            <div className="db-card__value">{c.value}</div>
            {c.sub && (
              <div className={`db-card__sub db-card__sub--${c.trend}`}>
                {c.trend === 'up' && '↑ '}
                {c.trend === 'down' && '↓ '}
                {c.sub}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Allocation Bar */}
      <section className="db-alloc">
        <div className="db-section-title">資產配置</div>
        <div className="db-alloc__bar">
          {allocations.map((a) => (
            <div
              key={a.label}
              className="db-alloc__seg"
              style={{ width: `${a.pct}%`, background: a.color }}
              title={`${a.label} ${a.pct}%`}
            />
          ))}
        </div>
        <div className="db-alloc__legend">
          {allocations.map((a) => (
            <div key={a.label} className="db-alloc__item">
              <span className="db-alloc__dot" style={{ background: a.color }} />
              <span className="db-alloc__name">{a.label}</span>
              <span className="db-alloc__pct">{a.pct}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="db-quick">
        <div className="db-section-title">快速進入</div>
        <div className="db-quick__grid">
          {[
            { icon: '📈', label: '股票投資', href: '/stocks' },
            { icon: '💱', label: '外幣/定存', href: '/foreign-currency' },
            { icon: '🏦', label: '貸款管理', href: '/loans' },
          ].map((link) => (
            <a key={link.label} href={link.href} className="db-quick__card">
              <span className="db-quick__icon">{link.icon}</span>
              <span className="db-quick__label">{link.label}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
