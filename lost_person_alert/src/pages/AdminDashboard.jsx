import React, { useState } from "react";
import SystemAdminPanel from "../components/admin/SystemAdminPanel";
import ReportAdminPanel from "../components/admin/ReportAdminPanel";
import { Users, FileText, ChevronRight } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* THIN TOP BAR */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400">
              Console
            </span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-600">
              {activeTab}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">System Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* PAGE TITLE */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-tight text-slate-950">
            Admin <span className="font-semibold">Dashboard</span>
          </h1>
        </div>

        {/* MINIMAL TAB NAVIGATION */}
        <div className="flex gap-8 mb-12 border-b border-slate-100">
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === "users" ? "text-slate-950" : "text-slate-400 hover:text-slate-600"
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
              activeTab === "reports" ? "text-slate-950" : "text-slate-400 hover:text-slate-600"
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
        </div>

        {/* CONTENT AREA */}
        <div className="bg-white">
          <div className="transition-opacity duration-500 ease-in-out">
            {activeTab === "users" && <SystemAdminPanel />}
            {activeTab === "reports" && <ReportAdminPanel />}
          </div>
        </div>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-50">
        <p className="text-[11px] text-slate-400 font-medium tracking-wide">
          &copy; 2026 SAFERETURN PROTOCOL &mdash; SECURE MANAGEMENT INTERFACE
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;