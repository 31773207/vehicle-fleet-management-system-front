import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Vehicles from './pages/Vehicles/Vehicles';
import Drivers from './pages/Drivers/Drivers';
import Missions from './pages/Missions/Missions';
import Maintenance from './pages/Maintenance/Maintenance';
import TechnicalChecks from './pages/TechnicalChecks/TechnicalChecks';
import GasCoupons from './pages/GasCoupons/GasCoupons';
import Users from './pages/Users/Users';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.css';
import { PermissionProvider } from './contexts/PermissionContext';
import CouponAssignments from './pages/GasCoupons/CouponAssignments';


function App() {
  const token = localStorage.getItem('token');

  return (
        <PermissionProvider>

    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/vehicles" element={token ? <Vehicles /> : <Navigate to="/login" />} />
            <Route path="/drivers" element={token ? <Drivers /> : <Navigate to="/login" />} />
            <Route path="/missions" element={token ? <Missions /> : <Navigate to="/login" />} />
            <Route path="/maintenance" element={token ? <Maintenance /> : <Navigate to="/login" />} />
            <Route path="/technical-checks" element={token ? <TechnicalChecks /> : <Navigate to="/login" />} />
            <Route path="/gas-coupons" element={token ? <GasCoupons /> : <Navigate to="/login" />} />
            <Route path="/coupon-assignments" element={token ? <CouponAssignments /> : <Navigate to="/login" />} />
            <Route path="/users" element={token ? <Users /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
        </PermissionProvider>

  );
}

export default App;
