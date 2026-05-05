import api from "../services/api";
//UI logic only, NOT API calls
export const useApi = () => {

  const getEmployees = () => api.get("/employees");
  const getVehicles = () => api.get("/vehicles");
  const getOrganizations = () => api.get("/organizations");

  const getManageHistory = (id) =>
    api.get(`/manage/history/employee/${id}`);

  const createEmployee = (data) =>
    api.post("/employees", data);

  const updateEmployee = (id, data) =>
    api.put(`/employees/${id}`, data);

  const deleteEmployee = (id) =>
    api.delete(`/employees/${id}`);

  const assignVehicle = (employeeId, vehicleId, data) =>
    api.post(`/employees/${employeeId}/assign-vehicle/${vehicleId}`, data);

  const removeVehicle = (employeeId) =>
    api.delete(`/employees/${employeeId}/remove-vehicle`);

  const fetchEmployees = async () => {
    try { const res = await api.get('/employees'); setEmployees(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchVehicles = async () => {
    try { const res = await api.get('/vehicles'); setVehicles(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchOrganizations = async () => {
    try { const res = await api.get('/organizations'); setOrganizations(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchManageHistory = async (id) => {
    try {
      const res = await api.get(`/manage/history/employee/${id}`);
      const all = res.data || [];
      const current = all.find(m => m.removedAt === null);
      const history = all.filter(m => m.removedAt !== null).sort((a, b) => new Date(b.removedAt) - new Date(a.removedAt));
      setManageHistory(prev => ({ ...prev, [id]: { current, history } }));
    } catch { }
  };


  return {
    getEmployees,
    getVehicles,
    getOrganizations,
    getManageHistory,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    assignVehicle,
    removeVehicle,
  };
};