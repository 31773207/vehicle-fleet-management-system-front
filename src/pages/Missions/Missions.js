import React, { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import { useMissions } from "../../hooks/useMissions";
import { filterMissions, buildDriverOptions, buildVehicleOptions, buildOrgOptions } from "../../utils/missions.utils";
import { useToast } from "../../contexts/ToastContext";
import { FilterBar } from "../../components/common/FilterBar";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { canEdit } from "../../utils/roles";
import api from "../../services/api";
import { useConfirm } from '../../hooks/useConfirm';
import { MissionFormModal } from "../../components/common/MissionFormModal";
import { CompleteMissionModal } from "../../components/common/CompleteMissionModal";
import { 
  AddButton, 
  DeleteButton, 
  EditButton, 
  StartButton, 
  CancelIconButton, 
  CompleteButton 
} from "../../components/common/Button";
import "./Missions.css";


function Missions() {
  const {
    missions,
    availableDrivers,
    availableVehicles,
    organizations,
    loading,
    fetchMissions,
    fetchAvailableDrivers,
    fetchAvailableVehicles,
    fetchOrganizations,
    createMission,
        updateMission,  // ✅ Make sure this exists in useMissions
    deleteMission,
    changeStatus,
    completeMission
  } = useMissions();

  const { addToast } = useToast();
  const { confirmState, showConfirm, hideConfirm } = useConfirm();

  const [showForm, setShowForm] = useState(false);
    const [editMission, setEditMission] = useState(null);  // ✅ Add edit state
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeMissionId, setCompleteMissionId] = useState(null);
  const [orderedDrivers, setOrderedDrivers] = useState([]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const handleOpenForm = async () => {
    await fetchAvailableDrivers();
    await fetchAvailableVehicles();
    await fetchOrganizations();
    const res = await api.get('/missions/available-drivers/ordered');
    setOrderedDrivers(res.data);
        setEditMission(null);  // ✅ Reset edit mode
    setShowForm(true);
  };
  // ✅ Add handleEdit function
  const handleEdit = async (mission) => {
    await fetchAvailableDrivers();
    await fetchAvailableVehicles();
    await fetchOrganizations();
    const res = await api.get('/missions/available-drivers/ordered');
    setOrderedDrivers(res.data);
    setEditMission(mission);
    setShowForm(true);
  };

  // ✅ Use showConfirm for delete
  const handleDelete = (id, missionName) => {
    showConfirm(
      'Delete Mission',
      `Delete mission "${missionName}"?`,
      async () => {
        await deleteMission(id);
        await fetchMissions();
        //addToast(`✅ Mission ${missionName} deleted`, 'success');
      },
      'danger'
    );
  };

   // ✅ Handle form success (for both create and edit)
  const handleFormSuccess = () => {
    fetchMissions();
    setShowForm(false);
    setEditMission(null);
  };

  const openCompleteModal = (id) => {
    setCompleteMissionId(id);
    setShowCompleteModal(true);
  };

  const handleComplete = async (id, km) => {
    await completeMission(id, km);
    setShowCompleteModal(false);
    setCompleteMissionId(null);
    addToast(` Mission completed`, 'success');
  };

  const filtered = filterMissions(missions, search, filter);

  const driverOptions = buildDriverOptions(orderedDrivers.length > 0 ? orderedDrivers : availableDrivers);
  const vehicleOptions = buildVehicleOptions(availableVehicles);
  const orgOptions = buildOrgOptions(organizations);

  const columns = [
    { key: 'id', label: 'ID', render: (value, row) => (
      <div>
        <span className="mission-id">{value}</span>
        {row.assignedAt && <div className="mission-timestamp">{new Date(row.assignedAt).toLocaleDateString()}</div>}
      </div>
    ) },
    { key: 'departLocation', label: 'Depart', render: (value) => value || "—" },
    { key: 'destination', label: 'Destination' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'organization', label: 'Organization', render: (value) => value?.name || "—" },
    { key: 'driver', label: 'Driver', render: (value) => <strong>{value?.firstName} {value?.lastName}</strong> },
    { key: 'vehicle', label: 'Vehicle', render: (value) => value?.plateNumber },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'missionType', label: 'Type', render: (value) => <span className={`mission-badge badge-${value?.toLowerCase()}`}>{value}</span> },
    { key: 'status', label: 'Status', render: (value) => <Badge status={value} /> },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, row) => !canEdit() ? <span style={{ color: '#888' }}>—</span> : (
        <div className="action-buttons">
          {/* ✅ Add Edit Button for all statuses */}
      <EditButton onClick={() => handleEdit(row)} title="Edit Mission" />
          
          {(row.status === "COMPLETED" || row.status === "CANCELLED") && (
            <DeleteButton 
              onClick={() => handleDelete(row.id, row.destination || `Mission #${row.id}`)} 
              itemName={`mission`}   title="Delete Mission"  // ✅ ADD THIS

            />
          )}
              {/* ✅ START button */}

          {row.status === "PLANNED" && (
            <>
     <StartButton onClick={() => changeStatus(row.id, "start")} title="Start Mission" />
<CancelIconButton onClick={() => changeStatus(row.id, "cancel")} title="Cancel Mission" />
 <DeleteButton onClick={() => handleDelete(row.id, row.destination || `Mission #${row.id}`)} title="Delete Mission" />
  </>
          )}

              {/* ✅ COMPLETE button */}
          {row.status === "IN_PROGRESS" && (
            <>
    <CompleteButton onClick={() => openCompleteModal(row.id)} title="Complete Mission" />
     <CancelIconButton onClick={() => changeStatus(row.id, "cancel")} title="Cancel Mission" />
               <DeleteButton onClick={() => handleDelete(row.id, row.destination || `Mission #${row.id}`)} title="Delete Mission" />
  </>
          )}
          
          
        </div>
      )
    }
  ];



  return (
    <PageLayout>
      <div className="content-header">
        <h2>Missions</h2>
        {canEdit() && <AddButton onClick={handleOpenForm}>+ New Mission</AddButton>}
      </div>

      <div className="content-body">
        <FilterBar
          filters={["All", "PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]}
          activeFilter={filter}
          onFilterChange={setFilter}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by destination or driver..."
        />

        {loading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} emptyMessage="No missions found" />}
      </div>

      {/* ✅ Use confirmState from useConfirm */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={hideConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmVariant={confirmState.variant}
      />

      <MissionFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
                initialData={editMission}  
        onSuccess={() => { fetchMissions(); setShowForm(false); }}
        driverOptions={driverOptions}
        vehicleOptions={vehicleOptions}
        orgOptions={orgOptions}
      />

      <CompleteMissionModal
        isOpen={showCompleteModal}
        onClose={() => { setShowCompleteModal(false); setCompleteMissionId(null); }}
        onComplete={handleComplete}
        missionId={completeMissionId}
      />
    </PageLayout>
  );
}

export default Missions;
