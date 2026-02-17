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
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Person Details */}
      <input
        type="text"
        name="personName"
        placeholder="Full Name"
        value={formData.personName}
        onChange={handleChange}
        required
        className="w-full border px-4 py-2 rounded"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      <input
        type="text"
        name="clothing"
        placeholder="Clothing Worn"
        value={formData.clothing}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Physical Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
      />

      {/* Last Seen */}
      <input
        type="text"
        name="lastSeenLocation"
        placeholder="Last Seen Location"
        value={formData.lastSeenLocation}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="date"
          name="lastSeenDate"
          value={formData.lastSeenDate}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="time"
          name="lastSeenTime"
          value={formData.lastSeenTime}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <label className="block font-semibold">
          Upload Photo <span className="text-red-500">*</span>
        </label>

        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      {/* Reporter Details */}
      <h3 className="font-semibold mt-4">Reporter Details</h3>

      <input
        type="text"
        name="informerName"
        placeholder="Your Name"
        value={formData.informerName}
        onChange={handleChange}
        required
        className="w-full border px-4 py-2 rounded"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="tel"
          name="informerPhone"
          placeholder="Contact Phone"
          value={formData.informerPhone}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="informerRelation"
          placeholder="Relationship"
          value={formData.informerRelation}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
};

export default ReportForm;