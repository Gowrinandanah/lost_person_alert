// src/components/cards/SightingCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, User } from "lucide-react";

const SightingCard = ({ sighting, isAdmin = false }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="badge bg-warning text-dark">Pending</span>,
      verified: <span className="badge bg-success">Verified</span>,
      matched: <span className="badge bg-info">Matched</span>,
      new_case: <span className="badge bg-primary">New Case</span>,
      irrelevant: <span className="badge bg-secondary">Irrelevant</span>,
      false: <span className="badge bg-danger">False</span>,
      helpful: <span className="badge bg-success">Helpful</span>,
    };
    return badges[sighting.status] || <span className="badge bg-secondary">{sighting.status}</span>;
  };

  const handleClick = () => {
    if (isAdmin) {
      navigate(`/admin/general-sightings/${sighting._id}`);
    } else {
      navigate(`/found/${sighting._id}`);
    }
  };

  return (
    <div 
      className="card h-100 shadow-sm hover-shadow-lg transition cursor-pointer"
      onClick={handleClick}
    >
      {sighting.photo ? (
        <img
          src={`http://localhost:5000/${sighting.photo}`}
          className="card-img-top"
          alt="Sighting"
          style={{ height: "200px", objectFit: "cover" }}
        />
      ) : (
        <div 
          className="bg-light d-flex align-items-center justify-content-center"
          style={{ height: "200px" }}
        >
          <User size={40} className="text-secondary" />
        </div>
      )}

      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">
            {sighting.personDescription?.name || "Unknown Person"}
          </h5>
          {getStatusBadge(sighting.status)}
        </div>

        <div className="small text-secondary mb-2">
          <div className="d-flex align-items-center gap-1 mb-1">
            <MapPin size={14} />
            <span className="text-truncate">{sighting.location}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(sighting.date).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="card-text small text-secondary">
          {sighting.description?.substring(0, 100)}
          {sighting.description?.length > 100 ? "..." : ""}
        </p>

        {sighting.matchedToReport && (
          <div className="mt-2 small text-success">
            ✓ Matched to: {sighting.matchedToReport.personName}
          </div>
        )}

        <div className="mt-2 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Reported by: {sighting.user?.name || "Anonymous"}
          </small>
          {isAdmin && (
            <span className="badge bg-light text-dark">
              {new Date(sighting.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SightingCard;