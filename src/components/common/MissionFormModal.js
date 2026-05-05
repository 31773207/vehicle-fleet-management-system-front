import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import { useToast } from '../../contexts/ToastContext';  // ✅ Add this
import api from '../../services/api';  // ✅ Add this - use axios instead of fetch
import { Line } from './Line';

export function MissionFormModal({ isOpen, onClose, onSuccess, initialData, driverOptions, vehicleOptions, orgOptions }) {
  const { addToast } = useToast();  // ✅ Add this
  const [form, setForm] = useState({
    departLocation: '',
    destination: '',
    purpose: '',
    startDate: '',
    endDate: '',
    missionType: 'SHORT',
    driver: { id: '' },
    vehicle: { id: '' },
    organization: { id: '' }
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        departLocation: initialData.departLocation || '',
        destination: initialData.destination || '',
        purpose: initialData.purpose || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        missionType: initialData.missionType || 'SHORT',
        driver: { id: initialData.driver?.id || '' },
        vehicle: { id: initialData.vehicle?.id || '' },
        organization: { id: initialData.organization?.id || '' }
      });
    } else {
      setForm({
        departLocation: '',
        destination: '',
        purpose: '',
        startDate: '',
        endDate: '',
        missionType: 'SHORT',
        driver: { id: '' },
        vehicle: { id: '' },
        organization: { id: '' }
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ ADD THIS VALIDATION
  if (new Date(form.startDate) > new Date(form.endDate)) {
    addToast('❌ End date must be after start date', 'error');
    return;
  }
    try {
      const data = {
        departLocation: form.departLocation,
        destination: form.destination,
        purpose: form.purpose,
        startDate: form.startDate,
        endDate: form.endDate,
        missionType: form.missionType,
        driver: form.driver.id ? { id: parseInt(form.driver.id) } : null,
        vehicle: form.vehicle.id ? { id: parseInt(form.vehicle.id) } : null,
        organization: form.organization.id ? { id: parseInt(form.organization.id) } : null
      };

      if (initialData?.id) {
        // Update existing mission
        await api.put(`/missions/${initialData.id}`, data);
        addToast(` Mission to ${form.destination} updated successfully`, 'success');
      } else {
        // Create new mission
        await api.post('/missions', data);
        addToast(` Mission to ${form.destination} created successfully`, 'success');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      addToast(` ${errorMessage}`, 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Mission' : 'New Mission'} size="lg">
      <Line />
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormInput
              label="Depart Location"
              value={form.departLocation}
              onChange={(val) => setForm({ ...form, departLocation: val })}
              required
            />
            <FormInput
              label="Destination"
              value={form.destination}
              onChange={(val) => setForm({ ...form, destination: val })}
              required
            />
          </div>

          <FormInput
            label="Purpose"
            value={form.purpose}
            onChange={(val) => setForm({ ...form, purpose: val })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormInput
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(val) => setForm({ ...form, startDate: val })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <FormInput
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(val) => setForm({ ...form, endDate: val })}
              min={form.startDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormInput
              label="Mission Type"
              value={form.missionType}
              onChange={(val) => setForm({ ...form, missionType: val })}
              required
              options={[
                { value: 'SHORT', label: 'SHORT' },
                { value: 'LONG', label: 'LONG' }
              ]}
            />
            <FormInput
              label="Organization"
              value={form.organization.id}
              onChange={(val) => setForm({ ...form, organization: { id: val } })}
              options={orgOptions}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormInput
              label="Driver"
              value={form.driver.id}
              onChange={(val) => setForm({ ...form, driver: { id: val } })}
              required
              options={driverOptions}
            />
            <FormInput
              label="Vehicle"
              value={form.vehicle.id}
              onChange={(val) => setForm({ ...form, vehicle: { id: val } })}
              required
              options={vehicleOptions}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <CancelButton onClick={onClose}>Cancel</CancelButton>
<SaveButton type="submit">{initialData ? 'Update Mission' : 'Create Mission'}</SaveButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}