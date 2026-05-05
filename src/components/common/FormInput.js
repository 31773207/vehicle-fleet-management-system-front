import React from 'react';

export function FormInput({ label, name, value, onChange, type = 'text', placeholder, required = false, options = null }) {
  const inputStyle = {
    padding: '10px 12px',
    border: '2px solid rgba(255,255,255,0.15)',
    borderRadius: '6px',
    fontSize: '14px',
    color: 'white',
    background: 'rgba(255,255,255,0.06)',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s'
  };

  const handleFocus = (e) => e.currentTarget.style.borderColor = '#3171fd';
  const handleBlur = (e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{
        fontSize: '18px',
        fontWeight: '650',
        color: '#ffffff',
        letterSpacing: '0.8px'
      }}>
        {label} {required && <span style={{ color: '#dc3545' }}>*</span>}
      </label>
      
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} style={{ background: '#0d1a30' }}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
        />
      )}
    </div>
  );
}