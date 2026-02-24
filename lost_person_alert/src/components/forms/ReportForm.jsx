// src/components/forms/ReportForm.jsx

import { useState } from "react";
import { createReport } from "../../services/reportApi";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    personName: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    clothing: "",
    description: "",
    lastSeenLocation: "",
    lastSeenDate: "",
    lastSeenTime: "",
    informerName: "",
    informerPhone: "",
    informerRelation: "",
    photo: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const resetForm = () => {
    setFormData({
      personName: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      clothing: "",
      description: "",
      lastSeenLocation: "",
      lastSeenDate: "",
      lastSeenTime: "",
      informerName: "",
      informerPhone: "",
      informerRelation: "",
      photo: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo) {
      alert("Photo is mandatory");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    try {
      setSubmitting(true);
      await createReport(data);
      alert("Report submitted successfully. Awaiting admin approval.");
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Person Details Section - WIDER CARD */}
      <div className="card mb-4 shadow-lg border-0" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div className="card-header bg-light py-3">
          <h4 className="mb-0 fw-bold">Missing Person Details</h4>
        </div>
        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name <span className="text-danger">*</span></label>
            <input
              type="text"
              name="personName"
              className="form-control"
              placeholder="Enter full name"
              value={formData.personName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Age <span className="text-danger">*</span></label>
              <input
                type="number"
                name="age"
                className="form-control"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Gender <span className="text-danger">*</span></label>
              <select
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Height (cm)</label>
              <input
                type="number"
                name="height"
                className="form-control"
                placeholder="Enter height in cm"
                value={formData.height}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                className="form-control"
                placeholder="Enter weight in kg"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Clothing Worn</label>
            <input
              type="text"
              name="clothing"
              className="form-control"
              placeholder="e.g., Blue shirt, black jeans"
              value={formData.clothing}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Physical Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              placeholder="Describe physical features, identifying marks, etc."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Last Seen Section - WIDER CARD */}
      <div className="card mb-4 shadow-lg border-0" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div className="card-header bg-light py-3">
          <h4 className="mb-0 fw-bold">Last Seen Information</h4>
        </div>
        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label fw-bold">Location</label>
            <input
              type="text"
              name="lastSeenLocation"
              className="form-control"
              placeholder="Where were they last seen?"
              value={formData.lastSeenLocation}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className="form-label fw-bold">Date</label>
              <input
                type="date"
                name="lastSeenDate"
                className="form-control"
                value={formData.lastSeenDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Time</label>
              <input
                type="time"
                name="lastSeenTime"
                className="form-control"
                value={formData.lastSeenTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photo Upload Section - WIDER CARD */}
      <div className="card mb-4 shadow-lg border-0" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div className="card-header bg-light py-3">
          <h4 className="mb-0 fw-bold">Photo <span className="text-danger">*</span></h4>
        </div>
        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label">Upload a clear photo of the missing person</label>
            <input
              type="file"
              name="photo"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              required
            />
            <div className="form-text">Accepted formats: JPG, PNG, GIF (Max 5MB)</div>
          </div>
        </div>
      </div>

      {/* Reporter Details Section - WIDER CARD */}
      <div className="card mb-4 shadow-lg border-0" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div className="card-header bg-light py-3">
          <h4 className="mb-0 fw-bold">Your Information</h4>
        </div>
        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label fw-bold">Your Name <span className="text-danger">*</span></label>
            <input
              type="text"
              name="informerName"
              className="form-control"
              placeholder="Enter your full name"
              value={formData.informerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className="form-label fw-bold">Contact Phone <span className="text-danger">*</span></label>
              <input
                type="tel"
                name="informerPhone"
                className="form-control"
                placeholder="Your phone number"
                value={formData.informerPhone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Relationship <span className="text-danger">*</span></label>
              <input
                type="text"
                name="informerRelation"
                className="form-control"
                placeholder="e.g., Father, Friend"
                value={formData.informerRelation}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button - WIDER */}
      <div className="d-grid" style={{ maxWidth: "1000px", margin: "2rem auto" }}>
        <button
          type="submit"
          className="btn btn-success btn-lg py-3"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Submitting...
            </>
          ) : (
            "Submit Report"
          )}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;