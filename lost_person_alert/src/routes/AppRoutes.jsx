// src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Pages
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
import GeneralSighting from "../pages/GeneralSighting";
import FoundPerson from "../pages/FoundPerson";

/* ===========================================
    ADMIN ROUTE
=========================================== */
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/person/:id" element={<MissingPersonDetails />} />
      <Route path="/found/:id" element={<FoundPerson />} />
      
      {/* USER ROUTES (require login) */}
      <Route path="/verify-aadhaar" element={<AadhaarVerification />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/report" element={<ReportLostPerson />} />
      <Route path="/sighting/:id" element={<GeneralSighting />} /> 
      <Route path="/sighting" element={<GeneralSighting />} /> 
      <Route path="/notifications" element={<Notifications />} />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      {/* REMOVED: <Route path="/admin/general-sightings/:id" ... /> because GeneralSightingDetails is not defined yet */}
      
      {/* CATCH ALL - 404 redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;