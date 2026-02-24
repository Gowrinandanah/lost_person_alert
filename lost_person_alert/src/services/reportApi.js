// src/services/reportApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor
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
   PUBLIC ROUTES
========================================= */

// Get active reports
export const getActiveReports = async () => {
  const { data } = await API.get("/reports/active");
  return data;
};

// Get report by id (public)
export const getReportById = async (id) => {
  const { data } = await API.get(`/reports/${id}`);
  return data;
};

// Get responses for a report - FIXED VERSION
export const getReportResponses = async (reportId) => {
  try {
    const { data } = await API.get(`/reports/${reportId}/responses`);
    return data;
  } catch (error) {
    console.log("Responses endpoint not available yet");
    return []; // Return empty array instead of throwing error
  }
};

// Get public general sightings
export const getPublicGeneralSightings = async () => {
  const { data } = await API.get("/reports/general-sightings/public");
  return data;
};

// Get single public general sighting
export const getPublicGeneralSightingById = async (id) => {
  const { data } = await API.get(`/reports/general-sightings/${id}`);
  return data;
};

/* =========================================
   USER ROUTES
========================================= */

// Get my reports
export const getMyReports = async () => {
  const { data } = await API.get("/reports/my-reports");
  return data;
};

// Create new report
export const createReport = async (formData) => {
  const { data } = await API.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

// Submit response to a report (linked sighting)
export const submitResponse = async (reportId, responseData) => {
  const { data } = await API.post(`/reports/${reportId}/responses`, responseData);
  return data;
};

// Submit general sighting
export const submitGeneralSighting = async (formData) => {
  const { data } = await API.post("/reports/general-sighting", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

/* =========================================
   ADMIN ROUTES
========================================= */

// REPORT MANAGEMENT
export const getAllReportsAdmin = async () => {
  const { data } = await API.get("/admin/reports");
  return data;
};

export const getPendingReports = async () => {
  const { data } = await API.get("/admin/reports/pending");
  return data;
};

export const getAdminReportById = async (id) => {
  const { data } = await API.get(`/admin/reports/${id}`);
  return data;
};

export const updateReportStatus = async (id, status) => {
  const { data } = await API.put(`/admin/reports/${id}`, { status });
  return data;
};

// RESPONSE MANAGEMENT (linked sightings)
export const getAllResponsesAdmin = async () => {
  const { data } = await API.get("/admin/responses");
  return data;
};

export const getPendingResponses = async () => {
  const { data } = await API.get("/admin/responses/pending");
  return data;
};

export const verifyResponse = async (id, status) => {
  const { data } = await API.put(`/admin/responses/${id}/verify`, { status });
  return data;
};

// GENERAL SIGHTING MANAGEMENT
export const getAllGeneralSightings = async (status = "") => {
  const url = status ? `/admin/general-sightings?status=${status}` : "/admin/general-sightings";
  const { data } = await API.get(url);
  return data;
};

export const getPendingGeneralSightings = async () => {
  const { data } = await API.get("/admin/general-sightings/pending");
  return data;
};

export const getGeneralSightingById = async (id) => {
  const { data } = await API.get(`/admin/general-sightings/${id}`);
  return data;
};

export const getActiveReportsForMatching = async () => {
  const { data } = await API.get("/admin/active-reports-for-matching");
  return data;
};

export const matchSightingToReport = async (sightingId, reportId, adminNotes = "") => {
  const { data } = await API.put(`/admin/general-sightings/${sightingId}/match`, {
    reportId,
    adminNotes
  });
  return data;
};

export const createReportFromSighting = async (sightingId, formData) => {
  const { data } = await API.post(`/admin/general-sightings/${sightingId}/create-report`, 
    formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
  return data;
};

export const rejectGeneralSighting = async (sightingId, adminNotes = "") => {
  const { data } = await API.put(`/admin/general-sightings/${sightingId}/reject`, {
    adminNotes
  });
  return data;
};

export const getGeneralSightingStats = async () => {
  const { data } = await API.get("/admin/stats/general-sightings");
  return data;
};

// DASHBOARD STATS
export const getAdminStats = async () => {
  const { data } = await API.get("/admin/stats");
  return data;
};

// Get responses for reporter (includes contact info)
export const getReporterResponses = async (reportId) => {
  const { data } = await API.get(`/reports/${reportId}/reporter-responses`);
  return data;
};