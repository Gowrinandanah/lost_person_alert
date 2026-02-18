// src/services/reportApi.js
import axios from "axios";

// Base URLs
const API_BASE = "http://localhost:5000/api";
const ADMIN_BASE = "http://localhost:5000/api/admin";

// Attach JWT token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Public - get active reports
export const getActiveReports = async () => {
  const { data } = await axios.get(`${API_BASE}/reports/active`);
  return data;
};

// Public - get report by id
export const getReportById = async (id) => {
  const { data } = await axios.get(`${API_BASE}/reports/${id}`);
  return data;
};

// User - get logged in user's reports
export const getMyReports = async () => {
  const { data } = await axios.get(
    `${API_BASE}/reports/my-reports`,
    getAuthHeader()
  );
  return data;
};

// User - create new report
export const createReport = async (formData) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    `${API_BASE}/reports`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// Admin - get all reports
export const getAllReportsAdmin = async () => {
  const { data } = await axios.get(
    `${API_BASE}/reports/admin/all`,
    getAuthHeader()
  );
  return data;
};

// Admin - get report by id
export const getAdminReportById = async (id) => {
  const { data } = await axios.get(
    `${API_BASE}/reports/admin/${id}`,
    getAuthHeader()
  );
  return data;
};

// Admin - approve or reject report
export const updateReportStatus = async (id, status) => {
  const endpoint =
    status === "approved"
      ? `${API_BASE}/reports/admin/${id}/approve`
      : `${API_BASE}/reports/admin/${id}/reject`;

  const { data } = await axios.put(endpoint, {}, getAuthHeader());
  return data;
};

// Admin - flag user
export const flagUser = async (id) => {
  const { data } = await axios.put(
    `${ADMIN_BASE}/users/${id}/flag`,
    {},
    getAuthHeader()
  );
  return data;
};

// Admin - get user details
export const getUserDetails = async (id) => {
  const { data } = await axios.get(
    `${ADMIN_BASE}/users/${id}/details`,
    getAuthHeader()
  );
  return data;
};
