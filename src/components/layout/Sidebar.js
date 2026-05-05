import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../components/layout/sidebar.css';
import '../../components/layout/Topbar.css';



const ALL_NAV_ITEMS = [
  { path: '/dashboard',        icon: 'fa-home',            label: 'Dashboard',     roles: ['ADMIN', 'MANAGER', 'RESPONSABLE'] },
  { path: '/vehicles',         icon: 'fa-car',             label: 'Vehicles',      roles: ['ADMIN', 'MANAGER', 'RESPONSABLE'] },
  { path: '/drivers',          icon: 'fa-id-badge',        label: 'Employees',     roles: ['ADMIN', 'MANAGER', 'RESPONSABLE'] },
  { path: '/missions',         icon: 'fa-route',           label: 'Missions',      roles: ['ADMIN', 'MANAGER', 'RESPONSABLE'] },
  { path: '/maintenance',      icon: 'fa-tools',           label: 'Maintenance',   roles: ['ADMIN', 'MANAGER', 'RESPONSABLE'] },
  { path: '/technical-checks', icon: 'fa-clipboard-check', label: 'Tech Checks',   roles: ['ADMIN', 'MANAGER', 'RESPONSABLE'] },
  { 
    icon: 'fa-gas-pump', 
    label: 'Gas Coupons', 
    roles: ['ADMIN', 'MANAGER', 'RESPONSABLE'],
    subItems: [
      { path: '/gas-coupons', icon: 'fa-box', label: 'Inventory', roles: ['ADMIN', 'MANAGER', 'RESPONSABLE'] },
      { path: '/coupon-assignments', icon: 'fa-exchange-alt', label: 'Assignments', roles: ['ADMIN', 'MANAGER'] }
    ]
  },
  { path: '/users',            icon: 'fa-users-cog',       label: 'Users',         roles: ['ADMIN'] },
];

function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Admin';
  const role = localStorage.getItem('role') || 'MANAGER';
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNav = (path) => {
    navigate(path);
    if (onMobileClose) onMobileClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderNavItem = (item) => {
    if (item.subItems) {
      // Filter subitems by role
      const visibleSubItems = item.subItems.filter(sub => sub.roles.includes(role));
      if (visibleSubItems.length === 0) return null;

      const isOpen = openMenus[item.label];
      
      return (
        <li key={item.label} className="sidebar-dropdown">
          <a onClick={() => toggleMenu(item.label)} className={isOpen ? 'active' : ''}>
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} dropdown-arrow`}></i>
          </a>
          {isOpen && (
            <ul className="sidebar-submenu">
              {visibleSubItems.map(sub => (
                <li key={sub.path}>
                  <a
                    className={location.pathname === sub.path ? 'active' : ''}
                    onClick={() => handleNav(sub.path)}
                  >
                    <i className={`fas ${sub.icon}`}></i>
                    <span>{sub.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    if (!item.roles.includes(role)) return null;
    
    return (
      <li key={item.path}>
        <a
          className={location.pathname === item.path ? 'active' : ''}
          onClick={() => handleNav(item.path)}
        >
          <i className={`fas ${item.icon}`}></i>
          <span>{item.label}</span>
        </a>
      </li>
    );
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          <i className="fas fa-user"></i>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="sidebar-username">{username}</div>
          <div className="sidebar-role">{role}</div>
        </div>
      </div>

      <ul className="sidebar-nav">
        {ALL_NAV_ITEMS.map(renderNavItem)}
        <li className="sidebar-logout">
          <a onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
