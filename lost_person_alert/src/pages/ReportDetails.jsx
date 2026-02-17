import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportById } from "../services/reportApi";

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await getReportById(id);
      setReport(data);
    };
    fetchReport();
  }, [id]);

  if (!report) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6">{report.personName}</h2>
      <img src={`http://localhost:5000/${report.photo}`} alt={report.personName} className="w-full max-h-96 object-cover rounded mb-6" />

      <h3 className="text-xl font-semibold mb-2">Details</h3>
      <p><strong>Age:</strong> {report.age}</p>
      <p><strong>Gender:</strong> {report.gender}</p>
      <p><strong>Height:</strong> {report.height || "N/A"} cm</p>
      <p><strong>Weight:</strong> {report.weight || "N/A"} kg</p>
      <p><strong>Clothing:</strong> {report.clothing || "N/A"}</p>
      <p><strong>Last Seen Location:</strong> {report.lastSeenLocation || "N/A"}</p>
      <p><strong>Last Seen Date:</strong> {new Date(report.lastSeenDate).toLocaleDateString()}</p>
      <p><strong>Last Seen Time:</strong> {report.lastSeenTime}</p>
      <p><strong>Description:</strong> {report.description}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Reporter Information</h3>
      <p><strong>Name:</strong> {report.informerName || report.user?.name}</p>
      <p><strong>Phone:</strong> {report.informerPhone || report.user?.phone}</p>
      <p><strong>Relation:</strong> {report.informerRelation || "N/A"}</p>
    </div>
  );
};

export default ReportDetails;