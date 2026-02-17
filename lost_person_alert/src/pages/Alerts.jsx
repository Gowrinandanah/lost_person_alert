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
    <div className="min-h-screen bg-indigo-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Active Alerts
      </h1>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-8 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          className="p-3 border rounded-lg shadow focus:ring-2 focus:ring-indigo-500"
          value={filters.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="age"
          placeholder="Search by age"
          className="p-3 border rounded-lg shadow focus:ring-2 focus:ring-indigo-500"
          value={filters.age}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Search by location"
          className="p-3 border rounded-lg shadow focus:ring-2 focus:ring-indigo-500"
          value={filters.location}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          className="p-3 border rounded-lg shadow focus:ring-2 focus:ring-indigo-500"
          value={filters.date}
          onChange={handleChange}
        />
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-center text-gray-500">
          No matching alerts found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredReports.map((report) => (
            <PersonCard key={report._id} person={report} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;