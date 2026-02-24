// src/services/authApi.js
import axios from "axios";

/* =========================================
   AXIOS INSTANCE
========================================= */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* =========================================
   REQUEST INTERCEPTOR (Attach Token Automatically)
========================================= */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================
   AUTH APIs
========================================= */

// Register User
export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

// Login User
export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
};

// Upload Aadhaar
export const uploadAadhaar = async (formData) => {
  const { data } = await API.put("/auth/upload-aadhaar", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  
  // Update user in localStorage
  const updatedUser = await getCurrentUser();
  localStorage.setItem("user", JSON.stringify(updatedUser));
  return data;
};

// Get Current User
export const getCurrentUser = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

// Upload Profile Photo
export const uploadProfilePhoto = async (formData) => {
  const { data } = await API.post("/auth/upload-profile-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

// Guest Subscribe
export const guestSubscribe = async (email, location, radius = 10) => {
  const { data } = await API.post("/auth/guest-subscribe", {
    email,
    location,
    radius
  });
  return data;
};

/* =========================================
   ADMIN APIs (FIXED - Use adminRoutes)
========================================= */

// Get all users (from adminRoutes)
export const getAllUsers = async () => {
  const { data } = await API.get("/admin/users/all"); // Changed from /auth/users
  return data;
};

// Get pending users
export const getPendingUsers = async () => {
  const { data } = await API.get("/admin/users/pending");
  return data;
};

// Get approved users
export const getApprovedUsers = async () => {
  const { data } = await API.get("/admin/users/approved");
  return data;
};

// Verify user Aadhaar
export const verifyUserAadhaar = async (userId) => {
  const { data } = await API.put(`/admin/users/${userId}/verify-aadhaar`);
  return data;
};

// Reject user Aadhaar
export const rejectUserAadhaar = async (userId) => {
  const { data } = await API.put(`/admin/users/${userId}/reject-aadhaar`);
  return data;
};

// Flag/Unflag user
export const flagUser = async (userId) => {
  const { data } = await API.put(`/admin/users/${userId}/flag`);
  return data;
};

// Delete user
export const deleteUser = async (userId) => {
  const { data } = await API.delete(`/admin/users/${userId}`);
  return data;
};

// Get user details with reports
export const getUserDetails = async (userId) => {
  const { data } = await API.get(`/admin/users/${userId}/details`);
  return data;
};

// Get dashboard stats
export const getAdminStats = async () => {
  const { data } = await API.get("/admin/stats");
  return data;
};



/* =========================================
   LOGOUT
========================================= */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};