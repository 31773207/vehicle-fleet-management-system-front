import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export function AssignCouponModal({ isOpen, onClose, onSuccess, batch }) {
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees');
    }
  };

  const employeeOptions = [
    { value: '', label: '-- Select Employee --' },
    ...employees.map(emp => ({ 
      value: emp.id, 
      label: `${emp.firstName} ${emp.lastName} (${emp.employeeType})` 
    }))
  ];

  const handleSubmit = async () => {
    if (!employeeId) {
      addToast('❌ Please select an employee', 'error');
      return;
    }
    
    if (!quantity || parseInt(quantity) < 1) {
      addToast('❌ Please enter a valid quantity', 'error');
      return;
    }
    
    if (parseInt(quantity) > batch?.quantityRemaining) {
      addToast(`❌ Only ${batch?.quantityRemaining} coupons available`, 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/gas-coupons/${batch.id}/assign`, null, {
        params: { 
          employeeId: parseInt(employeeId),
          quantity: parseInt(quantity)
        }
      });
      addToast(`✅ ${quantity} coupons assigned to employee!`, 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      addToast(`❌ ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Coupons" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ 
          background: 'rgba(255,215,0,0.1)', 
          padding: '12px', 
          borderRadius: '8px',
          marginBottom: '8px'
        }}>
          <p style={{ color: '#FFD700', marginBottom: '5px' }}>Batch: {batch?.batchNumber}</p>
          <p style={{ color: 'white' }}>Available: <strong>{batch?.quantityRemaining}</strong> coupons</p>
        </div>
        
        <FormInput
          label="Select Employee"
          value={employeeId}
          onChange={(v) => setEmployeeId(v)}
          options={employeeOptions}
          required
        />
        
        <FormInput
          label="Quantity to Assign"
          type="number"
          min="1"
          max={batch?.quantityRemaining}
          placeholder="Number of coupons"
          value={quantity}
          onChange={(v) => setQuantity(v)}
          required
        />
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={handleSubmit} disabled={loading}>
            {loading ? 'Assigning...' : 'Assign Coupons'}
          </SaveButton>
        </div>
      </div>
    </Modal>
  );
}