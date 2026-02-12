import { useState } from "react";
import "./Login.css";

function Login() {
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      setMessage("⚠ Please enter email and password.");
      return;
    }

    if (email === "admin@gmail.com" && password === "123456") {
      setMessage("✔ Login Successful");
    } else {
      setMessage("✖ Invalid Email or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Lost Person Alert System</h1>
        <p className="login-subtitle">Secure Access for Community Safety</p>

        <input
          id="email"
          type="email"
          placeholder="Username"
          className="login-input"
        />

        <input
          id="password"
          type="password"
          placeholder="Password"
          className="login-input"
        />

        <button className="login-button" onClick={handleLogin}>
          LOGIN
        </button>

        {message && <div className="login-message">{message}</div>}

        <div className="login-link">
          Don’t have an account? <a href="/register">Create Account</a>
        </div>

        <p className="login-footer">
          Emergency Awareness • Community Support • 2026
        </p>
      </div>
    </div>
  );
}

export default Login;
