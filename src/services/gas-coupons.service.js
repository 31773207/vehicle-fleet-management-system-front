import api from "./api";

export const getGasCoupons = () => api.get("/gas-coupons");
export const getGasCouponById = (id) => api.get(`/gas-coupons/${id}`);
export const createGasCoupon = (data) => api.post("/gas-coupons", data);
export const updateGasCoupon = (id, data) => api.put(`/gas-coupons/${id}`, data);
export const deleteGasCoupon = (id) => api.delete(`/gas-coupons/${id}`);

export const bulkCreateGasCoupons = (quantity, fuelAmount) => 
    api.post(`/gas-coupons/bulk?quantity=${quantity}&fuelAmount=${fuelAmount}`);

export const bulkAssignToDriver = (driverId, quantity) => 
    api.post("/gas-coupons/bulk-assign", { driverId, quantity });

export const assignCouponToDriver = (couponId, driverId) => 
    api.patch(`/gas-coupons/${couponId}/assign/${driverId}`);

export const markCouponAsUsed = (couponId) => 
    api.patch(`/gas-coupons/${couponId}/use`);

export const transferCoupon = (couponId, transferredTo) => 
    api.patch(`/gas-coupons/${couponId}/transfer?transferredTo=${transferredTo}`);

export const getDrivers = () => api.get("/drivers");
export const getEmployees = () => api.get("/employees");  // ✅ ADD THIS

export const getCountByStatus = (status) => api.get(`/gas-coupons/count/${status}`);
export const getByDateRange = (start, end) => api.get(`/gas-coupons/date-range?start=${start}&end=${end}`);
export const getByCouponNumber = (number) => api.get(`/gas-coupons/number/${number}`);
export const getInventory = () => api.get("/gas-coupons/inventory");