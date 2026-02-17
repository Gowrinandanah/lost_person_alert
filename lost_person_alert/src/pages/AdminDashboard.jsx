// src/pages/AdminDashboard.jsx

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SystemAdminPanel from "../components/admin/SystemAdminPanel";
import ReportAdminPanel from "../components/admin/ReportAdminPanel";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-10">
          {user.role === "primaryAdmin"
            ? "System Admin Panel"
            : "Report Admin Panel"}
        </h2>
      </div>

      <div className="flex-1 p-8">
        {user.role === "primaryAdmin" && <SystemAdminPanel />}
        {user.role === "secondaryAdmin" && <ReportAdminPanel />}
      </div>
    </div>
  );
};

export default AdminDashboard;