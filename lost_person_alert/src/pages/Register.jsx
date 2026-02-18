import React, { useState } from "react";
import { registerUser } from "../services/authApi";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Lock, MapPin, ShieldCheck } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [location, setLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        setLocation(coords);
        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
        alert("Unable to fetch location.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please fetch home location.");
      return;
    }

    setLoadingSubmit(true);

    try {
      const res = await registerUser({
        ...formData,
        homeLocation: {
          latitude: parseFloat(location.split(",")[0]),
          longitude: parseFloat(location.split(",")[1]),
        },
      });

      setMessage(res.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tight">
            Safe<span className="text-emerald-600">Return</span>
          </span>
        </div>

        <h2 className="text-3xl font-black text-center text-slate-900 mb-2">
          Register
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Create your verified account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="phone"
              placeholder="Phone"
              required
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
            />
          </div>

          {/* Location */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={location}
                readOnly
                placeholder="Home Location"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="button"
              onClick={fetchLocation}
              className="bg-emerald-600 text-white px-4 rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              {loadingLocation ? "..." : "Fetch"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition"
          >
            {loadingSubmit ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-sm text-slate-600">
            {message}
          </p>
        )}

        <div className="mt-8 text-center text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-bold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
