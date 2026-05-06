import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import { useToast } from '../../contexts/ToastContext';

// HISTORY MODAL - Separate component
function HistoryModal({ isOpen, onClose, employee, manageHistory }) {
  if (!employee) return null;
  
  const hist = manageHistory[employee.id] || { current: null, history: [] };
  const allAssignments = [
    ...(hist.current ? [{ ...hist.current, isCurrent: true }] : []),
    ...hist.history
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assignment History — ${employee.firstName} ${employee.lastName}`}
      size="lg"
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#FFD700', marginBottom: '10px' }}>
          <i className="fas fa-history"></i> Assignment History
        </div>

        {allAssignments.length > 0 ? (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {allAssignments.map((h, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  background: h.isCurrent
                    ? 'rgba(40,167,69,0.1)'
                    : 'transparent',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>
                  <i className="fas fa-car"></i> {h.vehicle?.plateNumber}
                  {' - '}
                  {h.vehicle?.brand?.brandName} {h.vehicle?.model}
                  {h.isCurrent && (
                    <span style={{ color: '#28a745', marginLeft: '10px' }}>
                      ● CURRENT
                    </span>
                  )}
                </div>
                {h.startDate && (
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
                    <i className="fas fa-calendar"></i> From: {new Date(h.startDate).toLocaleDateString()}
                    {h.endDate && ` To: ${new Date(h.endDate).toLocaleDateString()}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            No assignment history
          </p>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          justifyContent: 'flex-end'
        }}
      >
        <CancelButton onClick={onClose}>Close</CancelButton>
      </div>
    </Modal>
  );
}

// ASSIGN MODAL - Separate component
function AssignModal({ isOpen, onClose, onAssign, employee, vehicles, onRefresh }) {
  const [assignVehicleId, setAssignVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setAssignVehicleId('');
      setStartDate('');
      setEndDate('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!employee) return null;

  const vehicleOptions = [
    { value: '', label: '-- Select Vehicle --' },
    ...vehicles
      .filter(
        v =>
          v.status === 'AVAILABLE' ||
          (employee.currentlyAssignedVehicle &&
            v.id === employee.currentlyAssignedVehicle.id)
      )
      .map(v => ({
        value: v.id,
        label: `${v.plateNumber} - ${v.brand?.brandName} ${v.model}`
      }))
  ];

  const handleAssign = async () => {
    if (!assignVehicleId) {
      addToast('Please select a vehicle', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAssign(employee.id, assignVehicleId, {
        startDate,
        endDate
      });

      addToast(
        `Vehicle assigned successfully to ${employee.firstName} ${employee.lastName}!`,
        'success'
      );

      if (onRefresh) await onRefresh();
      onClose();
    } catch (error) {
      addToast(error.response?.data?.message || error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Vehicle — ${employee.firstName} ${employee.lastName}`}
      size="lg"
    >
      <div>
        <FormInput
          label="Select Vehicle"
          value={assignVehicleId}
          onChange={setAssignVehicleId}
          options={vehicleOptions}
          required
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '20px'
          }}
        >
          <FormInput
            label="Start Date"
            type="date"
            value={startDate}
            onChange={setStartDate}
          />
          <FormInput
            label="End Date"
            type="date"
            value={endDate}
            onChange={setEndDate}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '30px',
          justifyContent: 'flex-end'
        }}
      >
        <CancelButton onClick={onClose}>Cancel</CancelButton>
        <SaveButton onClick={handleAssign} disabled={isSubmitting}>
          {isSubmitting ? 'Assigning...' : 'Assign Vehicle'}
        </SaveButton>
      </div>
    </Modal>
  );
}

// MAIN VEHICLE ASSIGNMENT MODAL - Now just a wrapper that shows the right modal based on mode
export function VehicleAssignmentModal({
  isOpen,
  onClose,
  onAssign,
  onRemove,
  employee,
  vehicles,
  manageHistory,
  onRefresh,
  mode // 'history' or 'assign'
}) {
  // If mode is 'history', show HistoryModal
  if (mode === 'history') {
    return (
      <HistoryModal
        isOpen={isOpen}
        onClose={onClose}
        employee={employee}
        manageHistory={manageHistory}
      />
    );
  }
  
  // If mode is 'assign', show AssignModal
  if (mode === 'assign') {
    return (
      <AssignModal
        isOpen={isOpen}
        onClose={onClose}
        onAssign={onAssign}
        employee={employee}
        vehicles={vehicles}
        onRefresh={onRefresh}
      />
    );
  }
  
  return null;
}
