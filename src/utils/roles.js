// utils/roles.js

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  RESPONSABLE: 'RESPONSABLE'
};

// Get current user role from localStorage
export const getCurrentRole = () => {
  return localStorage.getItem('role') || 'RESPONSABLE';
};

// Check if user has specific role
export const hasRole = (role) => {
  const currentRole = getCurrentRole();
  return currentRole === role;
};

// Check if user can edit
export const canEdit = () => {
  const role = getCurrentRole();
  return role === ROLES.ADMIN || role === ROLES.MANAGER;
};

// Check if user can delete
export const canDelete = () => {
  const role = getCurrentRole();
  return role === ROLES.ADMIN;
};

// ✅ ADD THIS - Check if user can create
export const canCreate = () => {
  const role = getCurrentRole();
  return role === ROLES.ADMIN || role === ROLES.MANAGER;
};

// ✅ ADD THIS - Check if user can manage users
export const canManageUsers = () => {
  const role = getCurrentRole();
  return role === ROLES.ADMIN; // Only ADMIN can manage users
};

// Check if user can view
export const canView = (module) => {
  const role = getCurrentRole();
  
  const permissions = {
    // ADMIN: full access
    ADMIN: {
      vehicles: true,
      employees: true,
      missions: true,
      maintenance: true,
      technicalChecks: true,
      gasCoupons: true,
      couponTracking: true,
      carteNaftal: true,
      users: true
    },
    // MANAGER: can manage, but no users/carteNaftal
    MANAGER: {
      vehicles: true,
      employees: true,
      missions: true,
      maintenance: true,
      technicalChecks: true,
      gasCoupons: true,
      couponTracking: true,
      carteNaftal: false,
      users: false
    },
    // RESPONSABLE: view only
    RESPONSABLE: {
      vehicles: true,
      employees: false,
      missions: true,
      maintenance: true,
      technicalChecks: true,
      gasCoupons: true,
      couponTracking: true,
      carteNaftal: false,
      users: false
    }
  };
  
  return permissions[role]?.[module] || false;
};

// Check if user is admin only
export const isAdmin = () => hasRole(ROLES.ADMIN);

// Check if user is manager or admin
export const isManagerOrAdmin = () => {
  const role = getCurrentRole();
  return role === ROLES.ADMIN || role === ROLES.MANAGER;
};