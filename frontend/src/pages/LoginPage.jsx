import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email address and password');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Helper buttons to quickly test without manually typing
  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-icon">🏢</div>
          <h1 className="auth-title">Hostel Complaint Portal</h1>
          <p className="auth-subtitle">Sign in to manage and track hostel grievances</p>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="e.g. rahul@hostel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo login shortcuts */}
        <div className="demo-credentials-box">
          <p className="demo-title">Quick Demo Login (Click to fill):</p>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="btn btn-outline-sm"
              onClick={() => handleQuickLogin('rahul@hostel.com', 'student123')}
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              className="btn btn-outline-sm"
              onClick={() => handleQuickLogin('admin@hostel.com', 'admin123')}
            >
              🛡️ Admin / Warden
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have a student account?{' '}
            <Link to="/register" className="auth-link">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
