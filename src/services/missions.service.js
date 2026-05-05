import api from "./api";

// ================= MISSIONS =================

export const getMissions = () => api.get("/missions");
export const getMissionById = (id) => api.get(`/missions/${id}`);
export const getMissionsByStatus = (status) => api.get(`/missions/status/${status}`);

export const createMission = (data) => api.post("/missions", data);
export const updateMission = (id, data) => api.put(`/missions/${id}`, data);
export const deleteMission = (id) => api.delete(`/missions/${id}`);

// ================= STATUS ACTIONS =================

export const startMission = (id) => api.patch(`/missions/${id}/start`);
export const cancelMission = (id) => api.patch(`/missions/${id}/cancel`);
export const completeMission = (id, finalKilometrage) =>
  api.patch(`/missions/${id}/complete`, { finalKilometrage });

// ================= REFERENCE DATA =================

export const getEmployees = () => api.get("/employees");
export const getVehicles = () => api.get("/vehicles");
export const getOrganizations = () => api.get("/organizations");

