import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <span className="logo-icon">🏢</span>
            <div className="brand-text">
              <h2>HostelCare</h2>
              <span className="brand-subtitle">Complaint Portal</span>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={closeSidebar} aria-label="Close Sidebar">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">
            {isAdmin ? 'ADMINISTRATION' : 'STUDENT MENU'}
          </div>

          {isAdmin ? (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">📊</span>
                <span>Admin Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin/complaints"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">📋</span>
                <span>Manage Complaints</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">📊</span>
                <span>My Dashboard</span>
              </NavLink>

              <NavLink
                to="/submit-complaint"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">➕</span>
                <span>Submit Complaint</span>
              </NavLink>

              <NavLink
                to="/my-complaints"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">📑</span>
                <span>My Complaints</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* User profile card & logout at bottom */}
        <div className="sidebar-footer">
          <div className="user-badge-card">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className={`user-role ${isAdmin ? 'role-admin' : 'role-student'}`}>
                {isAdmin ? 'Warden / Admin' : 'Student'}
              </span>
            </div>
          </div>
          <button onClick={logout} className="logout-btn" title="Sign Out">
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
