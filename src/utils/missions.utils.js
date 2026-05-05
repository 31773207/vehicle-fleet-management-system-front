// ================= FILTERING =================

export const filterMissions = (missions, search, filter) => {
  return missions.filter((m) => {
    const match = `${m.destination} ${m.driver?.firstName} ${m.driver?.lastName} ${m.driver?.displayId || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "All") return match;
    return m.status === filter && match;
  });
};

// ================= STATUS HELPERS =================

export const getStatusClass = (status) =>
  ({
    PLANNED: "badge-planned",
    IN_PROGRESS: "badge-in-progress",
    COMPLETED: "badge-completed",
    CANCELLED: "badge-cancelled"
  }[status] || "badge-default");

export const getStatusIcon = (status) =>
  ({
    IN_PROGRESS: "fa-spinner fa-spin",
    COMPLETED: "fa-check-circle",
    CANCELLED: "fa-times-circle"
  }[status] || "");

export const canComplete = (mission) => {
  if (!mission.startDate) return true;
  const today = new Date().toISOString().split("T")[0];
  return today >= mission.startDate;
};

// ================= DROPDOWN OPTIONS =================

export const buildDriverOptions = (drivers) => [
  { value: "", label: "Select Driver" },
  ...drivers.map((d) => ({
    value: d.id,
    label: `${d.firstName} ${d.lastName}`
  }))
];

export const buildVehicleOptions = (vehicles) => [
  { value: "", label: "Select Vehicle" },
  ...vehicles.map((v) => ({
    value: v.id,
    label: `${v.plateNumber} - ${v.brand?.brandName} ${v.model}`
  }))
];

export const buildOrgOptions = (organizations) => [
  { value: "", label: "Select Organization" },
  ...organizations.map((o) => ({
    value: o.id,
    label: o.name
  }))
];

// ================= FORM HELPERS =================

export const getInitialForm = () => ({
  departLocation: "",
  destination: "",
  purpose: "",
  startDate: "",
  endDate: "",
  missionType: "SHORT",
  driver: { id: "" },
  vehicle: { id: "" },
  organization: { id: "" }
});

