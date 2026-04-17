// src/components/Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/',                 icon: '⊞', label: '儀表板' },
  { to: '/stocks',           icon: '↗', label: '股票' },
  { to: '/foreign-currency', icon: '◈', label: '外幣' },
  { to: '/loans',            icon: '◉', label: '貸款' },
];

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      {NAV_ITEMS.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `navbar__item${isActive ? ' navbar__item--active' : ''}`
          }
        >
          <span className="navbar__icon">{icon}</span>
          <span className="navbar__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
