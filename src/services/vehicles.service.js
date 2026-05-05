import api from "./api";

// ================= VEHICLES =================

export const getVehicles = () => api.get("/vehicles");
export const createVehicle = (data) => api.post("/vehicles", data);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

// ================= BRANDS =================

export const getBrands = () => api.get("/brands");
export const createBrand = (data) => api.post("/brands", data);

// ================= VEHICLE TYPES =================

export const getVehicleTypes = () => api.get("/vehicle-types");

// ================= STATUS ACTIONS =================

export const putInMaintenance = (id) => api.patch(`/vehicles/${id}/maintenance`);
export const reportBreakdown = (id) => api.patch(`/vehicles/${id}/breakdown`);
export const markAvailable = (id) => api.patch(`/vehicles/${id}/available`);
export const reformVehicle = (id) => api.patch(`/vehicles/${id}/reform`);

