import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.componentStack = '';
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.componentStack = errorInfo.componentStack || 'No component stack available';
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
          gap: '20px'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '64px', color: '#dc3545' }}></i>
          <h2 style={{ color: 'white', fontSize: '24px', margin: 0 }}>Something went wrong</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '500px', lineHeight: '1.6' }}>
            An unexpected error occurred. The development team has been notified.
            Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px',
              background: '#FFD700',
              color: '#001838',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
          >
            <i className="fas fa-redo"></i> Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '8px',
              color: '#ff6b6b',
              fontSize: '12px',
              maxWidth: '600px',
              height: '300px',
              overflow: 'auto',
              textAlign: 'left',
              whiteSpace: 'pre-wrap'
            }}>
              {JSON.stringify({
                message: this.state.error?.message || 'Unknown error',
                stack: this.state.error?.stack?.split('\n').slice(0,10).join('\n'),
                componentStack: this.componentStack.split('\n').slice(0,10).join('\n')
              }, null, 2)}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

