// src/pages/AadhaarVerification.jsx

import React, { useState } from "react";
import { uploadAadhaar } from "../services/authApi";

const AadhaarVerification = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarPhoto, setAadhaarPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAadhaarPhoto(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(aadhaarNumber)) {
      setMessage("Aadhaar number must be exactly 12 digits.");
      return;
    }

    if (!aadhaarPhoto) {
      setMessage("Please upload your Aadhaar photo.");
      return;
    }

    const formData = new FormData();
    formData.append("aadhaarNumber", aadhaarNumber);
    formData.append("aadhaarPhoto", aadhaarPhoto);

    try {
      setLoading(true);
      const res = await uploadAadhaar(formData);
      setMessage(res.message || "Submitted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="card shadow-lg border-0" style={{ maxWidth: "500px", width: "100%" }}>

        {/* Header */}
        <div className="card-header bg-white border-0 text-center pt-5">
          <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
            <span className="text-success fw-bold fs-4">✓</span>
          </div>
          <h2 className="fw-bold">Aadhaar Verification</h2>
          <p className="text-secondary small">Required before reporting a missing person</p>
        </div>

        {/* Body */}
        <div className="card-body px-5 pb-5">
          <form onSubmit={handleSubmit}>
            
            {/* Aadhaar Number */}
            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">AADHAAR NUMBER</label>
              <input
                type="text"
                className="form-control form-control-lg bg-light border"
                placeholder="Enter 12-digit Aadhaar Number"
                maxLength={12}
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                required
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">UPLOAD AADHAAR PHOTO</label>
              <input
                type="file"
                className="form-control form-control-lg bg-light border"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <div className="form-text">Accepted formats: JPG, PNG, GIF (Max 5MB)</div>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mb-4 text-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="img-fluid rounded border"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-success w-100 py-3 fw-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Submitting...
                </>
              ) : (
                "Submit for Verification"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`alert mt-4 text-center small ${
              message.toLowerCase().includes("fail") || message.toLowerCase().includes("invalid")
                ? "alert-danger"
                : "alert-success"
            }`}>
              {message}
            </div>
          )}

          {/* Note */}
          <p className="text-secondary text-center small mt-4 mb-0">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default AadhaarVerification;