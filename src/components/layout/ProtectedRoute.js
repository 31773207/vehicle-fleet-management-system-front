// components/layout/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { canAccessPage } from '../../utils/roles';

/**
 * Wraps a route and redirects to /dashboard if the current
 * role is not allowed to access the given page.
 *
 * Usage in App.js / router:
 *   <Route path="/users" element={
 *     <ProtectedRoute page="users"><Users /></ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ page, children }) {
  if (!canAccessPage(page)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}