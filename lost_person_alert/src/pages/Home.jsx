import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  HeartHandshake,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../services/authApi";

const Home = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(false);

  const navigate = useNavigate();

  // ================= FETCH ACTIVE ALERTS =================
  const fetchAlerts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/reports/active"
      );
      setAlerts(res.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // ================= PROTECTED REPORT BUTTON =================
  const handleReportClick = async () => {
    const token = localStorage.getItem("token");

    // Not logged in
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCheckingAuth(true);

      const user = await getCurrentUser();

      if (!user.aadhaarVerified) {
        alert(
          "You must complete Aadhaar verification before reporting a missing person."
        );
        navigate("/verify-aadhaar");
        return;
      }

      navigate("/report");

    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/login");
    } finally {
      setCheckingAuth(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">

       {/* ================= TOP ICON ================= */}
<section className="pt-12 pb-4 text-center bg-white">
  <div className="flex justify-center items-center gap-3">
    <div className="bg-indigo-100 p-4 rounded-full shadow-md">
      <ShieldCheck className="text-indigo-600" size={40} />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
      SafeReturn
    </h2>
  </div>
</section>


      {/* ================= HERO ================= */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Search. Support. Reunite.
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            SafeReturn connects communities to help reunite families with
            their loved ones through verified reports and responsible alerts.
          </p>

          <div className="mt-10 flex justify-center gap-5 flex-wrap">
            <button
              onClick={handleReportClick}
              disabled={checkingAuth}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg disabled:opacity-60"
            >
              {checkingAuth ? "Checking..." : "Report a Missing Person"}
            </button>

            <button
              onClick={() => navigate("/alerts")}
              className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition"
            >
              Browse Alerts
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS STRIP ================= 
      <section className="py-10 px-6 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">

          <div>
            <h3 className="text-3xl font-bold text-indigo-600">245+</h3>
            <p className="text-gray-600 mt-1">Families Reunited</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-indigo-600">120+</h3>
            <p className="text-gray-600 mt-1">Active Community Members</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-indigo-600">98%</h3>
            <p className="text-gray-600 mt-1">Verified Reports</p>
          </div>

        </div>
      </section>*/}

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
          Our Process
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          <div className="bg-white p-10 rounded-3xl shadow-md hover:shadow-xl transition text-center">
            <AlertTriangle className="mx-auto mb-6 text-indigo-600" size={40} />
            <h3 className="text-xl font-semibold mb-3">Report</h3>
            <p className="text-gray-600">
              Submit accurate details and photos securely.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-md hover:shadow-xl transition text-center">
            <ShieldCheck className="mx-auto mb-6 text-indigo-600" size={40} />
            <h3 className="text-xl font-semibold mb-3">Verify</h3>
            <p className="text-gray-600">
              Reports are reviewed to prevent misuse and ensure trust.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-md hover:shadow-xl transition text-center">
            <HeartHandshake className="mx-auto mb-6 text-indigo-600" size={40} />
            <h3 className="text-xl font-semibold mb-3">Reconnect</h3>
            <p className="text-gray-600">
              Community members help spread alerts responsibly.
            </p>
          </div>

        </div>
      </section>

      {/* ================= RECENT ALERTS ================= */}
      <section className="py-24 px-6 bg-indigo-50">
        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Recent Active Alerts
            </h2>

            <button
              onClick={() => navigate("/alerts")}
              className="text-indigo-600 font-semibold hover:underline"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <p className="text-center">Loading alerts...</p>
          ) : alerts.length === 0 ? (
            <p className="text-center text-gray-500">
              No active alerts currently.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  onClick={() => navigate(`/person/${alert._id}`)}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition cursor-pointer group"
                >
                  <div className="h-60 bg-gray-200 overflow-hidden">
                    {alert.photo ? (
                      <img
                        src={`http://localhost:5000/${alert.photo}`}
                        alt={alert.personName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {alert.personName || "Unknown"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {alert.age || "N/A"} yrs • {alert.gender || "N/A"}
                    </p>

                    <p className="mt-3 text-gray-600 line-clamp-2">
                      {alert.description || "No description provided."}
                    </p>

                    <p className="mt-4 text-xs text-gray-400">
                      Reported by {alert.user?.name || "Anonymous"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= EMERGENCY ================= */}
      <section className="bg-red-50 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Phone className="mx-auto mb-4 text-red-600" size={42} />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Emergency Assistance
          </h3>
          <p className="text-gray-600 mb-4">
            If the situation is urgent, contact local authorities immediately.
          </p>
          <p className="text-3xl font-bold text-red-600">100 / 1098</p>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 px-6 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Be Part of the Change
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Join SafeReturn today and help bring missing individuals back to
          their families safely.
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition"
          >
            Sign In
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;