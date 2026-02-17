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
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Aadhaar validation (12 digits)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-2">
          Aadhaar Verification
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          To ensure authenticity and prevent misuse, Aadhaar verification is required before reporting a missing person.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Aadhaar Number
            </label>
            <input
              type="text"
              placeholder="Enter 12-digit Aadhaar Number"
              maxLength={12}
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Aadhaar Card Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm"
              required
            />

            <p className="text-xs text-gray-500 mt-1">
              Upload a clear image of your Aadhaar card.
            </p>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img
                src={preview}
                alt="Aadhaar Preview"
                className="w-full rounded-xl border shadow-sm"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl font-semibold shadow-md"
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="mt-6 text-center">
            <p
              className={`text-sm font-medium ${
                message.toLowerCase().includes("fail")
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AadhaarVerification;