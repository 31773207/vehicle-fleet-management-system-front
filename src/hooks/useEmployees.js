import { useState } from "react";
//This is where you handle state + fetching logic for employees page, so you can keep the component clean and focused on UI
import { getOrganizations } from "../services/employees.service";
import {
  getEmployees,
  getAllDrivers,
  getAllEmployeesOnly,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignVehicle,
  removeVehicle,
  getEmployeeHistory,
  getDrivers,
  getAvailableDrivers,
 getVehicles   // ❌ THIS WAS MISSING

} from "../services/employees.service";

export const useEmployees = () => {
  // ================= STATE =================
  const [employees, setEmployees] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [manageHistory, setManageHistory] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= FETCHERS =================

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    const res = await getDrivers();
    setDrivers(res.data);
  };

  const fetchAllDrivers = async () => {
    const res = await getAllDrivers();
    setDrivers(res.data);
  };

  const fetchAvailableDrivers = async () => {
    const res = await getAvailableDrivers();
    setDrivers(res.data);
  };

  const fetchEmployeeById = async (id) => {
    return await getEmployeeById(id);
  };

  const fetchVehicles = async () => {
  const res = await getVehicles();
  setVehicles(res.data);
};

  const fetchEmployeeHistory = async (id) => {
    try {
      const res = await getEmployeeHistory(id);

      const all = res.data || [];
      const current = all.find(m => m.removedAt === null);
      const history = all
        .filter(m => m.removedAt !== null)
        .sort((a, b) => new Date(b.removedAt) - new Date(a.removedAt));

      setManageHistory(prev => ({
        ...prev,
        [id]: { current, history }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= MUTATIONS =================

  const addEmployee = async (data) => {
    const res = await createEmployee(data);
    setEmployees(prev => [...prev, res.data]);
    return res;
  };

  const editEmployee = async (id, data) => {
    const res = await updateEmployee(id, data);
    setEmployees(prev =>
      prev.map(e => (e.id === id ? res.data : e))
    );
    return res;
  };

  const removeEmployee = async (id) => {
    await deleteEmployee(id);
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const assignVehicleToEmployee = async (employeeId, vehicleId, data) => {
  try {
    const res = await assignVehicle(employeeId, vehicleId, data);
    await fetchEmployees();
    await fetchVehicles();
    await fetchEmployeeHistory(employeeId);
    return res;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

const removeVehicleFromEmployee = async (employeeId) => {
  try {
    const res = await removeVehicle(employeeId);
    await fetchEmployees();
    await fetchVehicles();
    await fetchEmployeeHistory(employeeId);
    return res;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

  const fetchOrganizations = async () => {
  const res = await getOrganizations();
  setOrganizations(res.data);
};

  // ================= RETURN =================

return {
  // state
  employees,
  drivers,
  organizations,
  vehicles,
  manageHistory,
  loading,

  // fetch
  fetchEmployees,
  fetchDrivers,
  fetchAllDrivers,
  fetchAvailableDrivers,
  fetchEmployeeById,
  fetchEmployeeHistory,
  fetchVehicles,
fetchOrganizations,

  // actions (MATCH YOUR COMPONENT)
  createEmployee: addEmployee,
  updateEmployee: editEmployee,
  deleteEmployee: removeEmployee,
assignVehicle: assignVehicleToEmployee,
  removeVehicle: removeVehicleFromEmployee
};
};