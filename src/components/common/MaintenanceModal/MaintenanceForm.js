// components/common/MaintenanceModal/MaintenanceForm.jsx
import React from 'react';
import { FormInput } from '../FormInput';

export function MaintenanceForm({ form, setForm, isPreselected, resolvedVehicle, initialData, isEditMode, isReadOnly, vehicleOptions }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {isPreselected ? (
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#FFD700' }}>Vehicle</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
            {resolvedVehicle?.plateNumber || initialData?.vehicle?.plateNumber}
          </div>
        </div>
      ) : (
        <FormInput
          label="Vehicle"
          value={form.vehicleId}
          onChange={v => setForm({...form, vehicleId: v})}
          required
          options={vehicleOptions}
          disabled={isReadOnly}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormInput 
          label="Start Date" 
          type="date" 
          value={form.startDate}
          onChange={v => setForm({...form, startDate: v})} 
          required 
          disabled={isReadOnly} 
        />
        <FormInput 
          label="End Date" 
          type="date" 
          value={form.endDate}
          onChange={v => setForm({...form, endDate: v})} 
          disabled={isReadOnly} 
        />
      </div>

      <FormInput 
        label="Maintenance Type" 
        value={form.maintenanceType}
        onChange={v => setForm({...form, maintenanceType: v})} 
        required 
        disabled={isReadOnly}
        options={[
          { value: 'OIL_CHANGE', label: <><i className="fas fa-tint" style={{ marginRight: 8 }} /> Oil Change</> },
          { value: 'ENGINE_REPAIR', label: <><i className="fas fa-car" style={{ marginRight: 8 }} /> Engine Repair</> },
          { value: 'BRAKE_REPAIR', label: <><i className="fas fa-stop-circle" style={{ marginRight: 8 }} /> Brake Repair</> },
          { value: 'TIRE_CHANGE', label: <><i className="fas fa-circle" style={{ marginRight: 8 }} /> Tire Change</> },
          { value: 'REGULAR_SERVICE', label: <><i className="fas fa-wrench" style={{ marginRight: 8 }} /> Regular Service</> },
          { value: 'OTHER', label: <><i className="fas fa-plus" style={{ marginRight: 8 }} /> Other</> }
        ]}
      />

      {isEditMode && !isReadOnly && (
        <FormInput label="Status" value={form.status}
          onChange={v => setForm({...form, status: v})} required
          options={[
            { value: 'SCHEDULED', label: 'Scheduled' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' }
          ]}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{ fontSize: 25, fontWeight: 700, color: '#ffffff81' }}>Description</label>
        <textarea
          placeholder="Enter maintenance details..."
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})}
          rows={3}
          disabled={isReadOnly}
          style={{ padding: '10px 12px', border: '1px solid rgba(255,255,255,0.15)',
                   borderRadius: 6, fontSize: 14, color: isReadOnly ? 'rgba(255,255,255,0.5)' : 'white',
                   background: isReadOnly ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                   width: '100%', fontFamily: 'inherit', cursor: isReadOnly ? 'not-allowed' : 'text' }}
        />
      </div>
    </div>
  );
}
