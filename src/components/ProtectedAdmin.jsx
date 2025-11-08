import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedAdmin
 * - Renders child routes (Outlet) only when a logged-in user exists and is an approved admin.
 * - Otherwise redirects to the provided redirect path (default: /auth/login).
 *
 * The frontend stores the currently logged user and token in localStorage (token + user).
 * This guard reads localStorage directly so you can test quickly; replace with real auth context if available.
 */
export default function ProtectedAdmin({ redirect = "/auth/login" }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) {
    user = null;
  }

  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to={redirect} replace />;
  }

  // require both approved and admin flags
  if (!user.is_approved || !user.is_admin) {
    // You could show an "Unauthorized" page instead; redirecting to home for now.
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}