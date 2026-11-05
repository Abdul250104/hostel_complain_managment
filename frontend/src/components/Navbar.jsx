import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar, title = 'Hostel Complaint Management' }) => {
  const { user, logout } = useAuth();

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          className="hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <div className="header-title-box">
          <h1 className="header-page-title">{title}</h1>
        </div>
      </div>

      <div className="navbar-right">
        <div className="user-pill">
          <span className="user-greeting">Welcome,</span>
          <strong className="user-display-name">{user?.name}</strong>
          <span className="user-role-tag">({user?.role})</span>
        </div>
        <button onClick={logout} className="navbar-logout-btn" title="Logout">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
