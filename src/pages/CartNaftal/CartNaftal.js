import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PageLayout from '../../components/layout/PageLayout';
import { useToast } from '../../contexts/ToastContext';
import { AddButton, SaveButton, CancelButton, DeleteButton } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

function CartNaftal() {
  const [carts, setCarts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [assignId, setAssignId] = useState('');
  const [assignType, setAssignType] = useState('DRIVER');
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, variant: 'danger' });
  const [form, setForm] = useState({ cardNumber: '', balance: '', fuelType: 'Diesel' });
  const { addToast } = useToast();

  useEffect(() => { fetchCarts(); fetchEmployees(); fetchVehicles(); }, []);

  const fetchCarts = async () => { setLoading(true); try { const r = await api.get('/cart-naftal'); setCarts(r.data); } catch { addToast('Error fetching Naftal cards', 'error'); } finally { setLoading(false); } };
  const fetchEmployees = async () => { try { const r = await api.get('/employees'); setEmployees(r.data); } catch { } };
  const fetchVehicles = async () => { try { const r = await api.get('/vehicles'); setVehicles(r.data); } catch { } };

  const handleSubmit = async (e) => { e.preventDefault(); try { await api.post('/cart-naftal', { ...form, balance: parseFloat(form.balance) }); setShowForm(false); setForm({ cardNumber:'', balance:'', fuelType:'Diesel' }); fetchCarts(); addToast('Naftal card saved', 'success'); } catch { addToast('Error saving Naftal card!', 'error'); } };
  const handleAssign = async () => { if(!assignId) return addToast('Please select a target.', 'warning'); try { const ep = assignType==='DRIVER' ? `/cart-naftal/${selectedCart.id}/assign-driver/${assignId}` : `/cart-naftal/${selectedCart.id}/assign-vehicle/${assignId}`; await api.post(ep); setShowAssign(false); setAssignId(''); fetchCarts(); addToast('Card assigned', 'success'); } catch { addToast('Error assigning card!', 'error'); } };

  const openConfirm = (title, message, onConfirm, variant='danger') => setConfirmModal({ isOpen:true, title, message, onConfirm, variant });
  const handleDelete = (id) => openConfirm('Delete Card', 'Delete this Naftal card?', async () => { try { await api.delete(`/cart-naftal/${id}`); fetchCarts(); addToast('Card deleted', 'success'); } catch { addToast('Error deleting card!', 'error'); } });

  const assignTypeOptions = [{value:'DRIVER',label:'Driver'},{value:'VEHICLE',label:'Vehicle'}];

  return (
    <PageLayout>
      <div className="content-header"><h2>Carte Naftal</h2><AddButton onClick={()=>setShowForm(true)}>+ Add Card</AddButton></div>
      {loading?<LoadingSpinner/>:(
        <div className="table-wrapper"><table className="data-table"><thead><tr><th>ID</th><th>Card Number</th><th>Balance</th><th>Fuel</th><th>Assigned To</th><th>Actions</th></tr></thead>
        <tbody>{carts.map(c=>(<tr key={c.id}><td>{c.id}</td><td><strong style={{color:'#FFD700'}}>{c.cardNumber}</strong></td><td>{c.balance} DZD</td><td>{c.fuelType}</td>
        <td>{c.assignedDriver?`${c.assignedDriver.firstName} ${c.assignedDriver.lastName}`:c.assignedVehicle?c.assignedVehicle.plateNumber:'—'}</td>
        <td><div style={{display:'flex',gap:'4px'}}>
          <button onClick={()=>{setSelectedCart(c);setShowAssign(true);}} style={{background:'#17a2b8',color:'white',border:'none',borderRadius:'4px',padding:'4px 8px',cursor:'pointer',fontSize:'12px'}}><i className="fas fa-link"/> Assign</button>
          <DeleteButton onClick={()=>handleDelete(c.id)} />
        </div></td></tr>))}</tbody></table>
        {carts.length===0&&<div className="empty-state"><p><i className="fas fa-inbox"/> No cards found</p></div>}</div>
      )}
      <ConfirmModal isOpen={confirmModal.isOpen} onClose={()=>setConfirmModal({...confirmModal,isOpen:false})} onConfirm={confirmModal.onConfirm} title={confirmModal.title} message={confirmModal.message} confirmVariant={confirmModal.variant} />

      <Modal isOpen={showForm} onClose={()=>setShowForm(false)} title="Add Naftal Card" size="md">
        <form onSubmit={handleSubmit}><div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <FormInput label="Card Number" name="cardNumber" value={form.cardNumber} onChange={(v)=>setForm({...form,cardNumber:v})} required />
          <FormInput label="Balance (DZD)" name="balance" type="number" value={form.balance} onChange={(v)=>setForm({...form,balance:v})} required />
          <FormInput label="Fuel Type" name="fuelType" value={form.fuelType} onChange={(v)=>setForm({...form,fuelType:v})} options={[{value:'Diesel',label:'Diesel'},{value:'Essence',label:'Essence'}]} />
          <div style={{display:'flex',gap:'12px',marginTop:'12px'}}><SaveButton><i className="fas fa-save"/> Save</SaveButton><CancelButton onClick={()=>setShowForm(false)}>Cancel</CancelButton></div>
        </div></form>
      </Modal>

      <Modal isOpen={showAssign} onClose={()=>{setShowAssign(false);setAssignId('');}} title={selectedCart?`Assign Card ${selectedCart.cardNumber}`:'Assign Card'} size="md">
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <FormInput label="Assign To" name="assignType" value={assignType} onChange={(v)=>{setAssignType(v);setAssignId('');}} options={assignTypeOptions} />
          <FormInput label={`Select ${assignType}`} name="assignId" value={assignId} onChange={(v)=>setAssignId(v)} options={[{value:'',label:'-- Select --'},...(assignType==='DRIVER'?employees.map(e=>({value:e.id,label:`${e.firstName} ${e.lastName}`})):vehicles.map(v=>({value:v.id,label:v.plateNumber})))]} />
          <div style={{display:'flex',gap:'12px',marginTop:'12px'}}><SaveButton type="button" onClick={handleAssign}><i className="fas fa-link"/> Assign</SaveButton><CancelButton onClick={()=>{setShowAssign(false);setAssignId('');}}>Cancel</CancelButton></div>
        </div>
      </Modal>
    </PageLayout>
  );
}

export default CartNaftal;
