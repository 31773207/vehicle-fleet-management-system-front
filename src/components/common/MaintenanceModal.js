// components/common/MaintenanceModal/MaintenanceModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Line } from './Line';

export function MaintenanceModal({ isOpen, onClose, onSuccess, vehicle, initialData, vehicles = [] }) {
  const [form, setForm] = useState({
    vehicleId: '',
    maintenanceType: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    cost: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const resolvedVehicle = useMemo(() => {
    if (!vehicle) return null;
    if (typeof vehicle === 'object' && vehicle.plateNumber) return vehicle;
    if (typeof vehicle === 'object' && vehicle.id)
      return { id: vehicle.id, plateNumber: `Vehicle #${vehicle.id}` };
    if (typeof vehicle === 'number')
      return { id: vehicle, plateNumber: `Vehicle #${vehicle}` };
    return null;
  }, [vehicle]);

  const isPreselected = !!resolvedVehicle || !!initialData?.vehicle;
  const isEditMode = !!initialData?.id;
  const isReadOnly = initialData?.status === 'COMPLETED';

  // Load data when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        vehicleId: initialData.vehicle?.id || '',
        maintenanceType: initialData.maintenanceType || '',
        startDate: initialData.startDate || new Date().toISOString().split('T')[0],
        endDate: initialData.endDate || '',
        cost: initialData.cost || '',
        description: initialData.description || '',
      });
    } else if (resolvedVehicle) {
      setForm({ ...form, vehicleId: resolvedVehicle.id });
    }
  }, [initialData, resolvedVehicle]);

  const vehicleOptions = vehicles.map(v => ({ 
    value: v.id, 
    label: `${v.plateNumber} - ${v.model}` 
  }));

  const validate = () => {
    if (isReadOnly) return true;
    
    const vehicleId = resolvedVehicle?.id || initialData?.vehicle?.id || form.vehicleId;
    if (!vehicleId) { 
      addToast('⚠️ Please select a vehicle!', 'error');
      return false; 
    }
    
    if (!form.maintenanceType?.trim()) { 
      addToast('⚠️ Please enter maintenance type!', 'error');
      return false; 
    }
    
    if (!form.startDate) { 
      addToast('⚠️ Please select start date!', 'error');
      return false; 
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) { onClose(); return; }
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const vehicleId = resolvedVehicle?.id || initialData?.vehicle?.id || form.vehicleId;
      
      const payload = {
        vehicle: { id: parseInt(vehicleId) },
        maintenanceType: form.maintenanceType.trim(),
        startDate: form.startDate,
        endDate: form.endDate || null,
        cost: parseFloat(form.cost) || 0,
        description: form.description,
        status: isEditMode ? initialData.status : 'SCHEDULED',
      };

      if (isEditMode) {
        await api.put(`/maintenance/${initialData.id}`, payload);
        addToast('✅ Maintenance updated!', 'success');
      } else {
        await api.post('/maintenance', payload);
        addToast('✅ Maintenance created!', 'success');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      addToast('❌ Error saving maintenance!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}  
    
           title={isReadOnly ? 'Maintenance Details' : (isEditMode ? 'Edit Maintenance' : 'New Maintenance')}
           size="md">       
           <div
      style={{
         width: '450px',   // line width
    height: '1px',    // thickness
    background: '#93aad2',
    margin: '0 auto', // center horizontally
    borderRadius: '20px',
    marginBottom: '22px' 
    
      }}
    />
           
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Vehicle */}
          {isPreselected ? (
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '12px 15px', 
              borderRadius: '8px',
              borderLeft: '3px solid #FFD700'
            }}>
              <div style={{ fontSize: '12px', color: '#FFD700', marginBottom: 5 }}>Vehicle</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
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

          {/* Maintenance Type - Dropdown + Custom */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '18px', fontWeight: '650', color: '#ffffff' }}>
              Maintenance Type *
            </label>
            <input
              list="maintenance-types"
              value={form.maintenanceType}
              onChange={e => setForm({...form, maintenanceType: e.target.value})}
              placeholder="Select or type custom maintenance"
              required
              disabled={isReadOnly}
              style={{
                padding: '10px 12px',
                border: '2px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                fontSize: '14px',
                color: 'white',
                background: 'rgba(255,255,255,0.06)',
                outline: 'none',
                width: '100%'
              }}
            />
            <datalist id="maintenance-types">
              <option value=" Oil Change" />
              <option value=" Brake Repair" />
              <option value=" Tire Change" />
              <option value=" Engine Repair" />
              <option value=" Regular Service" />
              <option value=" Battery Replacement" />
              <option value=" AC Service" />
              <option value=" Transmission Service" />
              <option value=" Fuel Filter Change" />
              <option value=" Air Filter Change" />
              <option value=" Brake Fluid Change" />
              <option value=" Coolant Flush" />
            </datalist>
          </div>

          {/* Start Date */}
          <FormInput
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={v => setForm({...form, startDate: v})}
            required
            disabled={isReadOnly}
          />

          {/* End Date (Optional) */}
          <FormInput
            label="End Date (Optional)"
            type="date"
            value={form.endDate}
            onChange={v => setForm({...form, endDate: v})}
            disabled={isReadOnly}
          />

          {/* Cost */}
          <FormInput
            label="Total Cost (DZD)"
            type="number"
            value={form.cost}
            onChange={v => setForm({...form, cost: v})}
            placeholder="0"
            disabled={isReadOnly}
          />

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '18px', fontWeight: '650', color: '#ffffff' }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={3}
              placeholder="Additional notes..."
              disabled={isReadOnly}
              style={{
                padding: '10px 12px',
                border: '2px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                fontSize: '14px',
                color: 'white',
                background: 'rgba(255,255,255,0.06)',
                outline: 'none',
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 30, justifyContent: 'flex-end' }}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          {!isReadOnly && <SaveButton type="submit" disabled={loading}>Save</SaveButton>}
        </div>
      </form>
    </Modal>
  );
}
