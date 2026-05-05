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
      // ✅ FIX: Ensure data is an array
      const data = res.data;
      if (Array.isArray(data)) {
        setMaintenances(data);
      } else if (data && typeof data === 'object') {
        // If response is an object with content property or similar
        setMaintenances(data.content || []);
      } else {
        setMaintenances([]);
      }
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      setMaintenances([]);
      addToast("Error fetching maintenances", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await getVehicles();
      // ✅ FIX: Ensure vehicles is an array
      const data = res.data;
      if (Array.isArray(data)) {
        setVehicles(data);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setVehicles([]);
    }
  }, []);

  // ================= MUTATIONS =================

  const addMaintenance = async (data) => {
    try {
      const res = await createMaintenance(data);
      setMaintenances((prev) => Array.isArray(prev) ? [...prev, res.data] : [res.data]);
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
      setMaintenances((prev) => 
        Array.isArray(prev) 
          ? prev.map((m) => (m.id === id ? res.data : m))
          : [res.data]
      );
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
      setMaintenances((prev) => Array.isArray(prev) ? prev.filter((m) => m.id !== id) : []);
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

