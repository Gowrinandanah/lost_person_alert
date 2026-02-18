import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  HeartHandshake,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authApi";
import { getActiveReports } from "../services/reportApi";

const Home = () => {
  // State
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const navigate = useNavigate();

  // Fetch active alerts
  const fetchAlerts = async () => {
    try {
      const data = await getActiveReports();
      setAlerts(data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Handle report button
  const handleReportClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setCheckingAuth(true);
      const user = await getCurrentUser();

      if (!user.aadhaarVerified) {
        alert(
          "You must complete Aadhaar verification before reporting a missing person."
        );
        return navigate("/verify-aadhaar");
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-emerald-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">
              Safe<span className="text-emerald-600">Return</span>
            </span>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition"
          >
            Partner Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-20 pb-32 px-6 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block py-1 px-3 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-widest mb-6">
            Community Safety Network
          </span>

          <h1 className="text-6xl md:text-7xl font-extrabold mb-8">
            Every Second{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Counts.
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            A verified platform dedicated to bridge the gap between missing
            individuals and their families through real-time community action.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleReportClick}
              disabled={checkingAuth}
              className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-2xl disabled:opacity-70"
            >
              {checkingAuth ? "Verifying..." : "File a Missing Report"}
            </button>

            <button
              onClick={() => navigate("/alerts")}
              className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-4 rounded-xl font-bold hover:border-emerald-500 hover:text-emerald-600 transition"
            >
              View Active Alerts
            </button>
          </div>
        </div>
      </header>

      {/* Alerts */}
      <section className="py-20 px-6 bg-white border-y">
        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold">Critical Alerts</h2>
              <p className="text-slate-500 mt-2">
                Active cases requiring immediate attention.
              </p>
            </div>
            <button
              onClick={() => navigate("/alerts")}
              className="text-emerald-600 font-bold"
            >
              View All Cases →
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-dashed border-2">
              No active alerts at this time.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  onClick={() => navigate(`/person/${alert._id}`)}
                  className="bg-white rounded-2xl border hover:shadow-xl transition cursor-pointer"
                >
                  <div className="h-72">
                    {alert.photo ? (
                      <img
                        src={`http://localhost:5000/${alert.photo}`}
                        alt={alert.personName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs uppercase">
                        No Photo Available
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold uppercase">
                      {alert.personName || "Unknown"}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                      {alert.description ||
                        "No specific details provided for this case."}
                    </p>
                    <div className="mt-4 text-xs text-slate-400">
                      Reporter: {alert.user?.name || "Verified User"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Emergency */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto bg-red-600 rounded-3xl p-10 text-white flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
              <Phone size={24} /> Immediate Danger?
            </h3>
            Contact emergency services immediately.
          </div>
          <div className="text-5xl font-black mt-6 md:mt-0">
            100 / 1098
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to help?</h2>
        <p className="text-slate-500 mb-10">
          Create a verified account and contribute to active searches.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-700"
          >
            Join the Network
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-slate-100 text-slate-700 px-10 py-4 rounded-xl font-bold"
          >
            Log In
          </button>
        </div>

        <p className="mt-16 text-slate-400 text-sm">
          © 2026 SafeReturn Protocol. All verified reports are shared with authorities.
        </p>
      </footer>
    </div>
  );
};

export default Home;
