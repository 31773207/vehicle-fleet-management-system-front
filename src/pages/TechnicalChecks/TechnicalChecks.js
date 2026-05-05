import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PageLayout from '../../components/layout/PageLayout';
import { useToast } from '../../contexts/ToastContext';
import { AddButton, SaveButton, CancelButton, EditButton, DeleteButton } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DataTable } from '../../components/common/DataTable';
import { canEdit } from '../../utils/roles';
import { TechnicalCheckModal } from '../../components/common/TechnicalCheckModal';
import { useConfirm } from '../../hooks/useConfirm';

function TechnicalChecks() {
  const [checks, setChecks] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCheck, setEditCheck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ vehicleId: '', checkDate: '', expiryDate: '', result: 'PASS', notes: '' });
  
  // ✅ Only use useConfirm - remove confirmModal state
  const { confirmState, showConfirm, hideConfirm } = useConfirm();
  const { addToast } = useToast();

  useEffect(() => { fetchChecks(); fetchVehicles(); fetchExpiringSoon(); }, []);

  const fetchChecks = async () => {
    setLoading(true);
    try { const res = await api.get('/technical-checks'); setChecks(res.data); }
    catch (err) { addToast('Error fetching technical checks', 'error'); }
    finally { setLoading(false); }
  };

  const fetchVehicles = async () => {
    try { const res = await api.get('/vehicles'); setVehicles(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchExpiringSoon = async () => {
    try { const res = await api.get('/technical-checks/expiring-soon'); setExpiringSoon(res.data); }
    catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, vehicle: { id: parseInt(form.vehicleId) } };
      if (editCheck) {
        await api.put(`/technical-checks/${editCheck.id}`, data);
        //addToast('✅ Technical check updated', 'success');
      } else {
        await api.post('/technical-checks', data);
        //addToast('✅ Technical check created', 'success');
      }
      setShowForm(false); setEditCheck(null); setForm({ vehicleId: '', checkDate: '', expiryDate: '', result: 'PASS', notes: '' });
      fetchChecks(); fetchExpiringSoon();
    } catch (err) { 
      //addToast('❌ Error saving technical check!', 'error');
     }
  };

  const handleEdit = (check) => {
    setEditCheck(check);
    setForm({ vehicleId: check.vehicle?.id || '', checkDate: check.checkDate || '', expiryDate: check.expiryDate || '', result: check.result || 'PASS', notes: check.notes || '' });
    setShowForm(true);
  };

  // ✅ Use showConfirm for delete
  const handleDelete = (id, plateNumber) => {
    showConfirm(
      'Delete Technical Check',
      `Delete technical check for vehicle "${plateNumber}"?`,
      async () => {
        await api.delete(`/technical-checks/${id}`);
        await fetchChecks();
        await fetchExpiringSoon();
        //addToast(`✅ Technical check for ${plateNumber} deleted`, 'success');
      },
      'danger'
    );
  };

  const vehicleOptions = [{ value: '', label: 'Select Vehicle' }, ...vehicles.map(v => ({ value: v.id, label: v.plateNumber }))];

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'vehicle', label: 'Vehicle', render: (value) => value?.plateNumber || '—' },
    { key: 'checkDate', label: 'Check Date' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'result', label: 'Result', render: (value) => (
      <span className={`mission-badge badge-${value?.toLowerCase()}`}>{value}</span>
    )},
    { key: 'notes', label: 'Notes', render: (value) => value || '—' },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, row) => !canEdit() ? <span style={{color:'#888'}}>—</span> : (
        <div style={{ display: 'flex', gap: '4px' }}>
          <EditButton onClick={() => handleEdit(row)} />
          {/* ✅ Fixed DeleteButton */}
          <DeleteButton 
            onClick={() => handleDelete(row.id, row.vehicle?.plateNumber)} 
            itemName={`technical check for ${row.vehicle?.plateNumber}`}
          />
        </div>
      )
    }
  ];

  const tableData = checks;

  return (
    <PageLayout>
      <div className="content-header">
        <h2>Technical Checks</h2>
        {canEdit() && <AddButton onClick={() => { setEditCheck(null); setForm({ vehicleId: '', checkDate: '', expiryDate: '', result: 'PASS', notes: '' }); setShowForm(true); }}>+ Add Check</AddButton>}
      </div>

      {expiringSoon.length > 0 && (
        <div style={{ background: 'rgba(220,53,69,0.2)', border: '1px solid #dc3545', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
          <strong style={{ color: '#dc3545' }}><i className="fas fa-exclamation-triangle"></i> Expiring Soon:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: 'white' }}>
            {expiringSoon.map(c => (
              <li key={c.id}>{c.vehicle?.plateNumber} — expires {new Date(c.expiryDate).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      )}

      {loading ? <LoadingSpinner /> : (
        <DataTable 
          columns={columns} 
          data={tableData}
          emptyMessage="No checks found"
        />
      )}

      {/* ✅ Only ONE ConfirmModal - using confirmState */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={hideConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmVariant={confirmState.variant}
      />

      <TechnicalCheckModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={() => { fetchChecks(); fetchExpiringSoon(); setShowForm(false); }}
        initialData={editCheck}
        vehicles={vehicles}
      />
    </PageLayout>
  );
}

export default TechnicalChecks;
