import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export function GasCouponModal({ isOpen, onClose, onSuccess }) {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    quantity: '',
    fuelAmount: '',
    buyDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setForm({
        quantity: '',
        fuelAmount: '',
        buyDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        notes: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.quantity || parseInt(form.quantity) < 1) {
      addToast('❌ Please enter a valid quantity', 'error');
      return;
    }
    
    if (!form.fuelAmount || parseFloat(form.fuelAmount) <= 0) {
      addToast('❌ Please enter a valid fuel amount', 'error');
      return;
    }
    
    if (!form.buyDate) {
      addToast('❌ Please enter buy date', 'error');
      return;
    }
    
    if (!form.expiryDate) {
      addToast('❌ Please enter expiry date', 'error');
      return;
    }

    setLoading(true);
    try {
      // Buy coupons (creates ONE batch row)
      await api.post("/gas-coupons/buy", null, {
        params: {
          quantity: form.quantity,
          fuelAmount: form.fuelAmount,
          buyDate: form.buyDate,
          expiryDate: form.expiryDate
        }
      });
      addToast(`✅ ${form.quantity} coupons purchased successfully!`, 'success');

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
    <Modal isOpen={isOpen} onClose={onClose} title="Buy Coupons" size="md">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormInput
            label="Quantity"
            type="number"
            min="1"
            placeholder="Number of coupons"
            value={form.quantity}
            onChange={(v) => setForm({ ...form, quantity: v })}
            required
          />
          
          <FormInput
            label="Fuel Amount (Liters per coupon)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.fuelAmount}
            onChange={(v) => setForm({ ...form, fuelAmount: v })}
            required
          />
          
          <FormInput
            label="Buy Date"
            type="date"
            value={form.buyDate}
            onChange={(v) => setForm({ ...form, buyDate: v })}
            required
          />
          
          <FormInput
            label="Expiry Date"
            type="date"
            value={form.expiryDate}
            onChange={(v) => setForm({ ...form, expiryDate: v })}
            required
          />
          
          <FormInput
            label="Notes"
            value={form.notes}
            onChange={(v) => setForm({ ...form, notes: v })}
            placeholder="Optional notes..."
          />
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <SaveButton type="submit" disabled={loading}>
              {loading ? 'Buying...' : 'Buy Coupons'}
            </SaveButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}