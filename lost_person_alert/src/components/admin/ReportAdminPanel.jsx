// src/components/admin/ReportAdminPanel.jsx
import React, { useEffect, useState } from "react";
import {
  getAllReportsAdmin,
  updateReportStatus,
  getAdminReportById,
  flagUser
} from "../../services/reportApi";
import { useNavigate } from "react-router-dom";

const ReportAdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

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
    await updateReportStatus(id, status);
    fetchReports();
  };

  const handleViewDetails = async (id) => {
    setDetailsLoading(true);
    const report = await getAdminReportById(id);
    setSelectedReport(report);
    setDetailsLoading(false);
  };

  const handleFlagUser = async (userId) => {
    await flagUser(userId);
    alert("User flagged successfully");
    fetchReports();
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
        {["pending", "approved", "rejected"].map((tab) => (
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
              </div>
              <span className="text-sm font-semibold">
                {report.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              {report.status !== "approved" && (
                <button
                  onClick={() =>
                    handleStatusUpdate(report._id, "approved")
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
              )}
              {report.status !== "rejected" && (
                <button
                  onClick={() =>
                    handleStatusUpdate(report._id, "rejected")
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              )}
              <button
                onClick={() => handleViewDetails(report._id)}
                className="bg-gray-700 text-white px-3 py-1 rounded"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-3/4 p-6 rounded relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-3 right-3"
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

                <p><strong>Name:</strong> {selectedReport.personName}</p>
                <p><strong>Age:</strong> {selectedReport.age}</p>
                <p><strong>Description:</strong> {selectedReport.description}</p>

                <hr className="my-4" />

                <h3 className="text-xl font-bold mb-4">
                  Reporter Details
                </h3>

                <p><strong>Name:</strong> {selectedReport.user?.name}</p>
                <p><strong>Email:</strong> {selectedReport.user?.email}</p>
                <p><strong>Phone:</strong> {selectedReport.user?.phone}</p>
                <p>
                  <strong>Flagged:</strong>{" "}
                  {selectedReport.user?.isFlagged ? "Yes" : "No"}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/users/${selectedReport.user._id}`)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Profile
                  </button>

                  {!selectedReport.user?.isFlagged && (
                    <button
                      onClick={() =>
                        handleFlagUser(selectedReport.user._id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Flag User
                    </button>
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