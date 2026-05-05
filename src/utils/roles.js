export const getRole = () => (localStorage.getItem('role') || '').toUpperCase();

export const canEdit = () => getRole() === 'ADMIN' || getRole() === 'MANAGER';
export const canDelete = () => getRole() === 'ADMIN' || getRole() === 'MANAGER';
export const canCreate = () => getRole() === 'ADMIN' || getRole() === 'MANAGER';
export const canManageUsers = () => getRole() === 'ADMIN';