import { useState, useCallback } from "react";
import { useToast } from "../contexts/ToastContext";
import {
  getMaintenances,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getVehicles
} from "../services/maintenance.service";

export const useMaintenances = () => {
  // ================= STATE =================
  const [maintenances, setMaintenances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  // ================= FETCHERS =================

  const fetchMaintenances = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMaintenances();
      setMaintenances(res.data);
    } catch {
      addToast("Error fetching maintenances", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  }, []);

  // ================= MUTATIONS =================

  const addMaintenance = async (data) => {
    try {
      const res = await createMaintenance(data);
      setMaintenances((prev) => [...prev, res.data]);
      addToast("Maintenance created", "success");
      return res;
    } catch (err) {
      addToast(err.response?.data?.message || "Error creating maintenance!", "error");
      throw err;
    }
  };

  const editMaintenance = async (id, data) => {
    try {
      const res = await updateMaintenance(id, data);
      setMaintenances((prev) => prev.map((m) => (m.id === id ? res.data : m)));
      addToast("Maintenance updated", "success");
      return res;
    } catch (err) {
      addToast(err.response?.data?.message || "Error updating maintenance!", "error");
      throw err;
    }
  };

  const removeMaintenance = async (id) => {
    try {
      await deleteMaintenance(id);
      setMaintenances((prev) => prev.filter((m) => m.id !== id));
      addToast("Record deleted", "success");
    } catch {
      addToast("Error deleting maintenance!", "error");
      throw new Error("Delete failed");
    }
  };

  // ================= RETURN =================

  return {
    // state
    maintenances,
    vehicles,
    loading,

    // fetch
    fetchMaintenances,
    fetchVehicles,

    // actions
    createMaintenance: addMaintenance,
    updateMaintenance: editMaintenance,
    deleteMaintenance: removeMaintenance
  };
};

