import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * Restricts access to specific routes based on authentication and user type.
 *
 * @param {boolean} isAuthenticated - Whether the user is logged in
 * @param {string[]} allowedRoles - Optional array of roles allowed to access this route
 * @param {ReactNode} children - Component to render if authorized
 */
export default function ProtectedRoute({ isAuthenticated, allowedRoles = [], children }) {
  const userType = localStorage.getItem("userType"); // e.g. "investor" or "developer"

  // 🚫 Not logged in at all
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // 🚫 Logged in but not the correct role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized access
  return children;
}
