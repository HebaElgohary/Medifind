// src/ProtectedRoute.js

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ isAuthenticated, isAllowed, userRole }) => {
  const location = useLocation();
  
  const hasAccess = useMemo(() => {
    if (!isAuthenticated) return false;
    return isAllowed(location.pathname, userRole);
  }, [isAuthenticated, location.pathname, userRole, isAllowed]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    // Redirect to home only if not already on home
    return location.pathname === '/home' 
      ? <Navigate to="/login" replace />
      : <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAllowed: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired
};

