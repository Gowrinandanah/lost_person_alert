// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authApi";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

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

        let percent = 0;
        if (data.name) percent += 10;
        if (data.email) percent += 10;
        if (data.phone) percent += 10;

        if (
          data.homeLocation &&
          data.homeLocation.latitude &&
          data.homeLocation.longitude
        ) {
          percent += 20;
        }

        if (data.aadhaarNumber) percent += 25;
        if (data.aadhaarPhoto) percent += 25;

        if (data.profilePic) percent += 10; // optional bonus

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
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold mb-6 text-center">
          My Profile
        </h2>

        {/* Profile Picture Section */}
        <div className="flex justify-center mb-6">
          {user.profilePic ? (
            <img
              src={`http://localhost:5000/${user.profilePic}`}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
              {firstLetter}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="space-y-2 mb-6">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "Not Added"}</p>
          <p>
            <strong>Home Location:</strong>{" "}
            {user.homeLocation ? "Added" : "Not Added"}
          </p>
        </div>

        {/* Verification Status */}
        <div className="mb-6">
          <p>
            <strong>Aadhaar Status:</strong>{" "}
            {user.isVerified ? (
              <span className="text-green-600 font-semibold">
                Submitted
              </span>
            ) : (
              <span className="text-red-500 font-semibold">
                Not Submitted
              </span>
            )}
          </p>

          <p>
            <strong>Admin Approval:</strong>{" "}
            {user.isApproved ? (
              <span className="text-green-600 font-semibold">
                Approved
              </span>
            ) : (
              <span className="text-yellow-600 font-semibold">
                Pending
              </span>
            )}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <p className="font-semibold mb-2">
            Profile Completion: {completion}%
          </p>

          <div className="w-full bg-gray-300 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {!user.isVerified && (
          <button
            onClick={() => navigate("/verify-aadhaar")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl mt-4"
          >
            Complete Aadhaar Verification
          </button>
        )}

        {completion >= 100 && user.isApproved && (
          <div className="mt-6 text-center text-green-700 font-bold">
            🎉 Profile Fully Verified & Approved
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;