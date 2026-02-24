// src/pages/FoundPerson.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicGeneralSightingById } from "../services/reportApi";
import { MapPin, Calendar, User, Phone, Mail, ArrowLeft } from "lucide-react";

const FoundPerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sighting, setSighting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSighting();
  }, [id]);

  const fetchSighting = async () => {
    try {
      setLoading(true);
      const data = await getPublicGeneralSightingById(id);
      setSighting(data);
    } catch (err) {
      setError("Sighting not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !sighting) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="h4 fw-bold mb-2">Not Found</h2>
          <p className="text-secondary mb-4">This sighting could not be found.</p>
          <button
            onClick={() => navigate("/alerts")}
            className="btn btn-success"
          >
            Back to Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-link text-success text-decoration-none mb-4 p-0"
        >
          <ArrowLeft size={20} className="me-1" />
          Back
        </button>

        {/* Main Card */}
        <div className="card border-0 shadow-sm overflow-hidden">
          {sighting.photo && (
            <img
              src={`http://localhost:5000/${sighting.photo}`}
              alt="Sighting"
              className="w-100"
              style={{ height: "300px", objectFit: "cover" }}
            />
          )}

          <div className="card-body p-5">
            
            {/* Header */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <User className="text-success" size={28} />
              </div>
              <div>
                <h1 className="h2 fw-bold mb-1">
                  {sighting.personDescription?.name || "Person Found"}
                </h1>
                <span className="badge bg-success">Verified Sighting</span>
              </div>
            </div>

            {/* Person Description */}
            {(sighting.personDescription?.age || 
              sighting.personDescription?.gender || 
              sighting.personDescription?.height ||
              sighting.personDescription?.complexion ||
              sighting.personDescription?.clothing) && (
              <div className="bg-light p-4 rounded mb-4">
                <h5 className="fw-bold mb-3">Person Description</h5>
                <div className="row g-3">
                  {sighting.personDescription?.age && (
                    <div className="col-md-6">
                      <small className="text-secondary d-block">Age</small>
                      <strong>{sighting.personDescription.age}</strong>
                    </div>
                  )}
                  {sighting.personDescription?.gender && (
                    <div className="col-md-6">
                      <small className="text-secondary d-block">Gender</small>
                      <strong className="text-capitalize">{sighting.personDescription.gender}</strong>
                    </div>
                  )}
                  {sighting.personDescription?.height && (
                    <div className="col-md-6">
                      <small className="text-secondary d-block">Height</small>
                      <strong>{sighting.personDescription.height}</strong>
                    </div>
                  )}
                  {sighting.personDescription?.complexion && (
                    <div className="col-md-6">
                      <small className="text-secondary d-block">Complexion</small>
                      <strong>{sighting.personDescription.complexion}</strong>
                    </div>
                  )}
                  {sighting.personDescription?.clothing && (
                    <div className="col-12">
                      <small className="text-secondary d-block">Clothing</small>
                      <strong>{sighting.personDescription.clothing}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sighting Details */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Sighting Details</h5>
              <div className="d-flex align-items-center gap-2 mb-2">
                <MapPin size={16} className="text-success" />
                <span>{sighting.location}</span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <Calendar size={16} className="text-secondary" />
                <span>{new Date(sighting.date).toLocaleString()}</span>
              </div>
              <div className="bg-light p-3 rounded">
                <p className="mb-0">{sighting.description}</p>
              </div>
            </div>

            {/* Condition */}
            {sighting.personCondition && sighting.personCondition !== "healthy" && (
              <div className="mb-4">
                <h5 className="fw-bold mb-2">Condition</h5>
                <span className="badge bg-warning text-dark p-2">
                  {sighting.personCondition.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Contact Info (if provided and public) */}
            {(sighting.contactName || sighting.contactPhone || sighting.contactEmail) && (
              <div className="border-top pt-4 mt-4">
                <h5 className="fw-bold mb-3">Contact Information</h5>
                {sighting.contactName && (
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <User size={14} className="text-secondary" />
                    <span>{sighting.contactName}</span>
                  </div>
                )}
                {sighting.contactPhone && (
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Phone size={14} className="text-secondary" />
                    <a href={`tel:${sighting.contactPhone}`} className="text-decoration-none">
                      {sighting.contactPhone}
                    </a>
                  </div>
                )}
                {sighting.contactEmail && (
                  <div className="d-flex align-items-center gap-2">
                    <Mail size={14} className="text-secondary" />
                    <a href={`mailto:${sighting.contactEmail}`} className="text-decoration-none">
                      {sighting.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Related Report */}
            {sighting.matchedToReport && (
              <div className="alert alert-success mt-4 mb-0">
                <strong>This sighting has been matched to a case:</strong>
                <div className="mt-2">
                  <a 
                    href={`/person/${sighting.matchedToReport._id}`}
                    className="text-success fw-bold text-decoration-none"
                  >
                    {sighting.matchedToReport.personName} 
                    {sighting.matchedToReport.caseNumber && ` (Case #${sighting.matchedToReport.caseNumber})`}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundPerson;