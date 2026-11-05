import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await complaintService.getAllComplaints();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error('Error fetching admin complaints:', err);
      setError('Failed to load complaints from server');
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  // Category counts
  const categories = ['Electricity', 'Water', 'Cleaning', 'Wi-Fi', 'Other'];
  const categoryStats = categories.map((cat) => ({
    name: cat,
    count: complaints.filter((c) => c.category === cat).length,
  }));

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Warden Header Banner */}
      <div className="welcome-banner warden-banner">
        <div className="welcome-text">
          <h2>Hostel Warden Portal 🛡️</h2>
          <p>
            Welcome, <strong>{user?.name}</strong>. Here is the operational overview of all hostel complaints.
          </p>
        </div>
        <Link to="/admin/complaints" className="btn btn-primary">
          📋 Manage Complaints ({total})
        </Link>
      </div>

      {error && <div className="alert-box alert-error">{error}</div>}

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper">📦</div>
          <div className="stat-info">
            <span className="stat-label">Total Complaints</span>
            <h3 className="stat-number">{loading ? '...' : total}</h3>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon-wrapper">⏳</div>
          <div className="stat-info">
            <span className="stat-label">Pending Action</span>
            <h3 className="stat-number">{loading ? '...' : pending}</h3>
          </div>
        </div>

        <div className="stat-card stat-progress">
          <div className="stat-icon-wrapper">⚙️</div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <h3 className="stat-number">{loading ? '...' : inProgress}</h3>
          </div>
        </div>

        <div className="stat-card stat-resolved">
          <div className="stat-icon-wrapper">✅</div>
          <div className="stat-info">
            <span className="stat-label">Resolved</span>
            <h3 className="stat-number">{loading ? '...' : resolved}</h3>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Quick Info */}
      <div className="card-box" style={{ marginBottom: '24px' }}>
        <h3 className="section-heading">Complaints by Category</h3>
        <p className="section-subtext">Department-wise distribution of issues</p>
        
        <div className="category-stats-grid">
          {categoryStats.map((item) => (
            <div key={item.name} className="cat-stat-badge">
              <span className="cat-name">{item.name}</span>
              <span className="cat-count-pill">{loading ? '...' : item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="card-box">
        <div className="section-header-row">
          <div>
            <h3 className="section-heading">Latest Submitted Complaints</h3>
            <p className="section-subtext">Review recent grievances from hostel students</p>
          </div>
          <Link to="/admin/complaints" className="btn btn-outline-sm">
            Manage All Complaints →
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching complaints...</p>
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎉</span>
            <h4>No Complaints Submitted Yet</h4>
            <p>Hostel currently has no active complaints from students.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student Email</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Room</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.studentId?.name || 'Unknown Student'}</strong>
                    </td>
                    <td>
                      <span className="text-muted">{item.studentId?.email || 'N/A'}</span>
                    </td>
                    <td>{item.title}</td>
                    <td>
                      <span className="category-pill">{item.category}</span>
                    </td>
                    <td>{item.roomNumber || 'N/A'}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
