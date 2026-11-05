import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  // Not logged in -> go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role restrictions if provided
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If student tries to visit admin page, redirect to student dashboard
    if (user.role === 'student') {
      return <Navigate to="/dashboard" replace />;
    }
    // If admin tries to visit student page, redirect to admin dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
