import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * Props:
 *   allowedRoles  — optional array of roles allowed, e.g. ['student'] or ['school']
 *                   If omitted, any authenticated user passes through.
 *   redirectTo    — where to redirect if unauthenticated (default: '/student/login')
 */
export default function ProtectedRoute({
  allowedRoles = [],
  redirectTo = '/student/login',
}) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Prevent flash of redirect while session is being verified
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Wrong role — send to appropriate login
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
