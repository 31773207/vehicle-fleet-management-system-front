import { useState, useCallback } from "react";
import { useToast } from "../contexts/ToastContext";
import {
  getTechnicalChecks,
  createTechnicalCheck,
  updateTechnicalCheck,
  deleteTechnicalCheck,
  getExpiringSoon,
  getVehicles
} from "../services/technical-checks.service";

export const useTechnicalChecks = () => {
  const [checks, setChecks] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const fetchChecks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTechnicalChecks();
      setChecks(res.data);
    } catch {
      addToast("Error fetching technical checks", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch {
      console.error("Error fetching vehicles");
    }
  }, []);

  const fetchExpiringSoon = useCallback(async () => {
    try {
      const res = await getExpiringSoon();
      setExpiringSoon(res.data);
    } catch {
      console.error("Error fetching expiring checks");
    }
  }, []);

  const addCheck = async (data) => {
    try {
      const res = await createTechnicalCheck(data);
      setChecks((prev) => [...prev, res.data]);
      addToast("Technical check created", "success");
      return res;
    } catch (err) {
      addToast(err.response?.data?.message || "Error creating check", "error");
      throw err;
    }
  };

  const editCheck = async (id, data) => {
    try {
      const res = await updateTechnicalCheck(id, data);
      setChecks((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      addToast("Technical check updated", "success");
      return res;
    } catch (err) {
      addToast(err.response?.data?.message || "Error updating check", "error");
      throw err;
    }
  };

  const removeCheck = async (id) => {
    try {
      await deleteTechnicalCheck(id);
      setChecks((prev) => prev.filter((c) => c.id !== id));
      addToast("Technical check deleted", "success");
    } catch {
      addToast("Error deleting check", "error");
      throw new Error("Delete failed");
    }
  };

  return {
    checks,
    vehicles,
    expiringSoon,
    loading,
    fetchChecks,
    fetchVehicles,
    fetchExpiringSoon,
    createCheck: addCheck,
    updateCheck: editCheck,
    deleteCheck: removeCheck
  };
};