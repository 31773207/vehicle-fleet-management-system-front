import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PageLayout from '../../components/layout/PageLayout';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { canEdit } from "../../utils/roles";
import { useConfirm } from '../../hooks/useConfirm';
import { 
  AddButton, 
  SaveButton, 
  CancelButton, 
  EditButton,
  DeleteButton,
  ActivateButton,
  DeactivateButton
} from '../../components/common/Button';
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', role: 'MANAGER' });

  const { addToast } = useToast();
  const { confirmState, showConfirm, hideConfirm } = useConfirm();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try { const res = await api.get('/users'); setUsers(res.data); }
    catch (err) { addToast('Access denied or error loading users!', 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      setShowForm(false); setForm({ fullName: '', username: '', email: '', password: '', role: 'MANAGER' }); fetchUsers();
      addToast('✅ User created successfully', 'success');
    } catch (err) { addToast('❌ Error creating user!', 'error'); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editUser.id}`, form);
      setShowEditForm(false); setEditUser(null); setForm({ fullName: '', username: '', email: '', password: '', role: 'MANAGER' }); fetchUsers();
      addToast(`✅ User ${form.fullName} updated successfully`, 'success');
    } catch (err) { addToast('❌ Error updating user!', 'error'); }
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ fullName: u.fullName, username: u.username, email: u.email, password: '', role: u.role });
    setShowEditForm(true);
  };

  const handleDelete = (id, username) => {
    showConfirm(
      'Delete User',
      `Are you sure you want to delete user "${username}"?`,
      async () => {
        try { 
          await api.delete(`/users/${id}`); 
          await fetchUsers(); 
          addToast(`✅ User "${username}" deleted successfully`, 'success'); 
        }
        catch (err) { 
          addToast('❌ Error deleting user!', 'error'); 
        }
      },
      'danger'
    );
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      await api.patch(`/users/${id}/active?active=${!currentActive}`);
      await fetchUsers();
      addToast(`✅ User ${!currentActive ? 'activated' : 'deactivated'}`, 'success');
    } catch (err) { addToast('❌ Error updating user status!', 'error'); }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      ADMIN: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: 'fa-crown' },
      MANAGER: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: 'fa-chart-line' },
      RESPONSABLE: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: 'fa-user-check' }
    };
    const config = roleConfig[role] || roleConfig.RESPONSABLE;
    return (
      <span className="role-badge" style={{ color: config.color, background: config.bg }}>
        <i className={`fas ${config.icon}`} style={{ fontSize: '11px', marginRight: '6px' }}></i>
        {role}
      </span>
    );
  };

  const getStatusBadge = (active) => {
    return (
      <span className={`status-badge ${active ? 'active' : 'inactive'}`}>
        <span className="status-dot"></span>
        {active ? 'Active' : 'Inactive'}
      </span>
    );
  };

  return (
    <PageLayout>
      <div className="content-header">
        <div>
          <h2 className="content-headere">Users</h2>
          <p className="users-subtitle">Manage system users and permissions</p>
        </div>
        {canEdit() && (
          <button className="add-user-btn" onClick={() => setShowForm(true)}>
            <i className="fas fa-plus"></i>
            <span>Add User</span>
          </button>
        )}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
    <th>ACTIONS</th>
              </tr>
            </thead>
           <tbody>
  {users.map(u => (
    <tr key={u.id}>
      <td className="user-name">{u.fullName}</td>
      <td className="user-email">{u.email}</td>
      <td>{getRoleBadge(u.role)}</td>
      <td>{getStatusBadge(u.active)}</td>
      <td className="user-actions-cell">
        {canEdit() && (
          <div className="user-actions">
            <button className="icon-btn edit" onClick={() => openEdit(u)} title="Edit">
              <i className="fas fa-edit"></i>
            </button>
            {u.active ? (
              <button className="icon-btn deactivate" onClick={() => handleToggleActive(u.id, u.active)} title="Deactivate">
                <i className="fas fa-ban"></i>
              </button>
            ) : (
              <button className="icon-btn activate" onClick={() => handleToggleActive(u.id, u.active)} title="Activate">
                <i className="fas fa-check-circle"></i>
              </button>
            )}
            <button className="icon-btn delete" onClick={() => handleDelete(u.id, u.username)} title="Delete">
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        )}
      </td>
    </tr>
  ))}
</tbody>
          </table>
          {users.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-users-slash"></i>
              <p>No users found</p>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={hideConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmVariant={confirmState.variant}
      />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New User" size="md">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormInput label="Full Name" name="fullName" value={form.fullName} onChange={(val) => setForm({...form, fullName: val})} required />
            <FormInput label="Username" name="username" value={form.username} onChange={(val) => setForm({...form, username: val})} required />
            <FormInput label="Email" name="email" type="email" value={form.email} onChange={(val) => setForm({...form, email: val})} required />
            <FormInput label="Password" name="password" type="password" value={form.password} onChange={(val) => setForm({...form, password: val})} required />
            <FormInput label="Role" name="role" value={form.role} onChange={(val) => setForm({...form, role: val})} options={[
              { value: 'ADMIN', label: 'ADMIN' },
              { value: 'MANAGER', label: 'MANAGER' },
              { value: 'RESPONSABLE', label: 'RESPONSABLE' }
            ]} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <SaveButton>Create User</SaveButton>
              <CancelButton onClick={() => setShowForm(false)}>Cancel</CancelButton>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showEditForm} onClose={() => { setShowEditForm(false); setEditUser(null); }} title="Edit User" size="md">
        <form onSubmit={handleEditSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormInput label="Full Name" name="fullName" value={form.fullName} onChange={(val) => setForm({...form, fullName: val})} required />
            <FormInput label="Username" name="username" value={form.username} onChange={(val) => setForm({...form, username: val})} required />
            <FormInput label="Email" name="email" type="email" value={form.email} onChange={(val) => setForm({...form, email: val})} required />
            <FormInput label="Password (leave empty to keep unchanged)" name="password" type="password" value={form.password} onChange={(val) => setForm({...form, password: val})} />
            <FormInput label="Role" name="role" value={form.role} onChange={(val) => setForm({...form, role: val})} options={[
              { value: 'ADMIN', label: 'ADMIN' },
              { value: 'MANAGER', label: 'MANAGER' },
              { value: 'RESPONSABLE', label: 'RESPONSABLE' }
            ]} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <SaveButton>Update User</SaveButton>
              <CancelButton onClick={() => { setShowEditForm(false); setEditUser(null); }}>Cancel</CancelButton>
            </div>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}

export default Users;
