// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import SystemAdminPanel from "../components/admin/SystemAdminPanel";
import ReportAdminPanel from "../components/admin/ReportAdminPanel";
import GeneralSightingsPanel from "../components/admin/GeneralSightingsPanel";
import { Users, FileText, Eye } from "lucide-react";
import { getGeneralSightingStats } from "../services/reportApi";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [pendingGeneralCount, setPendingGeneralCount] = useState(0);

  useEffect(() => {
    if (activeTab === "general") {
      fetchGeneralStats();
    }
  }, [activeTab]);

  const fetchGeneralStats = async () => {
    try {
      const stats = await getGeneralSightingStats();
      setPendingGeneralCount(stats.pending || 0);
    } catch (error) {
      console.error("Error fetching general stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-light">
            Admin <span className="font-semibold">Dashboard</span>
          </h1>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-8 mb-8 border-b">
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === "users" ? "text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={16} />
              User Management
            </div>
            {activeTab === "users" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === "reports" ? "text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              Incident Reports
            </div>
            {activeTab === "reports" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />
            )}
          </button>

          {/* General Sightings Tab */}
          <button
            onClick={() => setActiveTab("general")}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === "general" ? "text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <Eye size={16} />
              General Sightings
              {pendingGeneralCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                  {pendingGeneralCount}
                </span>
              )}
            </div>
            {activeTab === "general" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />
            )}
          </button>
        </div>

        {/* CONTENT AREA */}
        <div>
          {activeTab === "users" && <SystemAdminPanel />}
          {activeTab === "reports" && <ReportAdminPanel />}
          {activeTab === "general" && <GeneralSightingsPanel />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;