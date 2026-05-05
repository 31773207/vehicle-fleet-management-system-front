import { useState, useCallback } from "react";
import { useToast } from "../contexts/ToastContext";
import api from "../services/api";

export const useGasCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const { addToast } = useToast();

  // Fetch all coupon batches
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/gas-coupons");
      setCoupons(res.data);
    } catch (err) {
      addToast("Error fetching coupons", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Fetch available quantity
  const fetchAvailableQuantity = useCallback(async () => {
    try {
      const res = await api.get("/gas-coupons/available-quantity");
      setAvailableQuantity(res.data);
    } catch (err) {
      console.error("Error fetching available quantity");
    }
  }, []);

  // Buy coupons (bulk)
  const buyCoupons = useCallback(async (quantity, fuelAmount, expiryDate) => {
    try {
      const res = await api.post("/gas-coupons/buy", null, {
        params: { quantity, fuelAmount, expiryDate }
      });
      addToast(`✅ ${quantity} coupons purchased!`, "success");
      return res.data;
    } catch (err) {
      addToast(err.response?.data?.message || "Error buying coupons", "error");
      throw err;
    }
  }, [addToast]);

  // Assign coupons
  const assignCoupons = useCallback(async (quantity) => {
    try {
      const res = await api.post(`/gas-coupons/assign?quantity=${quantity}`);
      addToast(`✅ ${quantity} coupons assigned!`, "success");
      return res.data;
    } catch (err) {
      addToast(err.response?.data?.message || "Error assigning coupons", "error");
      throw err;
    }
  }, [addToast]);

  // Use coupons
  const useCoupons = useCallback(async (quantity) => {
    try {
      const res = await api.post(`/gas-coupons/use?quantity=${quantity}`);
      addToast(`✅ ${quantity} coupons used!`, "success");
      return res.data;
    } catch (err) {
      addToast(err.response?.data?.message || "Error using coupons", "error");
      throw err;
    }
  }, [addToast]);

  // Delete batch
  const deleteBatch = useCallback(async (id) => {
    try {
      await api.delete(`/gas-coupons/${id}`);
      addToast(`✅ Batch deleted`, "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Error deleting batch", "error");
      throw err;
    }
  }, [addToast]);
  // Change from useCoupons to applyCoupons or consumeCoupons
const applyCoupons = useCallback(async (quantity) => {
  try {
    const res = await api.post(`/gas-coupons/use?quantity=${quantity}`);
    addToast(`✅ ${quantity} coupons used!`, "success");
    return res.data;
  } catch (err) {
    addToast(err.response?.data?.message || "Error using coupons", "error");
    throw err;
  }
}, [addToast]);

// In useGasCoupons.js
const consumeCoupons = useCallback(async (quantity) => {
  try {
    const res = await api.post(`/gas-coupons/use?quantity=${quantity}`);
    addToast(`✅ ${quantity} coupons used!`, "success");
    return res.data;
  } catch (err) {
    addToast(err.response?.data?.message || "Error using coupons", "error");
    throw err;
  }
}, [addToast]);

// In return
return {
  coupons,
  loading,
  availableQuantity,
  fetchCoupons,
  fetchAvailableQuantity,
  buyCoupons,
  assignCoupons,
  consumeCoupons,  // ✅ Make sure this is here
  deleteBatch
};
};

export default useGasCoupons;
