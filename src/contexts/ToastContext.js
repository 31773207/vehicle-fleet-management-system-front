import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px'
      }}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  const colors = {
    success: { bg: '#28a745', icon: 'fa-check-circle' },
    error: { bg: '#dc3545', icon: 'fa-times-circle' },
    warning: { bg: '#fd7e14', icon: 'fa-exclamation-triangle' },
    info: { bg: '#17a2b8', icon: 'fa-info-circle' }
  };
  const theme = colors[toast.type] || colors.info;

  return (
    <div style={{
      background: 'rgba(4, 12, 32, 0.95)',
      backdropFilter: 'blur(10px)',
      borderLeft: `4px solid ${theme.bg}`,
      borderRadius: '8px',
      padding: '14px 18px',
      color: 'white',
      fontSize: '14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideIn 0.3s ease, fadeOut 0.3s ease 3.7s',
      animationFillMode: 'forwards',
      cursor: 'pointer'
    }}
    onClick={() => onRemove(toast.id)}
    >
      <i className={`fas ${theme.icon}`} style={{ color: theme.bg, fontSize: '18px' }}></i>
      <span style={{ flex: 1, lineHeight: '1.4' }}>{toast.message}</span>
      <i className="fas fa-times" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}></i>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
