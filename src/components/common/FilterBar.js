import React from 'react';
import { FaSearch  } from "react-icons/fa";

export function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = " Search..."
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        background: 'var(--sidebar-bg)',
        padding: '12px 15px',
        borderRadius: '8px',
        backdropFilter: 'blur(5px)',
        border: '1px solid var(--icon-color)'
      }}
    >
      {/* FILTER BUTTONS */}
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          style={{
            padding: '6px 16px',
            border: `1px solid ${
              activeFilter === filter
                ? 'var(--icon-color)'
                : 'rgba(255,255,255,0.2)'
            }`,
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '15px',
            background:
              activeFilter === filter
                ? 'var(--icon-color)'
                : 'transparent',
            color:
              activeFilter === filter
                ? '#001342'
                : 'rgba(255,255,255,0.65)',
            fontWeight: activeFilter === filter ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== filter) {
              e.currentTarget.style.borderColor = 'var(--icon-color)';
              e.currentTarget.style.color = 'var(--icon-color)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== filter) {
              e.currentTarget.style.borderColor =
                'rgba(255,255,255,0.2)';
              e.currentTarget.style.color =
                'rgba(255,255,255,0.65)';
            }
          }}
        >
          {filter}
        </button>
      ))}

      {/* SEARCH BOX */}
      <div style={{ position: 'relative', marginLeft: 'auto' }}>
        {/* ICON */}
        <FaSearch 
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#001a5b',
            opacity: 0.8
          }}
        />

        {/* INPUT */}
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            color: '#001a5b',
            background: 'rgba(131, 128, 128, 0.35)',
            padding: '7px 15px 7px 35px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 252, 252, 0.6)',
            fontSize: '15px',
            width: '220px',
            outline: 'none'
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor =
              '#001a5b')
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor =
              'var(--icon-color)')
          }
        />
      </div>
      {/* ADD THIS STYLE TAG FOR PLACEHOLDER COLOR */}
      <style>
        {`
          input::placeholder {
            color: #ffffff !important;
            opacity: 0.7;
            font-weight: normal;
          }
        `}
      </style>
    </div>
  );
}