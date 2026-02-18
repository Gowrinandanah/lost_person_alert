import React, { useState } from "react";
import { uploadAadhaar } from "../services/authApi";
import { ShieldCheck, CreditCard, Image } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl border">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tight">
            Safe<span className="text-emerald-600">Return</span>
          </span>
        </div>

        <h2 className="text-2xl font-black text-center text-slate-900 mb-2">
          Aadhaar Verification
        </h2>

        <p className="text-sm text-slate-500 text-center mb-8">
          Verification is required before reporting a missing person.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Aadhaar Number */}
          <div className="relative">
            <CreditCard
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Enter 12-digit Aadhaar Number"
              maxLength={12}
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="text-xs uppercase font-bold text-slate-400">
              Upload Aadhaar Photo
            </label>

            <div className="relative mt-2">
              <Image
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-emerald-600 file:text-white file:text-sm hover:file:bg-emerald-700"
              />
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="Aadhaar Preview"
              className="w-full rounded-xl border mt-4"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition"
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-6 text-center text-sm font-medium ${
              message.toLowerCase().includes("fail")
                ? "text-red-500"
                : "text-emerald-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AadhaarVerification;
