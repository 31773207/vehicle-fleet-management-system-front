// components/common/MaintenanceModal/PartsTab.jsx
import React from 'react';

const emptyPart = () => ({ partName: '', quantity: 1, unitCost: '', notes: '' });

const PART_PRESETS = [
  'Oil Filter', 'Air Filter', 'Brake Pads', 'Spark Plugs',
  'Timing Belt', 'Coolant', 'Battery', 'Tires', 'Wiper Blades', 'Other'
];
// Add this function to validate parts
export const validateParts = (parts) => {
  const errors = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p.partName?.trim()) {
      errors.push(`Part #${i+1}: Name is required`);
    }
    if (!p.quantity || parseInt(p.quantity) < 1) {
      errors.push(`Part #${i+1}: Quantity must be at least 1`);
    }
    if (!p.unitCost && p.unitCost !== 0) {
      errors.push(`Part #${i+1}: Unit cost is required`);
    }
    if (parseFloat(p.unitCost) < 0) {
      errors.push(`Part #${i+1}: Unit cost must be 0 or greater`);
    }
  }
  return errors;
};
export function PartsTab({ parts, onChange, readOnly = false }) {
  const addRow = () => !readOnly && onChange([...parts, emptyPart()]);
  const removeRow = (i) => !readOnly && onChange(parts.filter((_, idx) => idx !== i));
  const updateRow = (i, field, value) =>
    !readOnly && onChange(parts.map((p, idx) => idx === i ? { ...p, [field]: value } : p));

  const totalCost = parts.reduce((sum, p) => {
    const qty = parseInt(p.quantity) || 0;
    const cost = parseFloat(p.unitCost) || 0;
    return sum + qty * cost;
  }, 0);

  const inputStyle = (disabled) => ({
    padding: '8px 10px',
    border: `1px solid ${disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 6,
    fontSize: 15,
    color: disabled ? 'rgba(255,255,255,0.5)' : 'white',
    background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
    width: '100%',
    fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'text'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 110px 1fr 36px', gap: 6,
                    fontSize: 18, color: 'rgba(255,255,255,0.45)', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: 1 }}>
        <span>Part Name</span><span>Qty</span><span>Unit Cost (DZD)</span>
        <span>Notes</span><span></span>
      </div>

      {parts.map((p, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 110px 1fr 36px', gap: 6, alignItems: 'center' }}>
          {readOnly ? (
            <div style={inputStyle(true)}>{p.partName}</div>
          ) : (
            <>
              <input
                list={`part-presets-${i}`}
                value={p.partName}
                onChange={e => updateRow(i, 'partName', e.target.value)}
                placeholder="e.g. Oil Filter"
                required
                style={inputStyle(false)}
              />
              <datalist id={`part-presets-${i}`}>
                {PART_PRESETS.map(pr => <option key={pr} value={pr} />)}
              </datalist>
            </>
          )}

          {readOnly ? (
            <div style={inputStyle(true)}>{p.quantity}</div>
          ) : (
            <input
              type="number" min="1" value={p.quantity}
              onChange={e => updateRow(i, 'quantity', e.target.value)}
              style={inputStyle(false)}
            />
          )}

          {readOnly ? (
            <div style={inputStyle(true)}>{parseFloat(p.unitCost).toLocaleString('fr-DZ')}</div>
          ) : (
            <input
              type="number" min="0" step="0.01" value={p.unitCost}
              onChange={e => updateRow(i, 'unitCost', e.target.value)}
              placeholder="0.00"
              style={inputStyle(false)}
            />
          )}

          {readOnly ? (
            <div style={inputStyle(true)}>{p.notes || '-'}</div>
          ) : (
            <input
              value={p.notes}
              onChange={e => updateRow(i, 'notes', e.target.value)}
              placeholder="optional"
              style={inputStyle(false)}
            />
          )}

          {!readOnly && (
            <button type="button" onClick={() => removeRow(i)}
              style={{ background: 'rgba(220,53,69,0.15)', border: '1px solid rgba(220,53,69,0.4)',
                       borderRadius: 6, color: '#dc3545', cursor: 'pointer', width: 36, height: 36,
                       display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-trash" style={{ fontSize: 12 }} />
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <button type="button" onClick={addRow}
          style={{ alignSelf: 'flex-start', background: 'rgba(23,162,184,0.1)',
                   border: '1px dashed rgba(23,162,184,0.5)', borderRadius: 8,
                   color: '#17a2b8', cursor: 'pointer', padding: '8px 16px', fontSize: 13 }}>
          <i className="fas fa-plus" style={{ marginRight: 6 }} />Add Part
        </button>
      )}

      {parts.length > 0 && (
        <div style={{ marginTop: 4, padding: '10px 14px',
                      background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)',
                      borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Parts Total</span>
          <span style={{ color: '#FFD700', fontWeight: 700, fontSize: 15 }}>
            {totalCost.toLocaleString('fr-DZ')} DZD
          </span>
        </div>
      )}
    </div>
  );
}