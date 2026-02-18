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

// -------------------
// Register User
// -------------------
export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

// -------------------
// Login User
// -------------------
export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);

  // Store token automatically after login
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

// -------------------
// Upload Aadhaar
// -------------------
export const uploadAadhaar = async (formData) => {
  const { data } = await API.put("/auth/upload-aadhaar", formData);

  const updatedUser = await getCurrentUser();
  localStorage.setItem("user", JSON.stringify(updatedUser));

  return data;
};


// -------------------
// Get Current User
// -------------------
export const getCurrentUser = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

// -------------------
// Upload Profile Photo
// -------------------
export const uploadProfilePhoto = async (formData) => {
  const { data } = await API.post("/auth/upload-profile-photo", formData);
  return data;
};

/* =========================================
   ADMIN APIs
========================================= */

// -------------------
// Get All Users
// -------------------
export const getAllUsers = async () => {
  const { data } = await API.get("/auth/users");
  return data;
};

// -------------------
// Approve User
// -------------------
export const approveUser = async (userId) => {
  const { data } = await API.put(`/auth/approve/${userId}`);
  return data;
};

/* =========================================
   LOGOUT
========================================= */

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
