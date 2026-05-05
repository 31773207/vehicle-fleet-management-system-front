import api from "./api";

export const getTechnicalChecks = () => api.get("/technical-checks");
export const getTechnicalCheckById = (id) => api.get(`/technical-checks/${id}`);
export const createTechnicalCheck = (data) => api.post("/technical-checks", data);
export const updateTechnicalCheck = (id, data) => api.put(`/technical-checks/${id}`, data);
export const deleteTechnicalCheck = (id) => api.delete(`/technical-checks/${id}`);
export const getExpiringSoon = () => api.get("/technical-checks/expiring-soon");
export const getVehicles = () => api.get("/vehicles");