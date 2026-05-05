import React from 'react';

// Font Awesome CDN needs to be added to your index.html:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" />

const STATUS_COLORS = {
  ACTIVE: '#28a745',
  INACTIVE: '#6c757d',
  AVAILABLE: '#28a745',
  ASSIGNED: '#17a2b8',
  IN_MISSION: '#ffc107',
  IN_REVISION: '#fd7e14',
  BREAKDOWN: '#dc3545',
  REFORMED: '#6c757d',
  VALID: '#28a745',
  EXPIRED: '#dc3545',
  FAILED: '#fbbc04',
  PLANNED: '#fbbc04',
  SCHEDULED: '#ffc107',
  IN_PROGRESS: '#1a73e8',
  COMPLETED: '#28a745',
  CANCELLED: '#dc3545'
};

// Map status to icon classes
const STATUS_ICONS = {
  ACTIVE: 'fas fa-check-circle',
  INACTIVE: 'fas fa-circle',
  AVAILABLE: 'fas fa-check',
  ASSIGNED: 'fas fa-user-check',
  IN_MISSION: 'fas fa-rocket',
  IN_REVISION: 'fas fa-edit',
  BREAKDOWN: 'fas fa-wrench',
  REFORMED: 'fas fa-sync-alt',
  VALID: 'fas fa-check-double',
  EXPIRED: 'fas fa-hourglass-end',
  FAILED: 'fas fa-exclamation-triangle',
  PLANNED: 'fas fa-calendar-alt',
  SCHEDULED: 'fas fa-clock',
  IN_PROGRESS: 'fas fa-spinner fa-pulse',
  COMPLETED: 'fas fa-check-circle',
  CANCELLED: 'fas fa-ban',
  filled: 'fas fa-check',
};

export function Badge({ status, label }) {
  const color = STATUS_COLORS[status] || '#6c757d';
  const iconClass = STATUS_ICONS[status] || 'fas fa-tag';
  
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: `${color}22`,
      color: color
    }}>
      <i className={iconClass} style={{ fontSize: '10px' }}></i>
      {label || status}
    </span>
  );
}