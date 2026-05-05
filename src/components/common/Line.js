import React from 'react';

export function Line({ width = '600px', color = '#93aad2', margin = '22px' }) {
  return (
    <div
      style={{
         width: '600px',   // line width
    height: '1px',    // thickness
    background: '#93aad2',
    margin: '0 auto', // center horizontally
    borderRadius: '20px',
    marginBottom: '22px' // ✅ add comma above
    
      }}
    />
  );
}