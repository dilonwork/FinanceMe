import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-item">Dashboard</Link>
      <Link to="/stocks" className="nav-item">股票</Link>
      <Link to="/foreign-currency" className="nav-item">外幣/現金</Link>
      <Link to="/loans" className="nav-item">貸款</Link>
    </nav>
  );
};

export default Navbar;