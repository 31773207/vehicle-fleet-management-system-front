import api from "./api";

// ================= MAINTENANCE =================

export const getMaintenances = () => api.get("/maintenance");
export const getMaintenanceById = (id) => api.get(`/maintenance/${id}`);
export const createMaintenance = (data) => api.post("/maintenance", data);
export const updateMaintenance = (id, data) => api.put(`/maintenance/${id}`, data);
export const deleteMaintenance = (id) => api.delete(`/maintenance/${id}`);

// ================= REFERENCE DATA =================

export const getVehicles = () => api.get("/vehicles");

