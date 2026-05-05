// components/common/MaintenanceModal/MaintenanceModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../Modal';
import { SaveButton, CancelButton } from '../Button';
import { PartsTab } from './PartsTab';
import { MaintenanceForm } from './MaintenanceForm';
import api from '../../../services/api';
import { getDefaultPartsByType } from '../../../utils/maintenance.utils';
import { useToast } from '../../../contexts/ToastContext';

export function MaintenanceModal({ isOpen, onClose, onSuccess, vehicle, initialData, vehicles = [] }) {
  const [activeTab, setActiveTab] = useState('info');
  const [form, setForm] = useState({
    vehicleId: '',
    maintenanceType: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    cost: '',
    description: '',
    status: 'SCHEDULED',
  });
  const [parts, setParts] = useState([]);
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

  // Auto-fill parts when type changes
  useEffect(() => {
    if (!isEditMode && !isReadOnly && form.maintenanceType && parts.length === 0) {
      const defaultParts = getDefaultPartsByType(form.maintenanceType);
      if (defaultParts.length > 0) setParts(defaultParts);
    }
  }, [form.maintenanceType, isEditMode, isReadOnly, parts.length]);

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
        status: initialData.status || 'SCHEDULED',
      });
      if (initialData.id) {
        api.get(`/maintenance/${initialData.id}/parts`).then(r => setParts(r.data)).catch(() => setParts([]));
      }
    } else if (resolvedVehicle) {
      setForm({ ...form, vehicleId: resolvedVehicle.id });
      setParts([]);
    }
  }, [initialData, resolvedVehicle]);

  const partsCost = parts.reduce((s, p) => s + (parseInt(p.quantity) || 0) * (parseFloat(p.unitCost) || 0), 0);
  const vehicleOptions = [{ value: '', label: 'Select Vehicle' }, ...vehicles.map(v => ({ value: v.id, label: `${v.plateNumber} - ${v.model}` }))];

  // ✅ VALIDATION with Toast instead of alert
  const validate = () => {
    if (isReadOnly) return true;
    
    const vehicleId = resolvedVehicle?.id || initialData?.vehicle?.id || form.vehicleId;
    if (!vehicleId) { 
      addToast('⚠️ Please select a vehicle!', 'error');
      return null; 
    }
    
    if (form.endDate && form.endDate < form.startDate) { 
      addToast('⚠️ End date must be after start date!', 'error');
      return null; 
    }
    
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!p.partName?.trim()) { 
        addToast(`⚠️ Part #${i+1}: Name required`, 'error');
        return null; 
      }
      if (!p.quantity || parseInt(p.quantity) < 1) { 
        addToast(`⚠️ Part #${i+1}: Quantity must be at least 1`, 'error');
        return null; 
      }
      if (!p.unitCost && p.unitCost !== 0) { 
        addToast(`⚠️ Part #${i+1}: Unit cost required for "${p.partName}"`, 'error');
        return null; 
      }
    }
    return { vehicleId };
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (isReadOnly) { onClose(); return; }
  const valid = validate();
  if (!valid) return;
  setLoading(true);
  try {
    // ✅ Calculate total cost from parts
    const totalCost = parts.reduce((sum, p) => {
      const qty = parseInt(p.quantity) || 0;
      const cost = parseFloat(p.unitCost) || 0;
      return sum + (qty * cost);
    }, 0);

    const payload = {
      vehicle: { id: parseInt(valid.vehicleId) },
      maintenanceType: form.maintenanceType,
      startDate: form.startDate,
      endDate: form.endDate || null,
      cost: totalCost,  // ✅ ADD THIS - calculated from parts
      description: form.description,
      status: isEditMode ? form.status : 'SCHEDULED',
    };

    let savedId;
    if (isEditMode) {
      const res = await api.put(`/maintenance/${initialData.id}`, payload);
      savedId = res.data.id;
    } else {
      const res = await api.post('/maintenance', payload);
      savedId = res.data.id;
    }

    if (parts.length > 0) {
      if (isEditMode) {
        const existingParts = await api.get(`/maintenance/${savedId}/parts`);
        for (const part of existingParts.data) {
          await api.delete(`/maintenance/${savedId}/parts/${part.id}`);
        }
      }
      for (const p of parts) {
        await api.post(`/maintenance/${savedId}/parts`, {
          partName: p.partName,
          quantity: parseInt(p.quantity),
          unitCost: parseFloat(p.unitCost) || 0,
          notes: p.notes || ''
        });
      }
    }
    
    addToast('✅ Maintenance saved successfully!', 'success');
    onSuccess?.();
    onClose();
  } catch (error) {
    console.error('Error:', error);
    
    const errorData = error.response?.data;
    const errorMessage = error.response?.data?.message;
    
    if (errorMessage && errorMessage.includes('Cost is required')) {
      addToast('⚠️ Please add at least one part with a valid cost', 'error');
    } 
    else if (errorMessage && errorMessage.includes('End date must be after start date')) {
      addToast('⚠️ End date must be after start date', 'error');
    }
    else if (errorData?.errors) {
      const firstError = Object.values(errorData.errors)[0];
      addToast(`⚠️ ${firstError}`, 'error');
    }
    else {
      addToast('❌ Error saving maintenance! Please check all fields.', 'error');
    }
  } finally {
    setLoading(false);
  }
};
  const tabStyle = (tab) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 600,
    borderBottom: activeTab === tab ? '2px solid #17a2b8' : '2px solid transparent',
    color: activeTab === tab ? '#17a2b8' : 'rgba(255,255,255,0.45)',
    background: 'transparent',
    border: 'none',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}
           title={isReadOnly ? 'Maintenance Details' : (isEditMode ? 'Edit Maintenance' : 'Schedule Maintenance')}
           size="lg">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 20 }}>
          <button type="button" style={tabStyle('info')} onClick={() => setActiveTab('info')}>
            <i className="fas fa-info-circle" style={{ marginRight: 6 }} />Info
          </button>
          <button type="button" style={tabStyle('parts')} onClick={() => setActiveTab('parts')}>
            <i className="fas fa-cogs" style={{ marginRight: 6 }} />
            Parts {parts.length > 0 && <span style={{ background: '#17a2b8', borderRadius: 10, padding: '1px 7px', fontSize: 11, marginLeft: 4 }}>{parts.length}</span>}
          </button>
        </div>

        {activeTab === 'info' && (
          <>
            <MaintenanceForm
              form={form}
              setForm={setForm}
              isPreselected={isPreselected}
              resolvedVehicle={resolvedVehicle}
              initialData={initialData}
              isEditMode={isEditMode}
              isReadOnly={isReadOnly}
              vehicleOptions={vehicleOptions}
            />
            {partsCost > 0 && (
              <div style={{ marginTop: 12, fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>
                💰 Grand total:&nbsp;
                <strong style={{ color: '#28a745' }}>{partsCost.toLocaleString('fr-DZ')} DZD</strong>
              </div>
            )}
          </>
        )}

        {activeTab === 'parts' && (
          <div>
            <div style={{ marginBottom: 14, fontSize: 20, color: 'rgba(255, 255, 255, 0.76)' }}>
              <i className="fas fa-info-circle" style={{ marginRight: 6, color: '#17a2b8' }} />
              {isReadOnly ? 'Parts used:' : 'Add parts - cost auto-calculated'}
            </div>
            <PartsTab parts={parts} onChange={setParts} readOnly={isReadOnly} />
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          {!isReadOnly && <SaveButton type="submit" disabled={loading}>Save</SaveButton>}
        </div>
      </form>
    </Modal>
  );
}