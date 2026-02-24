// src/pages/Login.jsx

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authApi";
import { AuthContext } from "../context/AuthContext";

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

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="card shadow border-0" style={{ maxWidth: "450px", width: "100%" }}>

        {/* Header */}
        <div className="card-header bg-white border-0 text-center pt-5">
          <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
            <span className="text-success fw-bold fs-4">SR</span>
          </div>
          <h2 className="fw-bold">Login</h2>
          <p className="text-secondary small">Enter your credentials to continue</p>
        </div>

        {/* Body */}
        <div className="card-body px-5 pb-5">
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">EMAIL</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-lg bg-light border"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">PASSWORD</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-lg bg-light border"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-success w-100 py-3 fw-bold"
            >
              Sign In
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-4 text-secondary">
            Don't have an account?{" "}
            <Link to="/register" className="text-success fw-bold text-decoration-none">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;