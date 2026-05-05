// components/common/MaintenanceModal.jsx
import React, { useState, useEffect, useMemo } from 'react';  // ✅ Add useMemo
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import api from '../../services/api';

export function MaintenanceModal({ isOpen, onClose, onSuccess, vehicle, initialData, vehicles = [] }) {
  const [form, setForm] = useState({
    maintenanceType: '',
    startDate: new Date().toISOString().split('T')[0],
    cost: '',
    description: '',
    status: 'SCHEDULED',
    endDate: ''
  });

  
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // ✅ Resolve vehicle object (could be object or just ID)
 const resolvedVehicle = useMemo(() => {
  // If vehicle is full object with plateNumber
  if (vehicle && typeof vehicle === 'object' && vehicle.plateNumber) {
    return vehicle;
  }
  // If vehicle is object with only id
  if (vehicle && typeof vehicle === 'object' && vehicle.id && !vehicle.plateNumber) {
    return { id: vehicle.id, plateNumber: `Vehicle #${vehicle.id}` };
  }
  // If vehicle is just a number
  if (vehicle && typeof vehicle === 'number') {
    return { id: vehicle, plateNumber: `Vehicle #${vehicle}` };
  }
  return null;
}, [vehicle]);

  useEffect(() => {
    if (initialData) {
      setForm({
        maintenanceType: initialData.maintenanceType || '',
        startDate: initialData.startDate || new Date().toISOString().split('T')[0],
        cost: initialData.cost || '',
        description: initialData.description || '',
        status: initialData.status || 'SCHEDULED',
        endDate: initialData.endDate || ''
      });
      setSelectedVehicleId(initialData.vehicle?.id || '');
    } else if (resolvedVehicle) {
      setForm({
        maintenanceType: '',
        startDate: new Date().toISOString().split('T')[0],
        cost: '',
        description: '',
        status: 'SCHEDULED',
        endDate: ''
      });
      setSelectedVehicleId(resolvedVehicle.id);
    } else {
      setForm({
        maintenanceType: '',
        startDate: new Date().toISOString().split('T')[0],
        cost: '',
        description: '',
        status: 'SCHEDULED',
        endDate: ''
      });
      setSelectedVehicleId('');
    }
  }, [resolvedVehicle, initialData, isOpen]);

  const vehicleOptions = [
    { value: '', label: 'Select Vehicle' },
    ...vehicles.map(v => ({ value: v.id, label: `${v.plateNumber} - ${v.model}` }))
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use resolvedVehicle
      const vehicleId = resolvedVehicle?.id || initialData?.vehicle?.id || selectedVehicleId;

      if (!vehicleId) {
        alert('Please select a vehicle!');
        return;
      }

      const costValue = parseFloat(form.cost);
      if (!form.cost || isNaN(costValue) || costValue <= 0) {
        alert('Cost must be a positive number greater than 0!');
        return;
      }

      const payload = {
        vehicle: { id: parseInt(vehicleId) },
        maintenanceType: form.maintenanceType,
        startDate: form.startDate,
        endDate: form.endDate || null,
        cost: costValue,
        description: form.description,
        status: initialData?.id ? form.status : 'SCHEDULED'
      };

      console.log('Sending payload:', JSON.stringify(payload));

      let response;
      if (initialData?.id) {
        response = await api.put(`/maintenance/${initialData.id}`, payload);
      } else {
        response = await api.post('/maintenance', payload);
      }

      if (response.data) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      const msg = error.response?.data?.message
        || error.response?.data?.error
        || JSON.stringify(error.response?.data)
        || 'Error saving maintenance!';
      console.error('Backend error:', error.response?.status, error.response?.data);
      alert(msg);
    }
  };

  const isPreselected = !!resolvedVehicle || !!initialData?.vehicle;
  const isEditMode = !!initialData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Maintenance' : 'Send to Maintenance'} size="lg">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Vehicle Field - ✅ Use resolvedVehicle for display */}
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
              value={selectedVehicleId}
              onChange={(v) => setSelectedVehicleId(v)}
              required
              options={vehicleOptions}
            />
          )}
          
          {/* rest of your form... */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormInput
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(v) => setForm({...form, startDate: v})}
              required
            />
            <FormInput
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(v) => setForm({...form, endDate: v})}
            />
          </div>

          <FormInput
            label="Maintenance Type"
            value={form.maintenanceType}
            onChange={(v) => setForm({...form, maintenanceType: v})}
            required
            options={[
              { value: 'Oil Change', label: 'Oil Change' },
              { value: 'Engine Repair', label: 'Engine Repair' },
              { value: 'Brake Repair', label: 'Brake Repair' },
              { value: 'Tire Change', label: 'Tire Change' },
              { value: 'Regular Service', label: 'Regular Service' },
              { value: 'Other', label: 'Other' }
            ]}
          />
          
          <FormInput
            label="Cost (DZD)"
            type="number"
            placeholder="0.00"
            value={form.cost}
            onChange={(v) => setForm({...form, cost: v})}
            required
          />
          
          {isEditMode && (
            <FormInput
              label="Status"
              value={form.status}
              onChange={(v) => setForm({...form, status: v})}
              required
              options={[
                { value: 'SCHEDULED', label: 'Scheduled' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' }
              ]}
            />
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '16px', fontWeight: '700', color: '#FFD700' }}>Description</label>
            <textarea
              placeholder="Enter maintenance details..."
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={3}
              style={{
                padding: '10px 12px',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                fontSize: '14px',
                color: 'white',
                background: 'rgba(255,255,255,0.06)',
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {form.status === 'COMPLETED' && (
            <div style={{ background: 'rgba(40,167,69,0.1)', border: '1px solid rgba(40,167,69,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#28a745' }}>
              <i className="fas fa-info-circle"></i> When you mark as COMPLETED, the vehicle will automatically become AVAILABLE.
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '12px' }}>
                        <CancelButton onClick={onClose}>Cancel</CancelButton>
<SaveButton type="submit">Save</SaveButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}