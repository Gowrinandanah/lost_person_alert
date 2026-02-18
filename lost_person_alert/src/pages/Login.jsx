import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authApi";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);
      login(data.user, data.token);

      if (
        data.user.role === "admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
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
          Login
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-xs uppercase font-bold text-slate-400">
              Email
            </label>
            <div className="relative mt-2">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs uppercase font-bold text-slate-400">
              Password
            </label>
            <div className="relative mt-2">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-2"
          >
            Sign In
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center text-slate-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-bold hover:underline"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
