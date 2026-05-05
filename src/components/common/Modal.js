import React from 'react';
import './scrollbar.css';

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const widths = { sm: '400px', md: '560px', lg: '700px' };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      {/* MODAL BOX */}
      <div
        className="modal-scroll"
        style={{
          background: '#0d1a30',
          padding: '30px',
          borderRadius: '16px',
          width: widths[size],
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '3px solid rgba(0, 17, 255, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '18px',
            top: '18px',
            background: 'transparent',
            border: 'none',
            fontSize: '25px',
            color: '#dc3545',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {/* TITLE */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{
            fontFamily: "'Rajdhani', sans-serif",
            color: 'white',
            fontSize: '50px',
            fontWeight: 'bold',
            textShadow: '0 3px 8px rgb(0, 0, 0)',
            marginBottom: '15px'
          }}>
            {title}
          </h3>
        </div>

        {children}
      </div>
    </div>
  );
}