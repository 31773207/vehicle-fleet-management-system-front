// ================= FILTERING =================

export const filterMaintenances = (maintenances, search, filter) => {
  return maintenances.filter((m) => {
    const match = `${m.maintenanceType} ${m.vehicle?.plateNumber || ""} ${m.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "All") return match;
    return m.status === filter && match;
  });
};

// ================= FORM HELPERS =================

export const getInitialForm = () => ({
  startDate: "",
  endDate: "",
  maintenanceType: "",
  cost: "",
  description: "",
  status: "SCHEDULED",
  vehicleId: ""
});

export const mapMaintenanceToForm = (m) => ({
  startDate: m.startDate || "",
  endDate: m.endDate || "",
  maintenanceType: m.maintenanceType || "",
  cost: m.cost || "",
  description: m.description || "",
  status: m.status || "SCHEDULED",
  vehicleId: m.vehicle?.id || ""
});

export const buildVehicleOptions = (vehicles) =>
  vehicles.map((v) => ({
    value: v.id,
    label: `${v.plateNumber} - ${v.model}`
  }));

