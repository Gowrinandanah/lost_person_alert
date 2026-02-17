// src/services/messageApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/admin";

export const getAllResponses = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/responses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};