import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export function EditAssignmentModal({ isOpen, onClose, onSuccess, assignment }) {
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignment && isOpen) {
      setQuantity(assignment.quantity || '');
    }
  }, [assignment, isOpen]);

  const handleSubmit = async () => {
    if (!quantity || parseInt(quantity) < 1) {
      addToast('❌ Please enter a valid quantity', 'error');
      return;
    }
    
    if (parseInt(quantity) < (assignment?.usedQuantity || 0)) {
      addToast(`❌ Quantity cannot be less than already used (${assignment?.usedQuantity})`, 'error');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/coupon-assignments/${assignment.id}`, {
        quantity: parseInt(quantity)
      });
      addToast(`✅ Assignment updated successfully!`, 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      addToast(`❌ ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Assignment" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ 
          background: 'rgba(255,215,0,0.1)', 
          padding: '12px', 
          borderRadius: '8px',
          marginBottom: '8px'
        }}>
          <p style={{ color: '#FFD700', marginBottom: '5px' }}>Employee: {assignment.employee?.firstName} {assignment.employee?.lastName}</p>
          <p style={{ color: '#FFD700', marginBottom: '5px' }}>Batch: {assignment.batch?.batchNumber}</p>
          <p style={{ color: 'white' }}>Current: <strong>{assignment.quantity}</strong> coupons</p>
          <p style={{ color: '#ffc107' }}>Used: <strong>{assignment.usedQuantity || 0}</strong> coupons</p>
          <p style={{ color: '#28a745' }}>Remaining: <strong>{assignment.remaining}</strong> coupons</p>
        </div>
        
        <FormInput
          label="New Total Quantity"
          type="number"
          min={assignment.usedQuantity || 1}
          placeholder="Enter new total quantity"
          value={quantity}
          onChange={(v) => setQuantity(v)}
          required
        />
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update Assignment'}
          </SaveButton>
        </div>
      </div>
    </Modal>
  );
}