// components/common/EmployeeFormModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Line } from './Line';
export function EmployeeFormModal({ isOpen, onClose, onSuccess, employee, organizations }) {
  const { addToast } = useToast();
  
  const [form, setForm] = useState({
    employeeType: 'DRIVER',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    licenseNumber: '',
    licenseExpiry: '',
    organization: { id: '' }
  });

  useEffect(() => {
    if (employee) {
      setForm({
        employeeType: employee.employeeType || 'DRIVER',
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        phone: employee.phone || '',
        email: employee.email || '',
        address: employee.address || '',
        dateOfBirth: employee.dateOfBirth || '',
        licenseNumber: employee.licenseNumber || '',
        licenseExpiry: employee.licenseExpiry || '',
        organization: { id: employee.organization?.id || '' }
      });
    } else {
      setForm({
        employeeType: 'DRIVER',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        dateOfBirth: '',
        licenseNumber: '',
        licenseExpiry: '',
        organization: { id: '' }
      });
    }
  }, [employee, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        dateOfBirth: form.dateOfBirth,
        organization: form.organization.id ? { id: parseInt(form.organization.id) } : null,
        employeeType: form.employeeType,
        licenseNumber: form.employeeType === 'DRIVER' ? form.licenseNumber : null,
        licenseExpiry: form.employeeType === 'DRIVER' ? form.licenseExpiry : null
      };

      let response;
      
      if (employee) {
        // Update - use employees endpoint for both types
        response = await api.put(`/employees/${employee.id}`, data);
        addToast(` ${form.firstName} ${form.lastName} updated successfully`, 'success');
      } else {
        // Create - use correct endpoint based on type
        if (form.employeeType === 'DRIVER') {
          response = await api.post('/drivers', data);
          addToast(` Driver ${form.firstName} ${form.lastName} created successfully`, 'success');
        } else {
          response = await api.post('/employees', data);
          addToast(` Employee ${form.firstName} ${form.lastName} created successfully`, 'success');
        }
      }

      if (response.status === 200 || response.status === 201) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error saving employee';
      addToast(` ${errorMessage}`, 'error');
    }
  };

  const orgOptions = [
    { value: '', label: 'Select Organization' },
    ...organizations.map(o => ({ value: o.id, label: o.name }))
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={employee ? 'Edit Employee' : 'Add Employee'} size="lg">
      <Line />
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div style={{ gridColumn: 'span 2' }}>
            <FormInput
              label="Type"
              value={form.employeeType}
              onChange={(val) => setForm({ ...form, employeeType: val })}
              required
              options={[
                { value: 'DRIVER', label: 'Driver (has license)' },
                { value: 'EMPLOYEE', label: 'Employee (no license)' }
              ]}
            />
          </div>
          <FormInput label="First Name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} required />
          <FormInput label="Last Name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} required />
          <FormInput label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          <FormInput label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <div style={{ gridColumn: 'span 2' }}>
            <FormInput label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          </div>
          <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(v) => setForm({ ...form, dateOfBirth: v })} />
          
          {form.employeeType === 'DRIVER' && (
            <>
              <FormInput label="License Number" value={form.licenseNumber} onChange={(v) => setForm({ ...form, licenseNumber: v })} required />
              <FormInput label="License Expiry" type="date" value={form.licenseExpiry} onChange={(v) => setForm({ ...form, licenseExpiry: v })} required />
            </>
          )}

          <div style={{ gridColumn: 'span 2' }}>
            <FormInput
              label="Organization"
              value={form.organization.id}
              onChange={(val) => setForm({ ...form, organization: { id: val } })}
              options={orgOptions}
            />
          </div>

          <div className="form-buttons" style={{ gridColumn: 'span 2', display: 'flex', gap: '12px' }}>
                        <CancelButton onClick={onClose}>Cancel</CancelButton>
<SaveButton type="submit">Save</SaveButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}