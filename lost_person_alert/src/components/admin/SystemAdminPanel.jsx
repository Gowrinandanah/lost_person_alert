// src/components/admin/SystemAdminPanel.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserDetails } from "../../services/reportApi";

const BASE_URL = "http://localhost:5000/api/admin";

const SystemAdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ===========================================
     FETCH USERS
  =========================================== */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const [pendingRes, approvedRes] = await Promise.all([
        axios.get(`${BASE_URL}/users/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/users/approved`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================
     VERIFY AADHAAR
  =========================================== */
  const verifyUser = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/users/${id}/verify-aadhaar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUsers();
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  /* ===========================================
     VIEW DETAILS
  =========================================== */
  const handleViewDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const data = await getUserDetails(id);
      setUserDetails(data);
      setSelectedUser(id);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ===========================================
     STATUS BADGE
  =========================================== */
  const statusBadge = (status) => {
    const styles = {
      pending: "text-yellow-600 font-semibold",
      approved: "text-green-600 font-semibold",
      rejected: "text-red-600 font-semibold",
    };

    return (
      <span className={styles[status] || "text-gray-500"}>
        {status.toUpperCase()}
      </span>
    );
  };

  /* ===========================================
     USER CARD
  =========================================== */
  const renderUserCard = (user, canVerify = false) => (
    <div
      key={user._id}
      className="bg-white p-5 rounded-lg shadow flex justify-between items-center"
    >
      <div>
        <p className="font-semibold text-lg">{user.name}</p>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-600">{user.phone}</p>
        <p className="text-sm mt-1">
          Status: {statusBadge(user.aadhaarStatus)}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleViewDetails(user._id)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Details
        </button>

        {canVerify && user.aadhaarStatus === "pending" && (
          <button
            onClick={() => verifyUser(user._id)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
        )}
      </div>
    </div>
  );

  /* ===========================================
     UI
  =========================================== */
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        System Admin – User Verification
      </h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-2 font-semibold ${
            activeTab === "pending"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500"
          }`}
        >
          Pending ({pendingUsers.length})
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`px-6 py-2 font-semibold ${
            activeTab === "approved"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500"
          }`}
        >
          Approved ({approvedUsers.length})
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading users...
        </p>
      )}

      {!loading && activeTab === "pending" && (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <p className="text-center text-gray-500">
              No pending users
            </p>
          ) : (
            pendingUsers.map((u) => renderUserCard(u, true))
          )}
        </div>
      )}

      {!loading && activeTab === "approved" && (
        <div className="space-y-4">
          {approvedUsers.length === 0 ? (
            <p className="text-center text-gray-500">
              No approved users
            </p>
          ) : (
            approvedUsers.map((u) => renderUserCard(u))
          )}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 max-h-[90vh] overflow-y-auto rounded-lg p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 text-xl"
            >
              ✕
            </button>

            {detailsLoading ? (
              <p className="text-center">Loading details...</p>
            ) : (
              userDetails && (
                <>
                  <h3 className="text-xl font-bold mb-4">
                    User Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <p><strong>Name:</strong> {userDetails.user.name}</p>
                    <p><strong>Email:</strong> {userDetails.user.email}</p>
                    <p><strong>Phone:</strong> {userDetails.user.phone}</p>
                    <p><strong>Role:</strong> {userDetails.user.role}</p>
                    <p>
                      <strong>Aadhaar Status:</strong>{" "}
                      {statusBadge(userDetails.user.aadhaarStatus)}
                    </p>
                  </div>

                  <h3 className="text-xl font-bold mb-4">
                    Reports ({userDetails.reports.length})
                  </h3>

                  {userDetails.reports.length === 0 ? (
                    <p className="text-gray-500 mb-6">
                      No reports submitted.
                    </p>
                  ) : (
                    <div className="space-y-3 mb-8">
                      {userDetails.reports.map((report) => (
                        <div key={report._id} className="border p-4 rounded">
                          <p><strong>Person:</strong> {report.personName}</p>
                          <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-4">
                    Responses ({userDetails.responses.length})
                  </h3>

                  {userDetails.responses.length === 0 ? (
                    <p className="text-gray-500">
                      No responses submitted.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {userDetails.responses.map((res) => (
                        <div key={res._id} className="border p-4 rounded">
                          <p><strong>Report:</strong> {res.report?.personName}</p>
                          <p><strong>Message:</strong> {res.message}</p>
                          <p><strong>Date:</strong> {new Date(res.createdAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminPanel;
