import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { AddButton, EditButton, DeleteButton } from '../../components/common/Button';
import { FilterBar } from '../../components/common/FilterBar';
import { EmployeeFormModal } from '../../components/common/EmployeeFormModal';
import { VehicleAssignmentModal } from '../../components/common/VehicleAssignmentModal';
import { useEmployees } from "../../hooks/useEmployees";
import { canEdit } from "../../utils/roles";
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../contexts/ToastContext';
import {
  splitEmployees,
  filterDrivers,
  filterEmployees,
  showDrivers,
  showEmployees,
  getInitials,
  getDisplayId,
  getStatusClass,
  getStatusText,
} from "../../utils/drivers.utils";
import './Drivers.css';

function Drivers() {
  const { addToast } = useToast();
  const { confirmState, showConfirm, hideConfirm } = useConfirm();
  
  const {
    employees,
    vehicles,
    organizations,
    manageHistory,
    fetchEmployees,
    fetchVehicles,
    fetchOrganizations,
    fetchEmployeeHistory,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    assignVehicle,
    removeVehicle
  } = useEmployees();

  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState('history');

  // LOAD DATA
  useEffect(() => {
    fetchEmployees();
    fetchVehicles();
    fetchOrganizations();
  }, []);

  useEffect(() => {
    employees.forEach(e => fetchEmployeeHistory(e.id));
  }, [employees]);

  const refreshAllData = async () => {
    await fetchEmployees();
    await fetchVehicles();
    employees.forEach(e => fetchEmployeeHistory(e.id));
  };

  const { drivers, emps } = splitEmployees(employees);
  const filteredDrivers = filterDrivers(drivers, search, filter);
  const filteredEmployees = filterEmployees(emps, search, filter);
  const canShowDrivers = showDrivers(filter);
  const canShowEmployees = showEmployees(filter);

  const handleSuccess = () => {
    fetchEmployees();
    setShowForm(false);
    setEditEmployee(null);
     //addToast(`Employee ${form.firstName} ${form.lastName} saved successfully`, 'success'); 
  };

  const handleAssignSuccess = () => {
    fetchEmployees();
    fetchVehicles();
    setShowAssignModal(false);
    setSelectedEmployee(null);
  };

  const handleRemove = (employeeId, employeeName) => {
    showConfirm(
      'Remove Vehicle',
      `Remove vehicle from ${employeeName}?`,
      async () => {
        await removeVehicle(employeeId);
        await refreshAllData();
        //addToast(`✅ Vehicle removed from ${employeeName}`, 'success');
      },
      'warning'
    );
  };

  const handleDeleteEmployeeConfirm = (id, name) => {
    showConfirm(
      'Delete Employee',
      `Delete employee "${name}"?`,
      async () => {
        await deleteEmployee(id);
        await fetchEmployees();
        //addToast(`✅ Employee ${name} deleted`, 'success');
      },
      'danger'
    );
  };

  const openHistory = (person) => {
    setSelectedEmployee(person);
    setModalMode('history');
    setShowAssignModal(true);
  };

  const openAssign = (person) => {
    setSelectedEmployee(person);
    setModalMode('assign');
    setShowAssignModal(true);
  };

  // Employee Card Component
  const EmployeeCard = ({ person, type }) => {
    const hist = manageHistory[person.id] || { current: null, history: [] };
    const hasCurrent = !!hist.current;

    return (
      <div className="driver-card">
        <div className="card-top">
          <div className="avatar">
            <div className="avatar-initials">{getInitials(person.firstName, person.lastName)}</div>
          </div>
          <div className="driver-name">{person.firstName} {person.lastName}</div>
          <div className="badges">
            <span className="badge-id">{getDisplayId(person)}</span>
            <span className={`badge-status ${getStatusClass(person)}`}>{getStatusText(person)}</span>
          </div>
        </div>

        <div className="card-info">
          <div className="info-row"><i className="fas fa-phone"></i> {person.phone}</div>
          <div className="info-row"><i className="fas fa-envelope"></i> {person.email}</div>
          {type === 'DRIVER' && (
            <>
              <div className="info-row"><i className="fas fa-id-card"></i> {person.licenseNumber}</div>
              <div className="info-row"><i className="fas fa-calendar-alt"></i> Exp: {person.licenseExpiry}</div>
            </>
          )}
          <div className="info-row"><i className="fas fa-building"></i> {person.organization?.name || 'No Organization'}</div>
        </div>

        <div className="vehicle-section">
          <div className="vehicle-section-header">
            <span className="vehicle-section-title"><i className="fas fa-car"></i> Vehicle Assignment</span>
            <button className="btn-history" onClick={() => openHistory(person)}>
              <i className="fas fa-history"></i> History
            </button>
            {type === 'EMPLOYEE' && (
              <button className="btn-assign" onClick={() => openAssign(person)}>
                <i className="fas fa-plus"></i> Assign
              </button>
            )}
          </div>
          {hasCurrent ? (
            <div className="current-assignment active">
              <div className="current-assignment-header">
                <span className="vehicle-plate">{hist.current.vehicle?.plateNumber}</span>
              </div>
              <div className="current-assignment-details">
                <span className="vehicle-model">{hist.current.vehicle?.brand?.brandName} {hist.current.vehicle?.model}</span>
                <div className="assignment-dates" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#28a745' }}>
                    <i className="fas fa-calendar"></i> 
                    {hist.current.assignedAt ? new Date(hist.current.assignedAt).toLocaleDateString() : 'N/A'}
                  </span>
                  {hist.current.endDate && (
                    <>
                      <span>→</span>
                      <span style={{ color: '#ffc107' }}>
                        <i className="fas fa-calendar-alt"></i> 
                        {new Date(hist.current.endDate).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="current-assignment empty">
              <span className="empty-icon"><i className="fas fa-ban"></i></span>
              <span>No vehicle currently assigned</span>
            </div>
          )}
        </div>

        {canEdit() && (
          <div className="card-buttons">
            <EditButton onClick={() => { setEditEmployee(person); setShowForm(true); }} />
            <DeleteButton 
              onClick={() => handleDeleteEmployeeConfirm(person.id, `${person.firstName} ${person.lastName}`)} 
              itemName={`${person.firstName} ${person.lastName}`}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="content-header">
        <h2 >Employees</h2>
        {canEdit() && (
          <AddButton onClick={() => { setShowForm(true); setEditEmployee(null); }}>
            + Add Employee
          </AddButton>
        )}
      </div>

      <div className="content-body">
        <FilterBar
          filters={['All', 'Driver', 'Employee', 'Available', 'On Route']}
          activeFilter={filter}
          onFilterChange={setFilter}
          searchValue={search}
          onSearchChange={setSearch}
        />

        {/* DRIVERS SECTION */}
        {canShowDrivers && filteredDrivers.length > 0 && (
          <>
            <div className="title">
              <h3>Drivers</h3>
              <span className="section-count">{filteredDrivers.length}</span>
            </div>
            <div className="cards-grid">
              {filteredDrivers.map(d => (
                <EmployeeCard key={d.id} person={d} type="DRIVER" />
              ))}
            </div>
          </>
        )}

        {/* EMPLOYEES SECTION */}
        {canShowEmployees && filteredEmployees.length > 0 && (
          <>
            <div className="title">
              <h3>Employees</h3>
              <span className="section-count">{filteredEmployees.length}</span>
            </div>
            <div className="cards-grid">
              {filteredEmployees.map(e => (
                <EmployeeCard key={e.id} person={e} type="EMPLOYEE" />
              ))}
            </div>
          </>
        )}

        {filteredDrivers.length === 0 && filteredEmployees.length === 0 && (
          <div className="empty-state">
            <p><i className="fas fa-inbox"></i> No results found</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={hideConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmVariant={confirmState.variant}
      />

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditEmployee(null); }}
        onSuccess={handleSuccess}
        employee={editEmployee}
        organizations={organizations}
      />

      {/* Vehicle Assignment Modal */}
      <VehicleAssignmentModal
        isOpen={showAssignModal}
        onClose={() => { setShowAssignModal(false); setSelectedEmployee(null); }}
        onAssign={assignVehicle}
        onRemove={handleRemove}
        employee={selectedEmployee}
        vehicles={vehicles}
        manageHistory={manageHistory}
        onRefresh={refreshAllData}
        mode={modalMode}
      />
    </PageLayout>
  );
}

export default Drivers;
