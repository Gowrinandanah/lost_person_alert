// src/components/admin/ReportAdminPanel.jsx

import React, { useEffect, useState } from "react";
import {
  getAllReportsAdmin,
  updateReportStatus,
  getAdminReportById,
} from "../../services/reportApi";
// IMPORT flagUser from authApi, not reportApi
import { flagUser } from "../../services/authApi";
import { useNavigate } from "react-router-dom";

const ReportAdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getAllReportsAdmin();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading(true);
      const result = await updateReportStatus(id, status);
      alert(result.message || `Report ${status} successfully`);
      if (result.caseNumber) {
        alert(`Case Number: ${result.caseNumber}`);
      }
      fetchReports();
      // Close modal if open
      if (selectedReport && selectedReport._id === id) {
        setSelectedReport(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error updating status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const report = await getAdminReportById(id);
      setSelectedReport(report);
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Could not load report details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleFlagUser = async (userId) => {
    try {
      setActionLoading(true);
      await flagUser(userId);
      alert("User flagged successfully");
      // Refresh the current report details
      if (selectedReport) {
        const updatedReport = await getAdminReportById(selectedReport._id);
        setSelectedReport(updatedReport);
      }
      fetchReports();
    } catch (error) {
      alert(error.response?.data?.message || "Error flagging user");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredReports = reports.filter(
    (r) => r.status?.toLowerCase() === activeTab
  );

  const getCount = (status) =>
    reports.filter((r) => r.status?.toLowerCase() === status).length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Report Management</h2>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
        {["pending", "approved", "rejected", "resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === tab
                ? "bg-white border text-indigo-600"
                : "bg-gray-200"
            }`}
          >
            {tab.toUpperCase()} ({getCount(tab)})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filteredReports.length === 0 ? (
        <p className="text-center">No {activeTab} reports.</p>
      ) : (
        filteredReports.map((report) => (
          <div key={report._id} className="bg-white p-5 mb-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{report.personName}</p>
                <p>Reported by: {report.user?.name}</p>
                {report.caseNumber && (
                  <p className="text-sm text-indigo-600 font-semibold mt-1">
                    Case: {report.caseNumber}
                  </p>
                )}
              </div>
              <span className="text-sm font-semibold">
                {report.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              {report.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      handleStatusUpdate(report._id, "approved")
                    }
                    disabled={actionLoading}
                    className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(report._id, "rejected")
                    }
                    disabled={actionLoading}
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Reject
                  </button>
                </>
              )}
              {report.status === "approved" && (
                <button
                  onClick={() =>
                    handleStatusUpdate(report._id, "resolved")
                  }
                  disabled={actionLoading}
                  className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Mark Resolved
                </button>
              )}
              <button
                onClick={() => handleViewDetails(report._id)}
                disabled={detailsLoading}
                className="bg-gray-700 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 max-h-[90vh] overflow-y-auto p-6 rounded relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-3 right-3 text-xl font-bold"
            >
              ✕
            </button>

            {detailsLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">
                  Report Details
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <p><strong>Case Number:</strong> {selectedReport.caseNumber || "Not assigned"}</p>
                  <p><strong>Name:</strong> {selectedReport.personName}</p>
                  <p><strong>Age:</strong> {selectedReport.age || "N/A"}</p>
                  <p><strong>Gender:</strong> {selectedReport.gender || "N/A"}</p>
                  <p><strong>Height:</strong> {selectedReport.height || "N/A"}</p>
                  <p><strong>Weight:</strong> {selectedReport.weight || "N/A"}</p>
                  <p><strong>Complexion:</strong> {selectedReport.complexion || "N/A"}</p>
                  <p><strong>Clothing:</strong> {selectedReport.clothing || "N/A"}</p>
                </div>

                <p className="mb-4"><strong>Description:</strong> {selectedReport.description}</p>

                <p className="mb-2"><strong>Last Seen:</strong></p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <p><strong>Location:</strong> {selectedReport.lastSeenLocation}</p>
                  <p><strong>Date:</strong> {selectedReport.lastSeenDate ? new Date(selectedReport.lastSeenDate).toLocaleDateString() : "N/A"}</p>
                  <p><strong>Time:</strong> {selectedReport.lastSeenTime || "N/A"}</p>
                </div>

                {selectedReport.photo && (
                  <div className="mb-4">
                    <p><strong>Photo:</strong></p>
                    <img 
                      src={`http://localhost:5000/${selectedReport.photo}`} 
                      alt={selectedReport.personName}
                      className="max-h-64 rounded"
                    />
                  </div>
                )}

                <hr className="my-4" />

                <h3 className="text-xl font-bold mb-4">
                  Reporter Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Name:</strong> {selectedReport.user?.name}</p>
                  <p><strong>Email:</strong> {selectedReport.user?.email}</p>
                  <p><strong>Phone:</strong> {selectedReport.user?.phone}</p>
                  <p><strong>Aadhaar Status:</strong> {selectedReport.user?.aadhaarStatus}</p>
                  <p>
                    <strong>Flagged:</strong>{" "}
                    {selectedReport.user?.isFlagged ? "Yes" : "No"}
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  {!selectedReport.user?.isFlagged && (
                    <button
                      onClick={() =>
                        handleFlagUser(selectedReport.user._id)
                      }
                      disabled={actionLoading}
                      className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      Flag User
                    </button>
                  )}
                  
                  {selectedReport.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedReport._id, "approved")
                        }
                        disabled={actionLoading}
                        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                      >
                        Approve Report
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedReport._id, "rejected")
                        }
                        disabled={actionLoading}
                        className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                      >
                        Reject Report
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAdminPanel;