export const filterVehicles = (vehicles, search, filter) => {
  return vehicles.filter((v) => {
    const match = `${v.plateNumber} ${v.model} ${v.brand?.brandName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return filter === "All" ? match : v.status === filter && match;
  });
};

export const getStatusText = (status) =>
  ({
    AVAILABLE: "Available",
    ASSIGNED: "Assigned",
    IN_MISSION: "In Mission",
    IN_REVISION: "In Revision",
    BREAKDOWN: "Breakdown",
    REFORMED: "Reformed"
  }[status] || "Unknown");

export const getStatusClass = (status) =>
  ({
    AVAILABLE: "badge-available",
    ASSIGNED: "badge-assigned",
    IN_MISSION: "badge-mission",
    IN_REVISION: "badge-revision",
    BREAKDOWN: "badge-breakdown",
    REFORMED: "badge-reformed"
  }[status] || "badge-default");

export const getFuelOptions = () => [
  { value: "Diesel", label: "Diesel" },
  { value: "Essence", label: "Essence" },
  { value: "Electric", label: "Electric" },
  { value: "Hybrid", label: "Hybrid" }
];

export const getTypeOptions = (types) => [
  ...types.map((t) => ({ value: t.id, label: t.typeName }))
];

