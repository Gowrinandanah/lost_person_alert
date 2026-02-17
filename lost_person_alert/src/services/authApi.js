// src/services/authApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

// -------------------
// Register User
// -------------------
export const registerUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/register`, userData);
  return response.data;
};

// -------------------
// Login User
// -------------------
export const loginUser = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/login`, credentials);
  return response.data;
};

// -------------------
// Upload Aadhaar (Step 2)
// -------------------
export const uploadAadhaar = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${BASE_URL}/upload-aadhaar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// -------------------
// Get all users (Admin)
// -------------------
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:5000/api/admin/users",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// -------------------
// Approve User (Admin)
// -------------------
export const approveUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `http://localhost:5000/api/admin/users/${userId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
// -------------------



//------get current user-----------//
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


//============upload profile pic===============/
export const uploadProfilePhoto = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    "http://localhost:5000/api/auth/upload-profile-photo",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};