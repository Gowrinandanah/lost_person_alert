// src/pages/GeneralSighting.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  getReportById, 
  submitResponse,
  submitGeneralSighting 
} from "../services/reportApi";
import ResponseForm from "../components/forms/ResponseForm";
import { ArrowLeft, AlertCircle, Globe } from "lucide-react";

const GeneralSighting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isGeneralSighting = !id;

  // ✅ CHECK AUTHENTICATION FIRST
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      alert("Please login to submit a sighting");
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchReport();
    }
  }, [id, isAuthenticated]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getReportById(id);
      setReport(data);
    } catch (err) {
      setError("Failed to load report details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (reportId, formData) => {
    // Double-check authentication before submit
    if (!isAuthenticated) {
      alert("Please login to submit a sighting");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      
      if (isGeneralSighting) {
        const sightingFormData = new FormData();
        
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
            sightingFormData.append(key, formData[key]);
          }
        });

        if (formData.personName) sightingFormData.append("personName", formData.personName);
        if (formData.personAge) sightingFormData.append("personAge", formData.personAge);
        if (formData.personGender) sightingFormData.append("personGender", formData.personGender);
        if (formData.personHeight) sightingFormData.append("personHeight", formData.personHeight);
        if (formData.personComplexion) sightingFormData.append("personComplexion", formData.personComplexion);
        if (formData.personClothing) sightingFormData.append("personClothing", formData.personClothing);
        if (formData.photo) sightingFormData.append("photo", formData.photo);

        await submitGeneralSighting(sightingFormData);
        alert("General sighting submitted successfully! An admin will review it.");
        navigate("/alerts");
      } else {
        await submitResponse(reportId, formData);
        alert("Sighting submitted successfully! It will be verified by admin.");
        navigate(`/person/${id}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.response?.data?.message || "Failed to submit sighting");
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full" />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect from useEffect)
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/alerts")}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
          >
            Back to Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          {isGeneralSighting ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Globe className="text-emerald-600" size={28} />
                </div>
                <h1 className="text-3xl font-bold">General Sighting Report</h1>
              </div>
              <p className="text-slate-600">
                Saw someone who might be missing? Report the details here. 
                An admin will review and match it to existing cases or create a new report.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-3">Report a Sighting</h1>
              <p className="text-slate-600 mb-2">
                You are reporting a sighting for: <span className="font-semibold text-emerald-600">{report?.personName}</span>
              </p>
              {report?.caseNumber && (
                <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Case #{report.caseNumber}
                </span>
              )}
            </>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <ResponseForm 
            reportId={id}
            onSubmit={handleSubmit}
            isGeneralSighting={isGeneralSighting}
            initialData={{
              contactName: user?.name || "",
              contactPhone: user?.phone || "",
              contactEmail: user?.email || "",
            }}
            submitLabel={isGeneralSighting ? "Submit General Sighting" : "Submit Sighting"}
            submitting={submitting}
          />
        </div>

        {/* Info Note for General Sightings */}
        {isGeneralSighting && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> General sightings are reviewed by admins. 
              If matched to an existing case, you'll be notified. Your contact information 
              will only be shared with authorities and the reporting family.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSighting;