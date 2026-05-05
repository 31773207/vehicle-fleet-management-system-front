import api from "./api";
//Only API calls.
//==controlers

// ================= EMPLOYEES =================

export const getEmployees = () => api.get("/employees");
export const getAllDrivers = () => api.get("/employees/drivers");
export const getAllEmployeesOnly = () => api.get("/employees/employees-only");

export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post("/employees", data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// ================= DRIVERS =================

export const getDrivers = () => api.get("/drivers");
export const getAvailableDrivers = () => api.get("/drivers/available");

export const createDriver = (data) => api.post("/drivers", data);
export const updateDriver = (id, data) => api.put(`/drivers/${id}`, data);
export const deleteDriver = (id) => api.delete(`/drivers/${id}`);

// ================= VEHICLE ASSIGNMENT =================

export const assignVehicle = (employeeId, vehicleId, data) =>
  api.post(`/employees/${employeeId}/assign-vehicle/${vehicleId}`, data);

export const removeVehicle = (employeeId) =>
  api.delete(`/employees/${employeeId}/remove-vehicle`);

export const getEmployeeHistory = (id) =>
  api.get(`/manage/history/employee/${id}`);

export const getVehicles = () => api.get("/vehicles"); // ✅ correct

export const getOrganizations = () => api.get("/organizations");