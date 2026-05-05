import { useState, useCallback } from "react";
import { useToast } from "../contexts/ToastContext";
import {
  getMissions,
  createMission,
  deleteMission,
  startMission,
  cancelMission,
  completeMission,
  getEmployees,
  getVehicles,
  getOrganizations
} from "../services/missions.service";

export const useMissions = () => {
  // ================= STATE =================
  const [missions, setMissions] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  // ================= FETCHERS =================

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMissions();
      setMissions(res.data);
    } catch (err) {
      addToast("Error fetching missions", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchAvailableDrivers = useCallback(async () => {
    try {
      const res = await getEmployees();
      setAvailableDrivers(
        res.data.filter(
          (e) => e.employeeType === "DRIVER" && e.employeeStatus === "AVAILABLE"
        )
      );
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  }, []);

  const fetchAvailableVehicles = useCallback(async () => {
    try {
      const res = await getVehicles();
      setAvailableVehicles(res.data.filter((v) => v.status === "AVAILABLE"));
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  }, []);

  const fetchOrganizations = useCallback(async () => {
    try {
      const res = await getOrganizations();
      setOrganizations(res.data);
    } catch (err) {
      console.error("Error fetching organizations:", err);
    }
  }, []);

  // ================= MUTATIONS =================

  const addMission = async (data) => {
    try {
      const res = await createMission(data);
      setMissions((prev) => [...prev, res.data]);
      addToast("Mission created successfully", "success");
      return res;
    } catch (err) {
      addToast("Error creating mission!", "error");
      throw err;
    }
  };

  const removeMission = async (id) => {
    try {
      await deleteMission(id);
      setMissions((prev) => prev.filter((m) => m.id !== id));
      addToast("Mission deleted", "success");
    } catch (err) {
      addToast("Error deleting mission!", "error");
      throw err;
    }
  };

  const changeStatus = async (id, action) => {
    try {
      if (action === "start") {
        await startMission(id);
      } else if (action === "cancel") {
        await cancelMission(id);
      }
      await fetchMissions();
      addToast(`Mission ${action}ed`, "success");
    } catch (err) {
      addToast(`Error updating mission status!`, "error");
      throw err;
    }
  };

  const completeMissionAction = async (id, finalKilometrage) => {
    try {
      await completeMission(id, parseFloat(finalKilometrage));
      await fetchMissions();
      addToast("Mission completed successfully", "success");
    } catch (err) {
      addToast("Error completing mission!", "error");
      throw err;
    }
  };

  // ================= RETURN =================

  return {
    // state
    missions,
    availableDrivers,
    availableVehicles,
    organizations,
    loading,

    // fetch
    fetchMissions,
    fetchAvailableDrivers,
    fetchAvailableVehicles,
    fetchOrganizations,

    // actions
    createMission: addMission,
    deleteMission: removeMission,
    changeStatus,
    completeMission: completeMissionAction
  };
};

