// src/components/admin/GeneralSightingsPanel.jsx

import React, { useEffect, useState } from "react";
import {
  getAllGeneralSightings,
  getPendingGeneralSightings,
  getActiveReportsForMatching,
  matchSightingToReport,
  createReportFromSighting,
  rejectGeneralSighting,
  getGeneralSightingStats
} from "../../services/reportApi";
import SightingCard from "../cards/SightingCard";
import MatchSightingModal from "./MatchSightingModal";
import CreateReportModal from "./CreateReportModal";
import { Eye, CheckCircle, XCircle, FileText } from "lucide-react";

const GeneralSightingsPanel = () => {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [stats, setStats] = useState({
    pending: 0,
    matched: 0,
    newCases: 0,
    irrelevant: 0,
    total: 0
  });

  const [selectedSighting, setSelectedSighting] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reportsForMatching, setReportsForMatching] = useState([]);

  useEffect(() => {
    fetchSightings();
    fetchStats();
    fetchReportsForMatching();
  }, [activeTab]);

  const fetchSightings = async () => {
    try {
      setLoading(true);
      let data;
      if (activeTab === "pending") {
        data = await getPendingGeneralSightings();
      } else {
        data = await getAllGeneralSightings(activeTab !== "all" ? activeTab : "");
      }
      setSightings(data);
    } catch (error) {
      console.error("Error fetching sightings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getGeneralSightingStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchReportsForMatching = async () => {
    try {
      const data = await getActiveReportsForMatching();
      setReportsForMatching(data);
    } catch (error) {
      console.error("Error fetching reports for matching:", error);
    }
  };

  const handleMatch = async (reportId, adminNotes) => {
    try {
      await matchSightingToReport(selectedSighting._id, reportId, adminNotes);
      alert("Sighting matched successfully!");
      setShowMatchModal(false);
      setSelectedSighting(null);
      fetchSightings();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to match sighting");
    }
  };

  const handleCreateReport = async (formData) => {
    try {
      await createReportFromSighting(selectedSighting._id, formData);
      alert("New report created successfully!");
      setShowCreateModal(false);
      setSelectedSighting(null);
      fetchSightings();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create report");
    }
  };

  const handleReject = async (sightingId) => {
    if (!window.confirm("Are you sure you want to mark this sighting as irrelevant?")) return;
    
    try {
      await rejectGeneralSighting(sightingId, "Marked as irrelevant by admin");
      alert("Sighting marked as irrelevant");
      fetchSightings();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject sighting");
    }
  };

  const tabs = [
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "matched", label: "Matched", count: stats.matched },
    { id: "new_case", label: "New Cases", count: stats.newCases },
    { id: "irrelevant", label: "Irrelevant", count: stats.irrelevant },
    { id: "all", label: "All", count: stats.total },
  ];

  return (
    <div>
      <h2 className="text-2xl fw-bold mb-4">General Sightings Management</h2>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-warning bg-opacity-10 border-0">
            <div className="card-body">
              <h6 className="text-secondary small">Pending</h6>
              <h3 className="fw-bold">{stats.pending}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info bg-opacity-10 border-0">
            <div className="card-body">
              <h6 className="text-secondary small">Matched</h6>
              <h3 className="fw-bold">{stats.matched}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary bg-opacity-10 border-0">
            <div className="card-body">
              <h6 className="text-secondary small">New Cases</h6>
              <h3 className="fw-bold">{stats.newCases}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-secondary bg-opacity-10 border-0">
            <div className="card-body">
              <h6 className="text-secondary small">Total</h6>
              <h3 className="fw-bold">{stats.total}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {tabs.map(tab => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active fw-bold" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} {tab.count > 0 && <span className="badge bg-secondary ms-1">{tab.count}</span>}
            </button>
          </li>
        ))}
      </ul>

      {/* Sightings Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : sightings.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-secondary mb-0">No sightings found</p>
        </div>
      ) : (
        <div className="row g-4">
          {sightings.map(sighting => (
            <div key={sighting._id} className="col-md-6 col-lg-4">
              <div className="position-relative">
                <SightingCard sighting={sighting} isAdmin={true} />
                
                {/* Action Buttons for Pending */}
                {sighting.status === "pending" && (
                  <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setSelectedSighting(sighting);
                        setShowMatchModal(true);
                      }}
                      title="Match to existing report"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setSelectedSighting(sighting);
                        setShowCreateModal(true);
                      }}
                      title="Create new report"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleReject(sighting._id)}
                      title="Mark as irrelevant"
                    >
                      <XCircle size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => window.open(`/admin/general-sightings/${sighting._id}`, '_blank')}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showMatchModal && selectedSighting && (
        <MatchSightingModal
          sighting={selectedSighting}
          reports={reportsForMatching}
          onMatch={handleMatch}
          onClose={() => {
            setShowMatchModal(false);
            setSelectedSighting(null);
          }}
        />
      )}

      {showCreateModal && selectedSighting && (
        <CreateReportModal
          sighting={selectedSighting}
          onCreate={handleCreateReport}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedSighting(null);
          }}
        />
      )}
    </div>
  );
};

export default GeneralSightingsPanel;