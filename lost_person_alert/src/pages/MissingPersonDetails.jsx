// src/pages/MissingPersonDetails.jsx

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getReportById, getReportResponses, getReporterResponses } from "../services/reportApi";
import { MapPin, Calendar, User, Phone, Mail, Eye } from "lucide-react";

const MissingPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext); // Add AuthContext
  
  const [report, setReport] = useState(null);
  const [responses, setResponses] = useState([]);
  const [responseCount, setResponseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReporter, setIsReporter] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch report details
      const reportData = await getReportById(id);
      setReport(reportData);
      
      // Check if current user is reporter or admin
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const reporterId = reportData.user?._id;
      const userIsReporter = currentUser.id === reporterId;
      const userIsAdmin = currentUser.role === 'admin';
      
      setIsReporter(userIsReporter || userIsAdmin);
      setIsAdmin(userIsAdmin);

      if (userIsReporter || userIsAdmin) {
        // Reporter or Admin: Fetch all responses with contact info
        try {
          const responsesData = await getReporterResponses(id);
          setResponses(responsesData);
          setResponseCount(responsesData.length);
        } catch (err) {
          console.log("Could not fetch responses");
          setResponses([]);
          setResponseCount(0);
        }
      } else {
        // Public: Only fetch count (via public endpoint)
        try {
          const publicResponses = await getReportResponses(id);
          setResponseCount(publicResponses.length);
        } catch {
          setResponseCount(0);
        }
      }
      
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Report not found");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated sighting click handler with Aadhaar check
  const handleSightingClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      const proceed = window.confirm(
        "⚠️ Login Required\n\n" +
        "You need to be logged in to report a sighting.\n\n" +
        "Would you like to login now?"
      );
      
      if (proceed) {
        navigate("/login");
      }
      return;
    }
    
    // Check if user has verified Aadhaar
    if (user?.aadhaarStatus !== "approved") {
      const proceed = window.confirm(
        "⚠️ Aadhaar Verification Required\n\n" +
        "To ensure the credibility of sightings, you must verify your Aadhaar before reporting a sighting.\n\n" +
        "Would you like to verify now?"
      );
      
      if (proceed) {
        navigate("/verify-aadhaar");
      }
      return;
    }
    
    navigate(`/sighting/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Report Not Found</h2>
          <p className="text-gray-600 mb-6">The missing person report you're looking for doesn't exist or has been removed.</p>
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

  // Use SVG fallback instead of placeholder.com
  const imageUrl = report.photo
    ? `http://localhost:5000/${report.photo}`
    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button */}
        <button
          onClick={() => navigate("/alerts")}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-6 transition"
        >
          ← Back to Alerts
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <img
            src={imageUrl}
            alt={report.personName}
            className="w-full h-96 object-cover"
          />

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-red-600">
                🚨 {report.personName}
              </h1>
              
              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                report.status === 'approved' ? 'bg-green-100 text-green-700' :
                report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                report.status === 'resolved' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {report.status?.toUpperCase()}
              </span>
            </div>

            {report.caseNumber && (
              <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Case #{report.caseNumber}
              </span>
            )}

            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <p><strong>Age:</strong> {report.age || "N/A"}</p>
              <p><strong>Gender:</strong> {report.gender || "N/A"}</p>
              <p><strong>Height:</strong> {report.height || "N/A"}</p>
              <p><strong>Weight:</strong> {report.weight || "N/A"}</p>
              <p><strong>Complexion:</strong> {report.complexion || "N/A"}</p>
              <p><strong>Clothing:</strong> {report.clothing || "N/A"}</p>
              <p><strong>Last Seen Location:</strong> {report.lastSeenLocation || "N/A"}</p>
              <p><strong>Last Seen Date:</strong> {report.lastSeenDate ? new Date(report.lastSeenDate).toLocaleDateString() : "N/A"}</p>
              <p><strong>Reported By:</strong> {report.user?.name || "Unknown"}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {report.description || "No description provided."}
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSightingClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition shadow-lg"
              >
                📍 Report a Sighting
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-400 text-center">
              Reported on {new Date(report.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Responses Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Sighting Reports</h2>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
              <Eye size={18} className="text-emerald-600" />
              <span className="font-semibold text-emerald-700">{responseCount} response{responseCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {isReporter ? (
            // REPORTER or ADMIN view - Show all responses with details
            responses.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl">
                <p className="text-gray-500">No sighting reports yet.</p>
                <p className="text-sm text-gray-400 mt-2">When someone reports a sighting, you'll see their contact information here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {responses.map(response => (
                  <div key={response._id} className="border rounded-xl p-5 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <User size={20} className="text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{response.location}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(response.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{response.description}</p>
                        
                        {response.personCondition && response.personCondition !== "healthy" && (
                          <span className="inline-block mb-3 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            Condition: {response.personCondition.replace('_', ' ')}
                          </span>
                        )}

                        {/* Contact Information - Only visible to reporter/admin */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Responder Contact:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {response.contactName && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <User size={14} />
                                <span>{response.contactName}</span>
                              </div>
                            )}
                            {response.contactPhone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone size={14} />
                                <a href={`tel:${response.contactPhone}`} className="text-emerald-600 hover:underline">
                                  {response.contactPhone}
                                </a>
                              </div>
                            )}
                            {response.contactEmail && (
                              <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                                <Mail size={14} />
                                <a href={`mailto:${response.contactEmail}`} className="text-emerald-600 hover:underline">
                                  {response.contactEmail}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="mt-2 text-xs text-gray-400">
                            Status: {response.status} | Reported: {new Date(response.createdAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // PUBLIC view - Only show count
            <div className="text-center py-12 bg-slate-50 rounded-xl">
              <p className="text-gray-600">
                {responseCount === 0 
                  ? "No sightings reported yet." 
                  : `${responseCount} sighting report${responseCount > 1 ? 's have' : ' has'} been submitted for this case.`}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Only the person who reported this case can view the sighting details.
              </p>
              {responseCount > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Log in as reporter to view details →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissingPersonDetails;