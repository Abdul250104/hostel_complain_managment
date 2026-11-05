import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await complaintService.getMyComplaints();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load your complaints. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate counts required by prompt
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Recent 4 complaints
  const recentComplaints = complaints.slice(0, 4);

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Hello, {user?.name}! 👋</h2>
          <p>
            Track your hostel maintenance requests and submit new complaints anytime.
          </p>
        </div>
        <Link to="/submit-complaint" className="btn btn-primary">
          ➕ Submit New Complaint
        </Link>
      </div>

      {error && <div className="alert-box alert-error">{error}</div>}

      {/* Required Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper">📊</div>
          <div className="stat-info">
            <span className="stat-label">Total Complaints</span>
            <h3 className="stat-number">{loading ? '...' : totalCount}</h3>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon-wrapper">⏳</div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <h3 className="stat-number">{loading ? '...' : pendingCount}</h3>
          </div>
        </div>

        <div className="stat-card stat-progress">
          <div className="stat-icon-wrapper">⚙️</div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <h3 className="stat-number">{loading ? '...' : inProgressCount}</h3>
          </div>
        </div>

        <div className="stat-card stat-resolved">
          <div className="stat-icon-wrapper">✅</div>
          <div className="stat-info">
            <span className="stat-label">Resolved</span>
            <h3 className="stat-number">{loading ? '...' : resolvedCount}</h3>
          </div>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="card-box">
        <div className="section-header-row">
          <div>
            <h3 className="section-heading">Recent Complaints</h3>
            <p className="section-subtext">Quick glance at your latest submissions</p>
          </div>
          <Link to="/my-complaints" className="btn btn-outline-sm">
            View All ({totalCount}) →
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching complaints...</p>
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h4>No Complaints Submitted Yet</h4>
            <p>If you're facing any issue in your hostel room, feel free to report it.</p>
            <Link to="/submit-complaint" className="btn btn-primary btn-sm">
              Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Room No.</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong className="item-title">{item.title}</strong>
                    </td>
                    <td>
                      <span className="category-pill">{item.category}</span>
                    </td>
                    <td>{item.roomNumber || 'N/A'}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
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

export default StudentDashboard;
