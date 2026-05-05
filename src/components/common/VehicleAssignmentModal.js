import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { SaveButton, CancelButton } from './Button';
import { useToast } from '../../contexts/ToastContext';

export function VehicleAssignmentModal({
  isOpen,
  onClose,
  onAssign,
  onRemove,
  employee,
  vehicles,
  manageHistory,
  onRefresh
}) {
  const [assignVehicleId, setAssignVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState('history'); // ✅ ONLY ONE MODE SOURCE

  const { addToast } = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAssignVehicleId('');
      setStartDate('');
      setEndDate('');
      setIsSubmitting(false);
      setMode('history'); // reset tab when opening
    }
  }, [isOpen]);

  if (!employee) return null;

  // Vehicle options
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

  const hist = manageHistory[employee.id] || { current: null, history: [] };
  const allAssignments = [
    ...(hist.current ? [{ ...hist.current, isCurrent: true }] : []),
    ...hist.history
  ];

  // ASSIGN
  const handleAssign = async () => {
    if (!assignVehicleId) {
      addToast('❌ Please select a vehicle', 'error');
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

  // REMOVE
  const handleRemove = async () => {
    if (
      !window.confirm(
        `Remove vehicle from ${employee.firstName} ${employee.lastName}?`
      )
    )
      return;

    setIsSubmitting(true);
    try {
      await onRemove(employee.id);

      addToast(
        `Vehicle removed from ${employee.firstName} ${employee.lastName}!`,
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
      title={`Manage Vehicle — ${employee.firstName} ${employee.lastName}`}
      size="lg"
    >
      {/* TAB HEADER */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '1px solid rgba(255,215,0,0.2)',
          marginBottom: '20px'
        }}
      >
        {/* HISTORY */}
        <button
          onClick={() => setMode('history')}
          style={{
            padding: '8px 16px',
            background: mode === 'history' ? '#FFD700' : 'transparent',
            color: mode === 'history' ? '#001838' : '#FFD700',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          <i className="fas fa-history"></i> History
        </button>

        {/* ASSIGN */}
        {employee.employeeType === 'EMPLOYEE' && (
          <button
            onClick={() => setMode('assign')}
            style={{
              padding: '8px 16px',
              background: mode === 'assign' ? '#FFD700' : 'transparent',
              color: mode === 'assign' ? '#001838' : '#FFD700',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            <i className="fas fa-plus"></i> Assign Vehicle
          </button>
        )}
      </div>

      {/* HISTORY SECTION */}
      {mode === 'history' && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#FFD700', marginBottom: '10px' }}>
            <i className="fas fa-history"></i> Assignment History
          </div>

          {allAssignments.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>
              No assignment history
            </p>
          )}
        </div>
      )}

      {/* ASSIGN FORM */}
      {mode === 'assign' &&
        employee.employeeType === 'EMPLOYEE' && (
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
        )}

      {/* BUTTONS */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '30px',
          justifyContent: 'flex-end'
        }}
      >
        <CancelButton onClick={handleRemove} disabled={isSubmitting}>
          Remove
        </CancelButton>

        <SaveButton onClick={handleAssign} disabled={isSubmitting}>
          {isSubmitting ? 'Assigning...' : 'Assign'}
        </SaveButton>

        <CancelButton onClick={onClose}>Close</CancelButton>
      </div>
    </Modal>
  );
}