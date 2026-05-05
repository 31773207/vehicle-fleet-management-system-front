import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export function TransferCouponModal({ isOpen, onClose, onSuccess, batch }) {
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOrganizations();
    }
  }, [isOpen]);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get('/organizations');
      setOrganizations(res.data);
    } catch (err) {
      console.error('Error fetching organizations');
    }
  };

  const organizationOptions = [
    { value: '', label: '-- Select Organization --' },
    ...organizations.map(org => ({ 
      value: org.id, 
      label: org.name 
    }))
  ];

  const handleSubmit = async () => {
    if (!quantity || parseInt(quantity) < 1) {
      addToast('❌ Please enter a valid quantity', 'error');
      return;
    }
    
    if (parseInt(quantity) > batch?.quantityRemaining) {
      addToast(`❌ Only ${batch?.quantityRemaining} coupons available`, 'error');
      return;
    }
    
    if (!organizationId) {
      addToast('❌ Please select an organization to transfer to', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/gas-coupons/${batch.id}/transfer`, null, {
        params: { 
          quantity: parseInt(quantity),
          organizationId: parseInt(organizationId)
        }
      });
      addToast(`✅ ${quantity} coupons transferred to organization!`, 'success');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer Coupons" size="md">
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
          label="Quantity to Transfer"
          type="number"
          min="1"
          max={batch?.quantityRemaining}
          placeholder="Number of coupons"
          value={quantity}
          onChange={(v) => setQuantity(v)}
          required
        />
        
        <FormInput
          label="Transfer To Organization"
          value={organizationId}
          onChange={(v) => setOrganizationId(v)}
          options={organizationOptions}
          required
        />
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={handleSubmit} disabled={loading}>
            {loading ? 'Transferring...' : 'Transfer Coupons'}
          </SaveButton>
        </div>
      </div>
    </Modal>
  );
}