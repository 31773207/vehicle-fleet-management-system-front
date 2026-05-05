import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

export function CompleteMissionModal({ isOpen, onClose, onComplete, missionId }) {
  const [finalKilometrage, setFinalKilometrage] = useState('');
  const [currentKilometrage, setCurrentKilometrage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Fetch current vehicle kilometrage when modal opens
  useEffect(() => {
    if (isOpen && missionId) {
      fetchCurrentKilometrage();
    }
  }, [isOpen, missionId]);

  const fetchCurrentKilometrage = async () => {
    try {
      const response = await api.get(`/missions/${missionId}`);
      const mission = response.data;
      const vehicleResponse = await api.get(`/vehicles/${mission.vehicle.id}`);
      setCurrentKilometrage(vehicleResponse.data.kilometrage);
    } catch (error) {
      console.error('Error fetching kilometrage:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!finalKilometrage) {
      addToast('❌ Please enter final kilometrage', 'error');
      return;
    }
    
    const finalKm = parseFloat(finalKilometrage);
    
    if (isNaN(finalKm)) {
      addToast('❌ Please enter a valid number', 'error');
      return;
    }
    
    // ✅ THIS IS THE MAIN VALIDATION
    if (currentKilometrage !== null && finalKm <= currentKilometrage) {
      addToast(`❌ Final km must be greater than current km (${currentKilometrage} km)`, 'error');
      return;
    }
    
    setLoading(true);
    try {
      await onComplete(missionId, finalKm);
      addToast(`✅ Mission completed! Final km: ${finalKm}`, 'success');
      setFinalKilometrage('');
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      addToast(`❌ ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Mission" size="md">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentKilometrage !== null && (
            <div style={{ 
              background: 'rgba(255,215,0,0.1)', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <p style={{ color: '#FFD700' }}>Current Kilometrage:</p>
              <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{currentKilometrage} km</p>
              <p style={{ color: '#ffc107', fontSize: '12px' }}>
                Final kilometrage must be greater than {currentKilometrage} km
              </p>
            </div>
          )}
          
          <FormInput
            label="Final Kilometrage (km)"
            type="number"
            step="1"
            placeholder={`Must be > ${currentKilometrage || 0}`}
            value={finalKilometrage}
            onChange={setFinalKilometrage}
            required
          />
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <CancelButton onClick={onClose}>Cancel</CancelButton>
<SaveButton type="submit" disabled={loading}>
              {loading ? 'Completing...' : 'Complete Mission'}
            </SaveButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}