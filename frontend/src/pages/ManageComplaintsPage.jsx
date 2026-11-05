import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const ManageComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter and Search states
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Detail Modal state
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Status updating state
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await complaintService.getAllComplaints();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error('Error fetching admin complaints:', err);
      setError('Failed to fetch complaints list');
    } finally {
      setLoading(false);
    }
  };

  // Status change handler
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      setUpdatingId(complaintId);
      const res = await complaintService.updateComplaintStatus(complaintId, newStatus);
      
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? { ...c, status: newStatus } : c))
      );

      // If open in modal, update that as well
      if (selectedComplaint && selectedComplaint._id === complaintId) {
        setSelectedComplaint((prev) => ({ ...prev, status: newStatus }));
      }

      setSuccessMsg(`Status updated to "${newStatus}" successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Status update failed:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete complaint handler (Admin can delete inappropriate complaints)
  const handleDelete = async (complaint) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the complaint: "${complaint.title}" submitted by ${
        complaint.studentId?.name || 'Student'
      }?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(complaint._id);
      await complaintService.deleteComplaint(complaint._id);
      setComplaints((prev) => prev.filter((c) => c._id !== complaint._id));
      if (selectedComplaint && selectedComplaint._id === complaint._id) {
        setSelectedComplaint(null);
      }
      setSuccessMsg('Complaint deleted by admin.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete complaint');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    const studentName = item.studentId?.name?.toLowerCase() || '';
    const studentEmail = item.studentId?.email?.toLowerCase() || '';
    const title = item.title?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      studentName.includes(search) ||
      studentEmail.includes(search) ||
      title.includes(search);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2 className="page-main-heading">Manage Student Complaints</h2>
          <p className="page-subheading">
            Review complaints, examine student details, change status, and take action
          </p>
        </div>
        <button onClick={fetchComplaints} className="btn btn-outline-sm" title="Refresh list">
          🔄 Refresh
        </button>
      </div>

      {error && <div className="alert-box alert-error">{error}</div>}
      {successMsg && <div className="alert-box alert-success">{successMsg}</div>}

      {/* Filter and Search Bar */}
      <div className="card-box filter-bar-card">
        <div className="filter-controls-grid">
          <div className="filter-group">
            <label htmlFor="search-input">Search Complaints / Students</label>
            <input
              id="search-input"
              type="text"
              className="form-input"
              placeholder="Search by student name, email, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Filter by Status</label>
            <select
              id="status-filter"
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses ({complaints.length})</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="cat-filter">Filter by Category</label>
            <select
              id="cat-filter"
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Wi-Fi">Wi-Fi</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="card-box">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading complaints list...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h4>No Matching Complaints Found</h4>
            <p>Try resetting filters or changing the search keyword.</p>
            <button
              onClick={() => {
                setStatusFilter('All');
                setCategoryFilter('All');
                setSearchTerm('');
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Title & Category</th>
                  <th>Room</th>
                  <th>Date</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="student-profile-cell">
                        <strong>{item.studentId?.name || 'Unknown'}</strong>
                        <span className="student-email-sub">{item.studentId?.email || 'N/A'}</span>
                      </div>
                    </td>

                    <td>
                      <div className="complaint-title-cell">
                        <strong className="item-title">{item.title}</strong>
                        <span className="category-pill">{item.category}</span>
                      </div>
                    </td>

                    <td>{item.roomNumber || '—'}</td>

                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                    <td>
                      <StatusBadge status={item.status} />
                    </td>

                    <td>
                      <select
                        className="status-dropdown"
                        value={item.status}
                        disabled={updatingId === item._id}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td>
                      <div className="action-buttons-group">
                        <button
                          onClick={() => setSelectedComplaint(item)}
                          className="btn btn-outline-sm"
                          title="View complete details"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="btn btn-danger-sm"
                          title="Delete invalid/inappropriate complaint"
                          disabled={deletingId === item._id}
                        >
                          {deletingId === item._id ? '...' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedComplaint && (
        <div className="modal-backdrop" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Complaint Details</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedComplaint(null)}
                aria-label="Close Modal"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-field-group">
                <span className="modal-label">Title</span>
                <h4 className="modal-value-title">{selectedComplaint.title}</h4>
              </div>

              <div className="modal-grid-2">
                <div className="modal-field-group">
                  <span className="modal-label">Category</span>
                  <span className="category-pill">{selectedComplaint.category}</span>
                </div>
                <div className="modal-field-group">
                  <span className="modal-label">Status</span>
                  <StatusBadge status={selectedComplaint.status} />
                </div>
              </div>

              <div className="modal-grid-2">
                <div className="modal-field-group">
                  <span className="modal-label">Student Name</span>
                  <p className="modal-text-bold">
                    {selectedComplaint.studentId?.name || 'N/A'}
                  </p>
                </div>
                <div className="modal-field-group">
                  <span className="modal-label">Student Email</span>
                  <p className="modal-text-value">
                    {selectedComplaint.studentId?.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="modal-grid-2">
                <div className="modal-field-group">
                  <span className="modal-label">Room / Location</span>
                  <p className="modal-text-value">{selectedComplaint.roomNumber || 'Not specified'}</p>
                </div>
                <div className="modal-field-group">
                  <span className="modal-label">Submission Date</span>
                  <p className="modal-text-value">
                    {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="modal-field-group">
                <span className="modal-label">Complaint Description</span>
                <div className="modal-desc-box">
                  {selectedComplaint.description}
                </div>
              </div>

              <div className="modal-status-update-box">
                <span className="modal-label">Change Status Directly:</span>
                <div className="status-buttons-row">
                  {['Pending', 'In Progress', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      className={`btn btn-sm ${
                        selectedComplaint.status === st
                          ? 'btn-primary'
                          : 'btn-outline-sm'
                      }`}
                      onClick={() => handleStatusChange(selectedComplaint._id, st)}
                      disabled={updatingId === selectedComplaint._id}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedComplaint(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageComplaintsPage;
