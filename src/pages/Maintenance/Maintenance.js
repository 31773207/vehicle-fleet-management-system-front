import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import { useToast } from "../../contexts/ToastContext";
import { useMaintenances } from "../../hooks/useMaintenances";
import { filterMaintenances } from "../../utils/maintenance.utils";
import { MaintenanceModal } from "../../components/common/MaintenanceModal";
import {
  AddButton,
  EditButton,
  DeleteButton,
  StartWorkButton,
  CompleteWorkButton
} from "../../components/common/Button";
import { FilterBar } from "../../components/common/FilterBar";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { canEdit } from "../../utils/roles";
import "./Maintenance.css";
import { useConfirm } from '../../hooks/useConfirm';

const STATUS_FLOW = {
  SCHEDULED:   { nextStatus: "IN_PROGRESS", label: "Start Work", btnColor: "#17a2b8", icon: "fa-play" },
  IN_PROGRESS: { nextStatus: "COMPLETED",   label: "Mark Complete", btnColor: "#28a745", icon: "fa-flag-checkered" },
  COMPLETED:   null,
};

function Maintenance() {
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    maintenances,
    vehicles,
    loading,
    fetchMaintenances,
    fetchVehicles,
    updateMaintenance,
    deleteMaintenance
  } = useMaintenances();

  const [showForm, setShowForm] = useState(false);
  const [editMaintenance, setEditMaintenance] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ✅ Use the confirm hook
  const { confirmState, showConfirm, hideConfirm } = useConfirm();

  useEffect(() => {
    fetchMaintenances();
    fetchVehicles();
  }, [fetchMaintenances, fetchVehicles]);

  // URL param pre-fill from notification
  useEffect(() => {
    const vehicleId = searchParams.get("vehicleId");
    if (vehicleId && vehicles.length > 0) {
      setEditMaintenance({ vehicle: { id: vehicleId }, status: "IN_PROGRESS" });
      setShowForm(true);
      setSearchParams({});
    }
  }, [vehicles, searchParams, setSearchParams]);

 const handleAdvanceStatus = async (m) => {
  console.log("Button clicked - Current status:", m.status);
  
  if (m.status === "SCHEDULED") {
    // Start Work - change to IN_PROGRESS
    try {
      await updateMaintenance(m.id, { ...m, status: "IN_PROGRESS" });
      await fetchMaintenances();
      addToast("✅ Work started successfully", "success");
    } catch (error) {
      console.error("Error:", error);
      addToast("❌ Error starting work", "error");
    }
  } 
  else if (m.status === "IN_PROGRESS") {
    // ✅ Complete Work - directly change to COMPLETED
    try {
      await updateMaintenance(m.id, { ...m, status: "COMPLETED" });
      await fetchMaintenances();
      addToast("✅ Maintenance completed successfully", "success");
    } catch (error) {
      console.error("Error:", error);
      addToast("❌ Error completing maintenance", "error");
    }
  }
};

  // ✅ Use showConfirm for delete
  const handleDelete = (id, plateNumber) => {
    showConfirm(
      "Delete Maintenance",
      `Delete maintenance record for vehicle "${plateNumber}"?`,
      async () => {
        await deleteMaintenance(id);
        await fetchMaintenances();
        //addToast(`✅ Maintenance record for ${plateNumber} deleted`, "success");
      },
      "danger"
    );
  };

  // ✅ Add handleEdit function
  const handleEdit = (maintenance) => {
    setEditMaintenance(maintenance);
    setShowForm(true);
  };

  const filtered = filterMaintenances(maintenances, search, filter);

  const counts = {
    IN_PROGRESS: maintenances.filter(m => m.status === "IN_PROGRESS").length,
    SCHEDULED: maintenances.filter(m => m.status === "SCHEDULED").length,
    COMPLETED: maintenances.filter(m => m.status === "COMPLETED").length,
  };
  const totalCost = maintenances
    .filter(m => m.status === "COMPLETED")
    .reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);

  const columns = [
    { key: "id", label: "ID", width: "55px" },
    { key: "vehicle", label: "Vehicle", render: (v) => <strong style={{ color: "#17a2b8" }}>{v?.plateNumber || "—"}</strong> },
    { key: "maintenanceType", label: "Type" },
    { key: "startDate", label: "Start" },
    { key: "endDate", label: "End", render: (v) => v || <span style={{ color: "rgba(255,255,255,0.3)" }}>Ongoing</span> },
    { key: "cost", label: "Cost (DZD)", render: (v) => v ? parseFloat(v).toLocaleString("fr-DZ") : "—" },
    { key: "status", label: "Status", render: (v) => <Badge status={v} /> },
    {
  key: "actions", 
  label: "Actions", 
  render: (_, row) => {
    if (!canEdit()) return <span style={{ color: '#888' }}>—</span>;
    const flow = STATUS_FLOW[row.status];
    return (
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        {flow && flow.nextStatus === "IN_PROGRESS" && (
          <StartWorkButton 
            onClick={() => handleAdvanceStatus(row)} 
            title="Start Work"
          />
        )}
        {flow && flow.nextStatus === "COMPLETED" && (
          <CompleteWorkButton 
            onClick={() => handleAdvanceStatus(row)} 
            title="Mark Complete"
          />
        )}
        <EditButton onClick={() => handleEdit(row)} title="Edit Maintenance" />
        <DeleteButton 
          onClick={() => handleDelete(row.id, row.vehicle?.plateNumber)} 
          itemName={`maintenance record for ${row.vehicle?.plateNumber}`}
          title="Delete Maintenance"
        />
      </div>
    );
  }
}
  ];

  return (
    <PageLayout>
      <div className="content-header">
        <h2 className="content-header">Maintenance</h2>
        {canEdit() && <AddButton onClick={() => { setEditMaintenance(null); setShowForm(true); }}>+ Add Maintenance</AddButton>}
        
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        <SummaryCard icon="fa-spinner" color="#17a2b8" label="In Progress" value={counts.IN_PROGRESS} />
        <SummaryCard icon="fa-calendar" color="#fbbc04" label="Scheduled" value={counts.SCHEDULED} />
        <SummaryCard icon="fa-check-double" color="#28a745" label="Completed" value={counts.COMPLETED} />
        <SummaryCard icon="fa-coins" color="#FFD700" label="Total Cost" value={`${totalCost.toLocaleString("fr-DZ")} DZD`} />
      </div>

      <FilterBar
        filters={["All", "IN_PROGRESS", "SCHEDULED", "COMPLETED"]}
        activeFilter={filter}
        onFilterChange={setFilter}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {loading ? <LoadingSpinner /> : (
        <div className="card">
          <DataTable columns={columns} data={filtered} emptyMessage="No maintenance records found" />
        </div>
      )}

      {/* ✅ Use confirmState from useConfirm */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={hideConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmVariant={confirmState.variant}
      />

      <MaintenanceModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditMaintenance(null); }}
        onSuccess={() => { fetchMaintenances(); setShowForm(false); setEditMaintenance(null); }}
        initialData={editMaintenance}
        vehicles={vehicles}
      />
    </PageLayout>
  );
}

function SummaryCard({ icon, color, label, value }) {
  return (
    <div style={{
      background: "rgba(0,0,0,0.4)", borderRadius: 10,
      padding: "14px 16px",
      border: `1px solid ${color}33`,
      borderLeft: `3px solid ${color}`,
      backdropFilter: "blur(8px)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{label}</span>
        <i className={`fas ${icon}`} style={{ color, fontSize: 14 }}></i>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

export default Maintenance;
