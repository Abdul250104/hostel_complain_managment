import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'In Progress':
        return 'badge-in-progress';
      case 'Resolved':
        return 'badge-resolved';
      default:
        return 'badge-default';
    }
  };

  const getIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'In Progress':
        return '⚙️';
      case 'Resolved':
        return '✅';
      default:
        return '•';
    }
  };

  return (
    <span className={`status-badge ${getBadgeClass(status)}`}>
      <span className="badge-icon">{getIcon(status)}</span>
      <span>{status || 'Unknown'}</span>
    </span>
  );
};

export default StatusBadge;
