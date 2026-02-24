// src/pages/Home.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authApi";
import { getActiveReports } from "../services/reportApi";
import Footer from "../components/common/Footer";

const Home = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getActiveReports().then(data => {
      setAlerts(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const handleReport = async () => {
    if (!localStorage.getItem("token")) return navigate("/login");
    
    try {
      const user = await getCurrentUser();
      
      // ✅ FIXED: Check aadhaarStatus instead of aadhaarVerified
      if (user.aadhaarStatus !== "approved") {
        return navigate("/verify-aadhaar");
      }
      
      navigate("/report");
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/login");
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Nav */}
      <nav className="navbar bg-white shadow-sm px-4 py-3 sticky-top">
        <span className="navbar-brand fw-bold" onClick={() => navigate("/")} style={{cursor:"pointer"}}>
          Safe<span className="text-success">Return</span>
        </span>
      </nav>

      {/* Hero */}
      <div className="text-center py-5 px-3 bg-light">
        <h1 className="display-3 fw-bold">Every Second <span className="text-success">Counts</span></h1>
        <p className="lead mx-auto" style={{maxWidth:"600px"}}>A verified platform for missing individuals and families.</p>
        <div className="mt-4">
          <button className="btn btn-dark btn-lg m-2 px-4" onClick={handleReport}>File Report</button>
          <button className="btn btn-outline-dark btn-lg m-2 px-4" onClick={() => navigate("/alerts")}>View Alerts</button>
        </div>
      </div>

      {/* Alerts */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3">Critical Alerts</h2>
          <button className="btn btn-link text-success" onClick={() => navigate("/alerts")}>View All →</button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" />
          </div>
        ) : alerts.length === 0 ? (
          <p className="text-center py-5 bg-light rounded">No active alerts</p>
        ) : (
          <div className="row g-4">
            {alerts.map(a => (
              <div key={a._id} className="col-md-4">
                <div className="card h-100 shadow-sm" onClick={() => navigate(`/person/${a._id}`)} style={{cursor:"pointer"}}>
                  <div style={{height:"200px", background:"#f8f9fa"}}>
                    {a.photo ? <img src={`http://localhost:5000/${a.photo}`} className="w-100 h-100 object-fit-cover" /> 
                    : <div className="h-100 d-flex align-items-center justify-content-center text-secondary">No Photo</div>}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{a.personName || "Unknown"}</h5>
                    <p className="card-text small text-secondary">{a.description?.substring(0,60)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency */}
      <div className="bg-danger text-white p-4 text-center">
        <h4>🚨 Immediate Danger? Call 100 / 1098</h4>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;