import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../components/customComponents/Loader/Loader";

export const ProtectedRoute = ({
  isAuthenticated,
  isAllowed,
  userRole,
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (!userRole) {
    return <Loader />;
  }

  const hasAccess = isAllowed(
    location.pathname,
    userRole
  );

  if (!hasAccess) {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAllowed: PropTypes.func.isRequired,
  userRole: PropTypes.string,
};