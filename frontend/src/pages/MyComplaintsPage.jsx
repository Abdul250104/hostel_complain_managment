import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await complaintService.getMyComplaints();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load your complaints list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (complaint) => {
    // Check if status is Pending
    if (complaint.status !== 'Pending') {
      alert('Only complaints with "Pending" status can be deleted.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete complaint: "${complaint.title}"?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(complaint._id);
      await complaintService.deleteComplaint(complaint._id);
      setSuccessMsg('Complaint deleted successfully.');
      setComplaints((prev) => prev.filter((item) => item._id !== complaint._id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      alert(
        err.response?.data?.message || 'Failed to delete complaint. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Filter complaints based on status
  const filteredComplaints = complaints.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2 className="page-main-heading">My Submitted Complaints</h2>
          <p className="page-subheading">
            Track status and manage your hostel maintenance requests
          </p>
        </div>
        <Link to="/submit-complaint" className="btn btn-primary">
          ➕ New Complaint
        </Link>
      </div>

      {error && <div className="alert-box alert-error">{error}</div>}
      {successMsg && <div className="alert-box alert-success">{successMsg}</div>}

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
          <button
            key={tab}
            className={`filter-tab-btn ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}{' '}
            <span className="filter-badge">
              {tab === 'All'
                ? complaints.length
                : complaints.filter((c) => c.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="empty-state card-box">
          <span className="empty-icon">📂</span>
          <h4>No Complaints Found</h4>
          <p>
            {activeFilter === 'All'
              ? 'You have not submitted any complaints yet.'
              : `No complaints found with status "${activeFilter}".`}
          </p>
          <Link to="/submit-complaint" className="btn btn-primary btn-sm">
            Lodge a Complaint
          </Link>
        </div>
      ) : (
        <div className="complaints-cards-grid">
          {filteredComplaints.map((item) => (
            <div key={item._id} className="complaint-card">
              <div className="complaint-card-header">
                <span className="category-tag">{item.category}</span>
                <StatusBadge status={item.status} />
              </div>

              <h3 className="complaint-card-title">{item.title}</h3>
              <p className="complaint-card-desc">{item.description}</p>

              <div className="complaint-card-meta">
                {item.roomNumber && (
                  <span className="meta-item">
                    📍 <strong>Room:</strong> {item.roomNumber}
                  </span>
                )}
                <span className="meta-item">
                  📅 <strong>Filed:</strong>{' '}
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="complaint-card-actions">
                {item.status === 'Pending' ? (
                  <button
                    onClick={() => handleDelete(item)}
                    className="btn btn-danger-sm"
                    disabled={deletingId === item._id}
                  >
                    {deletingId === item._id ? 'Deleting...' : '🗑️ Delete Complaint'}
                  </button>
                ) : (
                  <div className="non-deletable-note">
                    🔒 Deletion locked ({item.status})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaintsPage;
