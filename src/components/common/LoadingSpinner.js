import React from 'react';

export function LoadingSpinner({ size = '40px', color = '#FFD700' }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }}>
      <div style={{
        width: size,
        height: size,
        border: `3px solid ${color}33`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
      gap: '16px'
    }}>
      <LoadingSpinner size="48px" />
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Loading...</span>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(255,215,0,0.1)'
    }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          padding: '12px 0',
          borderBottom: i < rows - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
        }}>
          <div style={{
            width: '100%',
            height: '16px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
            backgroundSize: '200% 100%',
            borderRadius: '4px',
            animation: 'shimmer 1.5s infinite'
          }} />
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
