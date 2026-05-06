import React from 'react';

export function DataTable({ columns, data, emptyMessage = "No data found" }) {
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'var(--tab)',
        borderRadius: '12px',
        marginTop: '20px'
      }}>
        <i className="fas fa-database" style={{ fontSize: '40px', display: 'block', marginBottom: '12px', opacity: 0.3 }}></i>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>{emptyMessage}</p>
      </div>
    );
  }

  // Render table with data
  return (
    <div style={{
background: 'var(--tab)',  // Darker, less transparency

      borderRadius: '12px',
      overflowX: 'auto',
      backdropFilter: 'blur(0.5px)',
      border: '1px solid #374151',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      {/* Table header and body */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '100%'
      }}>
        <thead>
          <tr style={{
            background: '#010823d2',
            borderBottom: '1px solid #005eff',
          }}>
            {columns.map(col => (
              <th key={col.key} style={{
                padding: '14px 16px',
                textAlign: 'left',
                color: '#7facf9',
                fontSize: '16px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} style={{
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map(col => (
                <td key={col.key} style={{
                  padding: '14px 16px',
                  color: 'white',
                  fontSize: '16px',
                  verticalAlign: 'middle'
                }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
