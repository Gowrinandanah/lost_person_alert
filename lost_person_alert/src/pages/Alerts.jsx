// src/pages/Alerts.jsx

import React, { useEffect, useState } from "react";
import { getActiveReports } from "../services/reportApi";
import PersonCard from "../components/cards/PersonCard";

const Alerts = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    age: "",
    location: "",
    date: "",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getActiveReports();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredReports = reports.filter((report) => {
    const matchName = filters.name
      ? report.personName
          ?.toLowerCase()
          .includes(filters.name.toLowerCase())
      : true;

    const matchAge = filters.age
      ? report.age === Number(filters.age)
      : true;

    const matchLocation = filters.location
      ? report.lastSeenLocation
          ?.toLowerCase()
          .includes(filters.location.toLowerCase())
      : true;

    const matchDate = filters.date
      ? new Date(report.createdAt)
          .toISOString()
          .split("T")[0] === filters.date
      : true;

    return matchName && matchAge && matchLocation && matchDate;
  });

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container">
        
        {/* Header */}
        <h1 className="text-center fw-bold mb-4">Active Alerts</h1>

        {/* Filters Row */}
        <div className="row g-3 mb-5">
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Search by name"
              value={filters.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              name="age"
              className="form-control"
              placeholder="Search by age"
              value={filters.age}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="Search by location"
              value={filters.location}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="date"
              name="date"
              className="form-control"
              value={filters.date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Results */}
        {filteredReports.length === 0 ? (
          <p className="text-center text-secondary">
            No matching alerts found.
          </p>
        ) : (
          <div className="row g-4">
            {filteredReports.map((report) => (
              <div key={report._id} className="col-md-6 col-lg-4">
                <PersonCard person={report} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;