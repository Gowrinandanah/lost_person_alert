// src/pages/Register.jsx

import React, { useState } from "react";
import { registerUser } from "../services/authApi";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="card shadow border-0" style={{ maxWidth: "800px", width: "100%" }}>

        {/* Header */}
        <div className="card-header bg-white border-0 text-center pt-5">
          <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
            <span className="text-success fw-bold fs-4">SR</span>
          </div>
          <h2 className="fw-bold">Create Account</h2>
          <p className="text-secondary small">Join the SafeReturn network</p>
        </div>

        {/* Body */}
        <div className="card-body px-5 pb-5">
          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">FULL NAME</label>
              <input
                name="name"
                type="text"
                className="form-control form-control-lg bg-light border"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">EMAIL</label>
              <input
                name="email"
                type="email"
                className="form-control form-control-lg bg-light border"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">PHONE</label>
              <input
                name="phone"
                type="tel"
                className="form-control form-control-lg bg-light border"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">PASSWORD</label>
              <input
                name="password"
                type="password"
                className="form-control form-control-lg bg-light border"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">HOME LOCATION</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border"
                  placeholder="Click Fetch to get location"
                  value={location}
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={fetchLocation}
                  disabled={loadingLocation}
                >
                  {loadingLocation ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    "Fetch"
                  )}
                </button>
              </div>
              <div className="form-text">We need your location to show nearby alerts</div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-success w-100 py-3 fw-bold"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`alert mt-4 text-center small ${
              message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")
                ? "alert-danger"
                : "alert-success"
            }`}>
              {message}
            </div>
          )}

          {/* Login Link */}
          <div className="text-center mt-4 text-secondary">
            Already have an account?{" "}
            <Link to="/login" className="text-success fw-bold text-decoration-none">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;