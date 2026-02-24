// src/components/admin/SystemAdminPanel.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserDetails } from "../../services/authApi";

const BASE_URL = "http://localhost:5000/api/admin";

const SystemAdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [notUploadedUsers, setNotUploadedUsers] = useState([]);
  const [flaggedUsers, setFlaggedUsers] = useState([]);
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

      const [pendingRes, approvedRes, notUploadedRes, flaggedRes] = await Promise.all([
        axios.get(`${BASE_URL}/users/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/users/approved`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/users/not-uploaded`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/users/flagged`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data);
      setNotUploadedUsers(notUploadedRes.data);
      setFlaggedUsers(flaggedRes.data);
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
     FLAG/UNFLAG USER
  =========================================== */
  const handleFlagUser = async (userId, currentFlagStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentFlagStatus ? 'unflag' : 'flag'} this user?`)) {
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/users/${userId}/flag`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`User ${currentFlagStatus ? 'unflagged' : 'flagged'} successfully`);
      
      // Refresh the user list
      fetchUsers();
      
      // If this user's details are currently open, refresh them
      if (selectedUser === userId) {
        const updatedDetails = await getUserDetails(userId);
        setUserDetails(updatedDetails);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to update user flag status");
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
  const getStatusBadge = (status) => {
    const badges = {
      not_uploaded: <span className="badge bg-secondary">Not Uploaded</span>,
      pending: <span className="badge bg-warning text-dark">Pending</span>,
      approved: <span className="badge bg-success">Approved</span>,
      rejected: <span className="badge bg-danger">Rejected</span>,
    };
    return badges[status] || <span className="badge bg-secondary">{status}</span>;
  };

  /* ===========================================
     USER CARD
  =========================================== */
  const renderUserCard = (user, showActions = true) => (
    <div key={user._id} className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title fw-bold mb-1">{user.name}</h5>
            <p className="text-secondary mb-1">{user.email}</p>
            <p className="text-secondary mb-2">{user.phone}</p>
            <div className="d-flex gap-2 align-items-center">
              {getStatusBadge(user.aadhaarStatus)}
              {user.isFlagged && (
                <span className="badge bg-danger">FLAGGED</span>
              )}
            </div>
          </div>
          
          <div className="d-flex gap-2">
            <button
              onClick={() => handleViewDetails(user._id)}
              className="btn btn-primary btn-sm"
            >
              Details
            </button>

            {showActions && user.aadhaarStatus === "pending" && (
              <button
                onClick={() => verifyUser(user._id)}
                className="btn btn-success btn-sm"
              >
                Approve
              </button>
            )}

            <button
              onClick={() => handleFlagUser(user._id, user.isFlagged)}
              className={`btn btn-sm ${
                user.isFlagged ? 'btn-warning' : 'btn-danger'
              }`}
            >
              {user.isFlagged ? 'Unflag' : 'Flag'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ===========================================
     TAB CONTENT
  =========================================== */
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    let users = [];
    let showActions = true;
    let emptyMessage = "";

    switch(activeTab) {
      case "notUploaded":
        users = notUploadedUsers;
        emptyMessage = "No users without Aadhaar upload";
        showActions = false;
        break;
      case "pending":
        users = pendingUsers;
        emptyMessage = "No pending users";
        break;
      case "approved":
        users = approvedUsers;
        emptyMessage = "No approved users";
        showActions = false;
        break;
      case "flagged":
        users = flaggedUsers;
        emptyMessage = "No flagged users";
        break;
      default:
        users = [];
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-secondary mb-0">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="mt-4">
        {users.map(user => renderUserCard(user, showActions))}
      </div>
    );
  };

  /* ===========================================
     UI
  =========================================== */
  return (
    <div className="container-fluid p-4">
      <h2 className="h4 fw-bold mb-4">User Management</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "notUploaded" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("notUploaded")}
          >
            Not Uploaded <span className="badge bg-secondary ms-1">{notUploadedUsers.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pending" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending <span className="badge bg-warning text-dark ms-1">{pendingUsers.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "approved" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved <span className="badge bg-success ms-1">{approvedUsers.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "flagged" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("flagged")}
          >
            Flagged <span className="badge bg-danger ms-1">{flaggedUsers.length}</span>
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {renderTabContent()}

      {/* ================= MODAL ================= */}
      {selectedUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {detailsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  userDetails && (
                    <>
                      {/* User Info */}
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Name:</strong> {userDetails.user.name}</p>
                          <p className="mb-1"><strong>Email:</strong> {userDetails.user.email}</p>
                          <p className="mb-1"><strong>Phone:</strong> {userDetails.user.phone}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Role:</strong> {userDetails.user.role}</p>
                          <p className="mb-1">
                            <strong>Aadhaar Status:</strong> {getStatusBadge(userDetails.user.aadhaarStatus)}
                          </p>
                          {userDetails.user.aadhaarNumber && (
                            <p className="mb-1"><strong>Aadhaar No.:</strong> {userDetails.user.aadhaarNumber}</p>
                          )}
                        </div>
                      </div>

                      {/* Flag Status */}
                      <div className={`alert ${userDetails.user.isFlagged ? 'alert-warning' : 'alert-success'} mb-4`}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{userDetails.user.isFlagged ? '⚠️ Flagged Account' : '✅ Normal Account'}</strong>
                            {userDetails.user.isFlagged && (
                              <p className="small mb-0 mt-1">User cannot submit new reports until unflagged.</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleFlagUser(userDetails.user._id, userDetails.user.isFlagged)}
                            className={`btn btn-sm ${userDetails.user.isFlagged ? 'btn-warning' : 'btn-danger'}`}
                          >
                            {userDetails.user.isFlagged ? 'Remove Flag' : 'Flag User'}
                          </button>
                        </div>
                      </div>

                      {/* Aadhaar Photo */}
                      {userDetails.user.aadhaarPhoto && (
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3">Aadhaar Card</h6>
                          <div className="border rounded p-3 bg-light text-center">
                            <img
                              src={`http://localhost:5000/${userDetails.user.aadhaarPhoto}`}
                              alt="Aadhaar Card"
                              className="img-fluid rounded"
                              style={{ maxHeight: "300px" }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Reports */}
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3">Reports ({userDetails.reports.length})</h6>
                        {userDetails.reports.length === 0 ? (
                          <p className="text-secondary small">No reports submitted</p>
                        ) : (
                          <div className="list-group">
                            {userDetails.reports.map(report => (
                              <div key={report._id} className="list-group-item">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <strong>{report.personName}</strong>
                                    <p className="small text-secondary mb-0">
                                      {new Date(report.createdAt).toLocaleDateString()} • Status: {report.status}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Responses */}
                      <div>
                        <h6 className="fw-bold mb-3">Responses ({userDetails.responses.length})</h6>
                        {userDetails.responses.length === 0 ? (
                          <p className="text-secondary small">No responses submitted</p>
                        ) : (
                          <div className="list-group">
                            {userDetails.responses.map(res => (
                              <div key={res._id} className="list-group-item">
                                <strong>Report: {res.report?.personName || "Unknown"}</strong>
                                <p className="small mb-0">{res.message}</p>
                                <p className="small text-secondary mb-0">
                                  {new Date(res.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminPanel;