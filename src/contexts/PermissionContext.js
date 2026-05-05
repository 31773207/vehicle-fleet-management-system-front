import React, { createContext, useContext } from 'react';
import { canEdit, canDelete, canCreate, canManageUsers } from '../utils/roles';

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const permissions = {
    canEdit: canEdit(),
    canDelete: canDelete(),
    canCreate: canCreate(),
    canManageUsers: canManageUsers()
  };

  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider');
  }
  return context;
};