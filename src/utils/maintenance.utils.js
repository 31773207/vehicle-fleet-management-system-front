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

// utils/maintenance.utils.js

// Auto-fill parts based on maintenance type
export const getDefaultPartsByType = (maintenanceType) => {
  switch (maintenanceType) {
    case 'OIL_CHANGE':
      return [
        { partName: 'Oil Filter', quantity: 1, unitCost: 0, notes: '' },
        { partName: 'Engine Oil (5L)', quantity: 5, unitCost: 0, notes: '' },
        { partName: 'Drain Plug Washer', quantity: 1, unitCost: 0, notes: '' }
      ];
    case 'BRAKE_REPAIR':
      return [
        { partName: 'Brake Pads (Front)', quantity: 2, unitCost: 0, notes: '' },
        { partName: 'Brake Pads (Rear)', quantity: 2, unitCost: 0, notes: '' }
      ];
    case 'TIRE_CHANGE':
      return [
        { partName: 'Tire', quantity: 4, unitCost: 0, notes: '' }
      ];
    case 'REGULAR_SERVICE':
      return [
        { partName: 'Oil Filter', quantity: 1, unitCost: 0, notes: '' },
        { partName: 'Engine Oil', quantity: 5, unitCost: 0, notes: '' },
        { partName: 'Air Filter', quantity: 1, unitCost: 0, notes: '' },
        { partName: 'Cabin Filter', quantity: 1, unitCost: 0, notes: '' }
      ];
    case 'ENGINE_REPAIR':
      return [
        { partName: 'Engine Oil', quantity: 5, unitCost: 0, notes: '' },
        { partName: 'Oil Filter', quantity: 1, unitCost: 0, notes: '' },
        { partName: 'Spark Plugs', quantity: 4, unitCost: 0, notes: '' }
      ];
    default:
      return [];
  }
};
