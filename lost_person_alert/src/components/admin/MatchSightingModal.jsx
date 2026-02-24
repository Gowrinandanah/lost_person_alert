// src/components/admin/MatchSightingModal.jsx

import React, { useState, useEffect } from "react";
import { X, Search, Check } from "lucide-react";

const MatchSightingModal = ({ sighting, reports, onMatch, onClose }) => {
  const [selectedReportId, setSelectedReportId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredReports = reports.filter(report => 
    report.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReportId) {
      alert("Please select a report to match");
      return;
    }

    setLoading(true);
    await onMatch(selectedReportId, adminNotes);
    setLoading(false);
  };

  const selectedReport = reports.find(r => r._id === selectedReportId);

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">Match Sighting to Report</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Sighting Preview */}
            <div className="bg-light p-3 rounded mb-4">
              <h6 className="fw-bold mb-2">Sighting Details:</h6>
              <p className="mb-1"><strong>Person:</strong> {sighting.personDescription?.name || "Unknown"}</p>
              <p className="mb-1"><strong>Location:</strong> {sighting.location}</p>
              <p className="mb-1"><strong>Date:</strong> {new Date(sighting.date).toLocaleString()}</p>
              <p className="mb-0"><strong>Description:</strong> {sighting.description}</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Search Reports */}
              <div className="mb-3">
                <label className="form-label fw-bold">Search Active Reports</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or case number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Reports List */}
              <div className="mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {filteredReports.length === 0 ? (
                  <p className="text-center text-secondary py-3">No reports found</p>
                ) : (
                  filteredReports.map(report => (
                    <div
                      key={report._id}
                      className={`border rounded p-3 mb-2 cursor-pointer ${
                        selectedReportId === report._id ? "border-success bg-success bg-opacity-10" : ""
                      }`}
                      onClick={() => setSelectedReportId(report._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{report.personName}</h6>
                          <div className="small text-secondary">
                            {report.caseNumber && <span className="me-3">Case: {report.caseNumber}</span>}
                            <span>Status: {report.status}</span>
                          </div>
                          <small className="text-muted">Last seen: {report.lastSeenLocation}</small>
                        </div>
                        {selectedReportId === report._id && (
                          <Check className="text-success" size={20} />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Selected Report Preview */}
              {selectedReport && (
                <div className="alert alert-success mb-3">
                  <h6 className="fw-bold">Selected Report:</h6>
                  <p className="mb-1"><strong>Name:</strong> {selectedReport.personName}</p>
                  <p className="mb-1"><strong>Case:</strong> {selectedReport.caseNumber || "Pending"}</p>
                  <p className="mb-0"><strong>Last Seen:</strong> {selectedReport.lastSeenLocation}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div className="mb-3">
                <label className="form-label fw-bold">Admin Notes (Optional)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Add any notes about this match..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={!selectedReportId || loading}
                >
                  {loading ? "Matching..." : "Match Sighting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSightingModal;