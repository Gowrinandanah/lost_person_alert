// src/pages/Register.jsx
import React, { useState } from "react";
import { registerUser } from "../services/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [location, setLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        setLocation(coords);
        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
        alert("Unable to fetch location.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please fetch home location.");
      return;
    }

    setLoadingSubmit(true);

    try {
      const res = await registerUser({
        ...formData,
        homeLocation: {
          latitude: parseFloat(location.split(",")[0]),
          longitude: parseFloat(location.split(",")[1]),
        },
      });

      setMessage(res.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" required onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl" />

          <input name="email" type="email" placeholder="Email" required onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl" />

          <input name="phone" placeholder="Phone" required onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl" />

          <input name="password" type="password" placeholder="Password" required onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl" />

          <div className="flex gap-2">
            <input value={location} readOnly placeholder="Home Location"
              className="flex-1 px-4 py-3 border rounded-xl" />
            <button type="button" onClick={fetchLocation}
              className="bg-purple-500 text-white px-4 rounded-xl">
              {loadingLocation ? "..." : "Fetch"}
            </button>
          </div>

          <button type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl">
            {loadingSubmit ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Register;