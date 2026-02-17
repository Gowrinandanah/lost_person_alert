import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AadhaarVerification from "../pages/AadhaarVerification";
import AdminDashboard from "../pages/AdminDashboard";
import Profile from "../pages/Profile";
import ReportLostPerson from "../pages/ReportLostPerson";
import Alerts from "../pages/Alerts";
import Notifications from "../pages/Notifications";
import MissingPersonDetails from "../pages/MissingPersonDetails";
import ReportDetails from "../pages/ReportDetails";

/* ===========================================
   🔐 GENERAL ADMIN ROUTE (Both Admins)
=========================================== */
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (
    !user ||
    (user.role !== "primaryAdmin" &&
      user.role !== "secondaryAdmin")
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* ===========================================
   👑 PRIMARY ADMIN ONLY ROUTE
=========================================== */
const PrimaryAdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user || user.role !== "primaryAdmin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* ===========================================
   🧑‍💼 SECONDARY ADMIN ONLY ROUTE
=========================================== */
const SecondaryAdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user || user.role !== "secondaryAdmin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🌍 Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-aadhaar" element={<AadhaarVerification />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/report" element={<ReportLostPerson />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/person/:id" element={<MissingPersonDetails />} />

      {/* 🏢 Admin Dashboard (Both Admins) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* 📄 Report Details (Secondary Admin Only) */}
      <Route
        path="/admin/reports/:id"
        element={
          <SecondaryAdminRoute>
            <ReportDetails />
          </SecondaryAdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;