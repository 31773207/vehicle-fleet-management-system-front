import { useState } from "react";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getBrands,
  createBrand,
  getVehicleTypes,
  putInMaintenance,
  reportBreakdown,
  markAvailable,
  reformVehicle
} from "../services/vehicles.service";
import { useToast } from "../contexts/ToastContext";

export const useVehicles = () => {
  // ================= STATE =================
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast(); 

  // ================= FETCHERS =================

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      addToast(" Failed to load vehicles", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await getBrands();
      setBrands(res.data);
    } catch (err) {
      addToast(" Failed to load brands", "error");
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await getVehicleTypes();
      setTypes(res.data);
    } catch (err) {
      addToast(" Failed to load vehicle types", "error");
    }
  };

  // ================= MUTATIONS =================

  const addVehicle = async (data) => {
  try {
    const res = await createVehicle(data);
    setVehicles((prev) => [...prev, res.data]);
    //addToast(`${data.plateNumber}" created successfully!`, "success");
    return res;
  } catch (err) {
    //  Get the real error message from backend
    const errorMessage = err.response?.data?.message || err.message;
    
    //  Check for duplicate plate number
    if (errorMessage.includes("Plate number already exists")) {
      //addToast(` Plate number "${data.plateNumber}" already exists! Please use a different plate number.`, "error");
    } else {
      //addToast(` Failed to create vehicle: ${errorMessage}`, "error");
          addToast(`❌ ${errorMessage}`, "error");  // UNCOMMENT THIS LINE

    }
    throw err;
  }
};

  const editVehicle = async (id, data) => {
    try {
      const res = await updateVehicle(id, data);
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? res.data : v))
      );
      //addToast(` Vehicle "${data.plateNumber}" updated successfully!`, "success");
      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      //addToast(` Failed to update vehicle: ${errorMessage}`, "error");
          addToast(`❌ ${errorMessage}`, "error");  // UNCOMMENT THIS LINE
      throw err;
    }
  };

  const removeVehicle = async (id) => {
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      //just get message from backend response
      //addToast(` Vehicle deleted successfully!`, "success");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      //addToast(` Failed to delete vehicle: ${errorMessage}`, "error");
          addToast(`❌ ${errorMessage}`, "error");  // UNCOMMENT THIS LINE
      throw err;
    }
  };

  const ensureBrand = async (brandName) => {
    if (!brandName) return null;
    const existing = brands.find(
      (b) => b.brandName.toLowerCase() === brandName.toLowerCase()
    );
    if (existing) return existing.id;
    try {
      const nb = await createBrand({ brandName, country: "" });
      await fetchBrands();
      //addToast(` Brand "${brandName}" added successfully!`, "success");
      return nb.data.id;
    } catch (err) {
      //addToast(` Failed to create brand "${brandName}"`, "error");
      throw err;
    }
  };

  const changeStatus = async (id, action) => {
    try {
      switch (action) {
        case "maintenance":
          await putInMaintenance(id);
          addToast(`Vehicle sent to maintenance!`, "info");
          break;
        case "breakdown":
          await reportBreakdown(id);
          addToast(` Vehicle breakdown reported!`, "warning");
          break;
        case "available":
          await markAvailable(id);
          addToast(` Vehicle is now AVAILABLE for use!`, "success");
          break;
        case "reform":
          await reformVehicle(id);
          addToast(` Vehicle marked as REFORMED`, "info");
          break;
        default:
          throw new Error("Unknown action");
      }
      await fetchVehicles();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      //addToast(` Failed to update status: ${errorMessage}`, "error");
          addToast(`❌ ${errorMessage}`, "error");  // UNCOMMENT THIS LINE
      throw err;
    }
  };

  // ================= RETURN =================

  return {
    vehicles,
    brands,
    types,
    loading,
    fetchVehicles,
    fetchBrands,
    fetchTypes,
    createVehicle: addVehicle,
    updateVehicle: editVehicle,
    deleteVehicle: removeVehicle,
    ensureBrand,
    changeStatus
  };
};

