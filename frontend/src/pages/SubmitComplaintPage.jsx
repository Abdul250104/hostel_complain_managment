import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../services/api';

const CATEGORIES = ['Electricity', 'Water', 'Cleaning', 'Wi-Fi', 'Other'];

const SubmitComplaintPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electricity',
    roomNumber: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setError('Please provide a complaint title');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a detailed description of the complaint');
      return;
    }

    try {
      setSubmitting(true);
      const res = await complaintService.createComplaint({
        title: formData.title.trim(),
        category: formData.category,
        roomNumber: formData.roomNumber.trim(),
        description: formData.description.trim(),
      });

      setSuccessMsg('Complaint submitted successfully! Redirecting...');
      setTimeout(() => {
        navigate('/my-complaints');
      }, 1200);
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError(
        err.response?.data?.message || 'Failed to submit complaint. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container-narrow">
      <div className="card-box form-card">
        <div className="card-box-header">
          <div className="form-header-icon">✍️</div>
          <div>
            <h2 className="card-box-title">Lodge a Hostel Complaint</h2>
            <p className="card-box-subtitle">
              Fill out the details below. Our warden will review and assign staff to resolve it.
            </p>
          </div>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}
        {successMsg && <div className="alert-box alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="complaint-category">
              Complaint Category <span className="required-star">*</span>
            </label>
            <select
              id="complaint-category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <small className="form-hint">
              Select the primary department handling your grievance.
            </small>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="complaint-title">
                Complaint Title <span className="required-star">*</span>
              </label>
              <input
                id="complaint-title"
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Bathroom tap leaking or Wi-Fi not connecting"
                value={formData.title}
                onChange={handleChange}
                maxLength={120}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="complaint-room">Room / Location Number</label>
              <input
                id="complaint-room"
                type="text"
                name="roomNumber"
                className="form-input"
                placeholder="e.g. Room 204 or Block B-2"
                value={formData.roomNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="complaint-desc">
              Detailed Description <span className="required-star">*</span>
            </label>
            <textarea
              id="complaint-desc"
              name="description"
              rows="5"
              className="form-textarea"
              placeholder="Describe the issue clearly (when it started, what happens, etc.)..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting Complaint...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaintPage;
