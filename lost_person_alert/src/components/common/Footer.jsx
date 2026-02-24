// src/components/common/Footer.jsx

import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="text-center py-5 bg-light">
      <h3 className="h4">Ready to help?</h3>
      <div className="mt-3">
        <button className="btn btn-success m-2" onClick={() => navigate("/register")}>
          Join Network
        </button>
        <button className="btn btn-outline-secondary m-2" onClick={() => navigate("/login")}>
          Log In
        </button>
      </div>
      <p className="text-secondary small mt-4">© 2026 SafeReturn</p>
    </footer>
  );
};

export default Footer;