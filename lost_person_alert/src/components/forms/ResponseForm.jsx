// src/components/forms/ResponseForm.jsx

import React, { useState } from "react";
import { MapPin, Calendar, Clock, User, Phone, Mail } from "lucide-react";

const ResponseForm = ({ 
  reportId, 
  onSubmit, 
  initialData = {}, 
  submitLabel = "Submit Sighting",
  isGeneralSighting = false 
}) => {
  const [formData, setFormData] = useState({
    // Sighting details
    location: initialData.location || "",
    date: initialData.date || new Date().toISOString().split("T")[0],
    time: initialData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: initialData.description || "",
    personCondition: initialData.personCondition || "healthy",
    
    // Contact info
    contactName: initialData.contactName || "",
    contactPhone: initialData.contactPhone || "",
    contactEmail: initialData.contactEmail || "",
    
    // General sighting fields (only used when isGeneralSighting = true)
    personName: initialData.personName || "",
    personAge: initialData.personAge || "",
    personGender: initialData.personGender || "",
    personClothing: initialData.personClothing || "",
    personHeight: initialData.personHeight || "",
    personComplexion: initialData.personComplexion || "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.location || !formData.date || !formData.description) {
      alert("Please fill all required fields");
      return;
    }

    // For general sightings, at least some person description is helpful
    if (isGeneralSighting && !formData.personName && !formData.personClothing && !formData.description) {
      const proceed = window.confirm(
        "You haven't provided much information about the person. Continue anyway?"
      );
      if (!proceed) return;
    }

    try {
      setSubmitting(true);
      await onSubmit(reportId, formData);
    } catch (error) {
      alert(error.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* ===== GENERAL SIGHTING FIELDS ===== */}
      {isGeneralSighting && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
            <User size={20} />
            Person Description
          </h3>
          <p className="text-sm text-amber-600 mb-4">
            Describe the person you saw (as much as you can remember)
          </p>

          <div className="space-y-4">
            {/* Person Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Person's Name (if known)
              </label>
              <input
                type="text"
                name="personName"
                value={formData.personName}
                onChange={handleChange}
                placeholder="e.g., Unknown male, elderly woman"
                className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Approximate Age
                </label>
                <input
                  type="text"
                  name="personAge"
                  value={formData.personAge}
                  onChange={handleChange}
                  placeholder="e.g., 30-40, elderly, child"
                  className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Gender
                </label>
                <select
                  name="personGender"
                  value={formData.personGender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="unknown">Can't tell</option>
                </select>
              </div>
            </div>

            {/* Height and Complexion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Height/ Build
                </label>
                <input
                  type="text"
                  name="personHeight"
                  value={formData.personHeight}
                  onChange={handleChange}
                  placeholder="e.g., Tall, short, average"
                  className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Complexion
                </label>
                <input
                  type="text"
                  name="personComplexion"
                  value={formData.personComplexion}
                  onChange={handleChange}
                  placeholder="e.g., Fair, dark, wheatish"
                  className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Clothing */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Clothing Description
              </label>
              <input
                type="text"
                name="personClothing"
                value={formData.personClothing}
                onChange={handleChange}
                placeholder="e.g., Red shirt, blue jeans, black shoes"
                className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== SIGHTING DETAILS ===== */}
      <div className={isGeneralSighting ? "border-t pt-6" : ""}>
        <h3 className="text-lg font-bold mb-4">Sighting Details</h3>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Where did you see them? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Near City Mall, Main Street"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                max={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Person's Condition */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Person's Condition
          </label>
          <select
            name="personCondition"
            value={formData.personCondition}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-emerald-500"
          >
            <option value="healthy">Healthy and normal</option>
            <option value="injured">Injured or unwell</option>
            <option value="confused">Confused or disoriented</option>
            <option value="with_someone">With someone else</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            What did you observe? <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Please describe what you saw..."
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* ===== CONTACT INFORMATION ===== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold mb-4">Your Contact Information (Optional)</h3>
        <p className="text-sm text-slate-500 mb-4">
          This will only be shared with authorities and the reporting family.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Your email"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            Submitting...
          </>
        ) : (
          submitLabel
        )}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Your report will be verified by an admin before being published.
      </p>
    </form>
  );
};

export default ResponseForm;