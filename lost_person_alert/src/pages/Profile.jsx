// src/pages/Profile.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, uploadProfilePhoto } from "../services/authApi";
import { ShieldCheck } from "lucide-react";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";

  const getAadhaarBadge = () => {
    switch (user.aadhaarStatus) {
      case "approved":
        return (
          <span className="text-emerald-600 font-semibold">Approved</span>
        );
      case "pending":
        return (
          <span className="text-yellow-600 font-semibold">Pending Approval</span>
        );
      case "rejected":
        return <span className="text-red-500 font-semibold">Rejected</span>;
      default:
        return <span className="text-slate-400 font-semibold">Not Uploaded</span>;
    }
  };

  // ================== PROFILE PHOTO UPLOAD ==================
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const updatedUser = await uploadProfilePhoto(formData);
      setUser(updatedUser);
      console.log("✅ Profile photo updated");
    } catch (err) {
      console.error("❌ Failed to upload profile photo:", err);
      alert("Failed to upload profile photo. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-xl border">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tight">
            Safe<span className="text-emerald-600">Return</span>
          </span>
        </div>

        <h2 className="text-2xl font-black text-center text-slate-900 mb-8">
          My Profile
        </h2>

        {/* Profile Photo */}
        <div className="flex justify-center mb-6 relative">
          {profilePhoto ? (
            <img
              src={
                profilePhoto.startsWith("http")
                  ? profilePhoto
                  : `http://localhost:5000/${profilePhoto}`
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-emerald-600 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full bg-slate-900 flex items-center justify-center text-white text-4xl font-bold cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {firstLetter}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Basic Info */}
        <div className="space-y-3 mb-8 text-sm">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "Not Added"}</p>
          <p>
            <strong>Home Location:</strong>{" "}
            {user.homeLocation ? "Added" : "Not Added"}
          </p>
          <p>
            <strong>Aadhaar Status:</strong> {getAadhaarBadge()}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <p className="font-semibold mb-2 text-sm">
            Profile Completion: {completion}%
          </p>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {user.aadhaarStatus === "not_uploaded" && (
          <button
            onClick={() => navigate("/verify-aadhaar")}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition"
          >
            Complete Aadhaar Verification
          </button>
        )}

        {/* Fully Approved Message */}
        {completion === 100 && user.aadhaarStatus === "approved" && (
          <div className="mt-6 text-center text-emerald-700 font-bold">
            🎉 Profile Fully Verified & Approved
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
