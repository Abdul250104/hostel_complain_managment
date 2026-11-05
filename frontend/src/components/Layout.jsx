import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/dashboard':
      return 'Student Dashboard';
    case '/submit-complaint':
      return 'Submit New Complaint';
    case '/my-complaints':
      return 'My Complaints History';
    case '/admin/dashboard':
      return 'Hostel Warden Dashboard';
    case '/admin/complaints':
      return 'Manage Student Complaints';
    default:
      return 'Hostel Complaint Management';
  }
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = getPageTitle(location.pathname);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      <div className="main-content-wrapper">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={title} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
