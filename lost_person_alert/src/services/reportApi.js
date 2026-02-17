// src/services/reportApi.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";
const ADMIN_BASE = "http://localhost:5000/api/admin";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ========================
// 🌍 PUBLIC REPORTS
// ========================

export const getActiveReports = async () => {
  const response = await axios.get(`${API_BASE}/reports/active`);
  return response.data;
};

export const getReportById = async (id) => {
  const response = await axios.get(`${API_BASE}/reports/${id}`);
  return response.data;
};

// ========================
// 👤 USER REPORTS
// ========================

export const getMyReports = async () => {
  const response = await axios.get(
    `${API_BASE}/reports/my-reports`,
    getAuthHeader()
  );
  return response.data;
};

// ========================
// ➕ CREATE REPORT (NEW)
// ========================

export const createReport = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_BASE}/reports`,
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

/// ========================
// 🛠 ADMIN REPORTS
// ========================

export const getAllReportsAdmin = async () => {
  const response = await axios.get(
    `${API_BASE}/reports/admin/all`,
    getAuthHeader()
  );
  return response.data;
};

export const getAdminReportById = async (id) => {
  const response = await axios.get(
    `${API_BASE}/reports/admin/${id}`,
    getAuthHeader()
  );
  return response.data;
};

export const updateReportStatus = async (id, status) => {
  const endpoint =
    status === "approved"
      ? `${API_BASE}/reports/admin/${id}/approve`
      : `${API_BASE}/reports/admin/${id}/reject`;

  const response = await axios.put(
    endpoint,
    {},
    getAuthHeader()
  );

  return response.data;
};

// ========================
// 🚩 FLAG USER
// ========================

export const flagUser = async (id) => {
  const response = await axios.put(
    `${ADMIN_BASE}/users/${id}/flag`,
    {},
    getAuthHeader()
  );
  return response.data;
};

// ========================
// 🔍 ADMIN - USER DETAILS
// ========================

export const getUserDetails = async (id) => {
  const response = await axios.get(
    `${ADMIN_BASE}/users/${id}/details`,
    getAuthHeader()
  );
  return response.data;
};