import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle, FaBell } from "react-icons/fa";

const Navbar = () => {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin =
    user?.role === "admin";

  // ================= UPDATED REPORT HANDLER =================
  const handleReportClick = () => {
    if (!user?.aadhaarStatus === "approved") {
      const proceed = window.confirm(
        "⚠️ Aadhaar Verification Required\n\n" +
        "To prevent misuse and ensure authenticity, you must verify your Aadhaar before reporting a missing person.\n\n" +
        "Would you like to verify now?"
      );

      if (proceed) {
        navigate("/verify-aadhaar");
      }

      return;
    }

    navigate("/report");
  };

  // ================= STYLES =================

  const navStyle = {
    backgroundColor: "#0c0c0c",
    padding: "18px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const linksContainer = {
    display: "flex",
    gap: "40px",
    alignItems: "center",
  };

  const linkStyle = {
    position: "relative",
    textDecoration: "none",
    color: "white",
    fontSize: "17px",
    fontWeight: "500",
    paddingBottom: "5px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const iconStyle = {
    color: "white",
    cursor: "pointer",
    transition: "0.3s ease",
  };

  const underlineStyle = {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: "2px",
    width: "100%",
    backgroundColor: "white",
    transform: "scaleX(0)",
    transition: "transform 0.3s ease",
  };

  const activeUnderline = {
    transform: "scaleX(1)",
  };

  const renderLink = (name, path) => {
    const isActive = location.pathname === path;

    return (
      <Link
        key={name}
        to={path}
        style={{
          ...linkStyle,
          fontWeight: isActive ? "700" : "500",
        }}
        onMouseEnter={() => setHovered(name)}
        onMouseLeave={() => setHovered(null)}
      >
        {name}
        <span
          style={{
            ...underlineStyle,
            ...(hovered === name || isActive ? activeUnderline : {}),
          }}
        />
      </Link>
    );
  };

  const isNotificationActive =
    location.pathname === "/notifications";

  const isProfileActive =
    location.pathname === "/profile";

  return (
    <nav style={navStyle}>
      <div style={linksContainer}>

        {/* Always Visible */}
        {renderLink("Home", "/")}
        {renderLink("Alerts", "/alerts")}

        {/* Not Logged In */}
        {!isAuthenticated && (
          <>
            {renderLink("Login", "/login")}
            {renderLink("Register", "/register")}
          </>
        )}

        {/* Logged In */}
        {isAuthenticated && (
          <>
            {/* UPDATED REPORT BUTTON WITH WARNING */}
            <span
              style={linkStyle}
              onClick={handleReportClick}
              onMouseEnter={() => setHovered("Report")}
              onMouseLeave={() => setHovered(null)}
            >
              Report
              <span
                style={{
                  ...underlineStyle,
                  ...(hovered === "Report"
                    ? activeUnderline
                    : {}),
                }}
              />
            </span>

            {/* Respond Page */}
            {renderLink("Respond", "/respond")}

            {/* Admin Dashboard */}
            {isAdmin && renderLink("Admin Dashboard", "/admin")}

            {/* Notifications */}
            <Link
              to="/notifications"
              style={{
                ...iconStyle,
                color: isNotificationActive ? "#ffdd57" : "white",
              }}
            >
              <FaBell size={20} />
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              style={{
                ...iconStyle,
                color: isProfileActive ? "#ffdd57" : "white",
              }}
            >
              <FaUserCircle size={24} />
            </Link>

            {/* Logout */}
            <span
              style={linkStyle}
              onClick={handleLogout}
              onMouseEnter={() => setHovered("Logout")}
              onMouseLeave={() => setHovered(null)}
            >
              Logout
              <span
                style={{
                  ...underlineStyle,
                  ...(hovered === "Logout"
                    ? activeUnderline
                    : {}),
                }}
              />
            </span>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;