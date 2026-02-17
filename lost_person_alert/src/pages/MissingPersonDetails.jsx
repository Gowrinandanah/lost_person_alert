import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportById } from "../services/reportApi";

const MissingPersonDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const data = await getReportById(id);
      setReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading details...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Report not found.</p>
      </div>
    );
  }

  const imageUrl = report.photo
    ? `http://localhost:5000/${report.photo}`
    : "https://via.placeholder.com/500";

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        <img
          src={imageUrl}
          alt={report.personName}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4 text-red-600">
            🚨 {report.personName}
          </h1>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <p><strong>Age:</strong> {report.age || "N/A"}</p>
            <p><strong>Gender:</strong> {report.gender || "N/A"}</p>
            <p><strong>Last Seen:</strong> {report.lastSeenLocation || "N/A"}</p>
            <p><strong>Reported By:</strong> {report.user?.name || "Unknown"}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {report.description || "No description provided."}
            </p>
          </div>

          <div className="mt-6 text-sm text-gray-400">
            Reported on{" "}
            {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingPersonDetails;