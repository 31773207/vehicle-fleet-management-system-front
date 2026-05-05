export const filterChecks = (checks, search, filter) => {
  return checks.filter((c) => {
    const match = `${c.vehicle?.plateNumber || ""} ${c.center || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "All") return match;
    if (filter === "EXPIRING_SOON") {
      const expiryDate = new Date(c.expiryDate);
      const today = new Date();
      const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 15 && match;
    }
    return c.status === filter && match;
  });
};

export const getInitialForm = () => ({
  checkDate: new Date().toISOString().split("T")[0],
  expiryDate: "",
  center: "",
  notes: "",
  vehicleId: ""
});

export const mapCheckToForm = (check) => ({
  checkDate: check.checkDate || "",
  expiryDate: check.expiryDate || "",
  center: check.center || "",
  notes: check.notes || "",
  vehicleId: check.vehicle?.id || ""
});

export const buildVehicleOptions = (vehicles) => [
  { value: "", label: "Select Vehicle" },
  ...vehicles.map((v) => ({
    value: v.id,
    label: `${v.plateNumber} - ${v.brand?.brandName} ${v.model}`
  }))
];

export const getStatusColor = (status) => {
  switch (status) {
    case "VALID": return "#28a745";
    case "EXPIRED": return "#dc3545";
    case "FAILED": return "#fbbc04";
    default: return "#6c757d";
  }
};

export const isExpiringSoon = (expiryDate) => {
  if (!expiryDate) return false;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 15;
};