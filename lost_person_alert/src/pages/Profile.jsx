// src/pages/Profile.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, uploadProfilePhoto } from "../services/authApi";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getCurrentUser();
        setUser(data);
        setProfilePhoto(data.profilePhoto || null);

        let percent = 0;
        if (data.name) percent += 10;
        if (data.email) percent += 10;
        if (data.phone) percent += 10;
        if (data.homeLocation?.latitude && data.homeLocation?.longitude)
          percent += 20;
        if (data.profilePhoto) percent += 10;
        if (
          data.aadhaarStatus === "pending" ||
          data.aadhaarStatus === "approved"
        )
          percent += 20;
        if (data.aadhaarStatus === "approved") percent += 20;

        setCompletion(percent);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);
      const updatedUser = await uploadProfilePhoto(formData);
      setUser(updatedUser);
    } catch (err) {
      console.error("❌ Failed to upload profile photo:", err);
      alert("Failed to upload profile photo. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";

  const getAadhaarBadge = () => {
    switch (user.aadhaarStatus) {
      case "approved":
        return <span className="badge bg-success">Approved</span>;
      case "pending":
        return <span className="badge bg-warning text-dark">Pending Approval</span>;
      case "rejected":
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">Not Uploaded</span>;
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="card shadow border-0" style={{ maxWidth: "550px", width: "100%" }}>

        {/* Header */}
        <div className="card-header bg-white border-0 text-center pt-5">
          <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
            <span className="text-success fw-bold fs-4">SR</span>
          </div>
          <h2 className="fw-bold">My Profile</h2>
        </div>

        {/* Body */}
        <div className="card-body px-5 pb-5">

          {/* Profile Photo */}
          <div className="text-center mb-4">
            {profilePhoto ? (
              <img
                src={
                  profilePhoto.startsWith("http")
                    ? profilePhoto
                    : `http://localhost:5000/${profilePhoto}`
                }
                alt="Profile"
                className="rounded-circle border border-4 border-success"
                style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => fileInputRef.current.click()}
              />
            ) : (
              <div
                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "100px", height: "100px", fontSize: "2.5rem", cursor: "pointer" }}
                onClick={() => fileInputRef.current.click()}
              >
                {firstLetter}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="d-none"
              onChange={handleFileChange}
            />
            
            <p className="text-secondary small mt-2">Click to change photo</p>
          </div>

          {/* User Info */}
          <table className="table table-borderless mb-4">
            <tbody>
              <tr>
                <td className="fw-bold text-secondary">Name</td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td className="fw-bold text-secondary">Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td className="fw-bold text-secondary">Phone</td>
                <td>{user.phone || "Not Added"}</td>
              </tr>
              <tr>
                <td className="fw-bold text-secondary">Home Location</td>
                <td>{user.homeLocation ? "Added ✓" : "Not Added ✗"}</td>
              </tr>
              <tr>
                <td className="fw-bold text-secondary">Aadhaar Status</td>
                <td>{getAadhaarBadge()}</td>
              </tr>
            </tbody>
          </table>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-1">
              <span className="fw-bold small">Profile Completion</span>
              <span className="fw-bold small">{completion}%</span>
            </div>
            <div className="progress" style={{ height: "10px" }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${completion}%` }}
                role="progressbar"
              />
            </div>
          </div>

          {/* Action Button */}
          {user.aadhaarStatus === "not_uploaded" && (
            <button
              onClick={() => navigate("/verify-aadhaar")}
              className="btn btn-success w-100 py-3 fw-bold"
            >
              Complete Aadhaar Verification
            </button>
          )}

          {/* Fully Approved Message */}
          {completion === 100 && user.aadhaarStatus === "approved" && (
            <div className="alert alert-success text-center mt-4 mb-0">
              🎉 Profile Fully Verified & Approved
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;