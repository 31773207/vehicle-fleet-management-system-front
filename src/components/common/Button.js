import React from 'react';

// Generic Button with variant support
export default function Button({ children, onClick, type = 'button', disabled = false, variant = 'primary', style = {}, ...props }) {
  const variants = {
    primary: { backgroundColor: '#001345', color: 'white', border: 'none' },
    success: { backgroundColor: '#28a745', color: 'white', border: '1px solid #28a745' },
    danger: { backgroundColor: '#dc3545', color: 'white', border: 'none' },
    warning: { backgroundColor: '#fd7e14', color: 'white', border: 'none' },
    info: { backgroundColor: '#17a2b8', color: 'white', border: 'none' },
    secondary: { backgroundColor: '#6c757d', color: 'white', border: 'none' },
    outline: { backgroundColor: 'transparent', color: '#dc3545', border: '1px solid #dc3545' }
  };

  const hoverStyles = {
    primary: { backgroundColor: '#07101c', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0, 19, 69, 0.3)' },
    success: { backgroundColor: '#218838', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)' },
    warning: { backgroundColor: '#e56b0a', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(253, 126, 20, 0.3)' },
    info: { backgroundColor: '#138496', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(23, 162, 184, 0.3)' },
    secondary: { backgroundColor: '#545b62', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(108, 117, 125, 0.3)' },
    outline: { backgroundColor: 'rgba(220, 53, 69, 0.15)', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)' }
  };

  const baseStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.6 : 1,
    ...variants[variant],
    ...style
  };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    const hover = hoverStyles[variant];
    if (hover) {
      Object.assign(e.currentTarget.style, hover);
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    const base = variants[variant];
    if (base) {
      Object.assign(e.currentTarget.style, {
        backgroundColor: base.backgroundColor,
        transform: 'translateY(0)',
        boxShadow: 'none'
      });
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}

// Save Button (Green)
export function SaveButton({ children, onClick, type = 'submit', disabled = false, title = "Save" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
            title={title}  // ✅ ADD THIS LINE

      style={{
        flex: 1,
        padding: '14px',
        backgroundColor: '#28a745',
        color: 'white',
        border: '1px solid #28a745',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        fontSize: '15px',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.6 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#21883721';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#28a745';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {children || <><i className="fas fa-save"></i> Save</>}
    </button>
  );
}

// Cancel Button (Red border)
export function CancelButton({ children, onClick, type = 'button', title = "Cancel" }) {
  return (
    <button
      type={type}
      onClick={onClick}
            title={title}  // ✅ ADD THIS LINE

      style={{
        flex: 1,
        padding: '14px',
        backgroundColor: 'transparent',
        color: '#dc3545',
        border: '1px solid #dc3545',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '15px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(220, 53, 70, 0.429)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children || <><i className="fas fa-times"></i> Cancel</>}
    </button>
  );
}

// Add Button (Primary)
export function AddButton({ children, onClick,title = "Add" }) {
  return (
    <button
      onClick={onClick}
            title={title}  // ✅ ADD THIS LINE
      style={{
        padding: '14px 28px',
        backgroundColor: '#001345',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#07101c';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#001345';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </button>
  );
}

// Edit Button (Yellow/Gold)
export function EditButton({ onClick, title = "Edit" }) {
  return (
    <button
      onClick={onClick}
            title={title}  // ✅ ADD THIS LINE
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#FFD700',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-edit"></i>
    </button>
  );
}

// Delete Button (Red) - NO confirmation inside button
export function DeleteButton({ onClick, itemName, title = "Delete" }) {
  return (
    <button
      onClick={onClick}  // Just call onClick directly, no confirmation here
            title={title}  // ✅ ADD THIS LINE
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#dc3545',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-trash"></i>
    </button>
  );
  
}
// Complete Button (Green check icon)
export function CompleteButton({ onClick, title = "Complete" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#28a745',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(40, 167, 69, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-check"></i>
    </button>
  );
}

// Cancel Button (Red X icon)
export function CancelIconButton({ onClick, title = "Cancel" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#dc3545',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-times"></i>
    </button>
  );
}

// Start Button (Green Play icon)
export function StartButton({ onClick, title = "Start" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#28a745',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(40, 167, 69, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-play"></i>
    </button>
  );
}
// Maintenance Button (Blue Wrench icon)
export function MaintButton({ onClick, title = "Send to Maintenance" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#17a2b8',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(23, 162, 184, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-wrench"></i>
    </button>
  );
}

// Break Button (Orange Warning icon)
export function BreakButton({ onClick, title = "Report Breakdown" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#fd7e14',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(253, 126, 20, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-exclamation-triangle"></i>
    </button>
  );
}

// Reform Button (Gray Ban icon)
export function ReformButton({ onClick, title = "Reform Vehicle" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#6c757d',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(108, 117, 125, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-ban"></i>
    </button>
  );
}

// Available Button (Green Check icon)
export function AvailableButton({ onClick, title = "Mark Available" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#28a745',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(40, 167, 69, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-check"></i>
    </button>
  );
}
// Start Work Button (Blue Play icon)
export function StartWorkButton({ onClick, title = "Start Work" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#17a2b8',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(23, 162, 184, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-play"></i>
    </button>
  );
}

// Complete Work Button (Green Flag icon)
export function CompleteWorkButton({ onClick, title = "Mark Complete" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#28a745',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(40, 167, 69, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-flag-checkered"></i>
    </button>
  );
}
// Activate Button (Green Check icon)
export function ActivateButton({ onClick, title = "Activate User" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#28a745',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(40, 167, 69, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-check-circle"></i>
    </button>
  );
}

// Deactivate Button (Red X icon)
export function DeactivateButton({ onClick, title = "Deactivate User" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#dc3545',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-ban"></i>
    </button>
  );
}
// Assign Button (Blue User Plus icon)
export function AssignButton({ onClick, title = "Assign Coupons" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#17a2b8',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(23, 162, 184, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-user-plus"></i>
    </button>
  );
}

// Transfer Button (Orange Exchange Alt icon)
export function TransferButton({ onClick, title = "Transfer Coupons" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#fd7e14',
        padding: '5px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(253, 126, 20, 0.2)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="fas fa-exchange-alt"></i>
    </button>
  );
}