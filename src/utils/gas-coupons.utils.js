// Filter coupons by search and status (ONLY ONCE)
export const filterCoupons = (coupons, search, filter) => {
  return coupons.filter((c) => {
    const match = `${c.batchNumber || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "All") return match;
    return c.status === filter && match;
  });
};

// Get coupon stats
export const getCouponStats = (coupons) => {
  const totalBought = coupons.reduce((sum, c) => sum + (c.quantityBought || 0), 0);
  const totalRemaining = coupons.reduce((sum, c) => sum + (c.quantityRemaining || 0), 0);
  const totalUsed = totalBought - totalRemaining;
  
  return {
    totalBought,
    totalRemaining,
    totalUsed
  };
};

// Get status label
export const getStatusLabel = (status) => {
  switch (status) {
    case "AVAILABLE": return "Available";
    case "DEPLETED": return "Depleted";
    case "EXPIRED": return "Expired";
    default: return status;
  }
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case "AVAILABLE": return "#28a745";
    case "DEPLETED": return "#6c757d";
    case "EXPIRED": return "#dc3545";
    default: return "#6c757d";
  }
};

// Initial form (for compatibility)
export const getInitialForm = () => ({
  couponNumber: "",
  fuelAmount: ""
});

// Map coupon to form (for compatibility)
export const mapCouponToForm = (coupon) => ({
  couponNumber: coupon.couponNumber || "",
  fuelAmount: coupon.fuelAmount || ""
});