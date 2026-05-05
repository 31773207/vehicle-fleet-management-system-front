export const splitEmployees = (employees) => {
  const drivers = employees.filter(e => e.employeeType === 'DRIVER');
  const emps = employees.filter(e => e.employeeType === 'EMPLOYEE');
  return { drivers, emps };
};

export const filterDrivers = (drivers, search, filter) => {
  return drivers.filter(d => {
    const match = `${d.firstName} ${d.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === 'Available') return d.employeeStatus === 'AVAILABLE' && match;
    if (filter === 'On Route') return d.employeeStatus === 'ON_MISSION' && match;
    if (filter === 'Employee') return false;

    return match;
  });
};

export const filterEmployees = (emps, search, filter) => {
  return emps.filter(e => {
    const match = `${e.firstName} ${e.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === 'Driver' || filter === 'On Route') return false;
    return match;
  });
};

export const showDrivers = (filter) =>
  ['All', 'Driver', 'Available', 'On Route'].includes(filter);

export const showEmployees = (filter) =>
  ['All', 'Employee', 'Available'].includes(filter);

export const getInitials = (f, l) =>
  `${f?.charAt(0) || ''}${l?.charAt(0) || ''}`.toUpperCase();

export const getDisplayId = (e) =>
  e.displayId || `${e.employeeType === 'EMPLOYEE' ? 'Employee' : 'Driver'} N0${e.id}`;

export const getStatusClass = (e) => ({
  ON_MISSION: 'status-on-mission-red',
  AVAILABLE: 'status-available-green'
}[e.employeeStatus] || 'status-default');

export const getStatusText = (e) => ({
  ON_MISSION: 'On Mission',
  AVAILABLE: 'Available'
}[e.employeeStatus] || 'Unknown');