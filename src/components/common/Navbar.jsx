import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [hovered, setHovered] = useState(null);

  const navStyle = {
    backgroundColor: "#4f46e5", // Indigo
    padding: "18px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const linksContainer = {
    display: "flex",
    gap: "50px",
  };

  const linkStyle = {
    position: "relative",
    textDecoration: "none",
    color: "white",
    fontSize: "18px",
    fontWeight: "500",
    paddingBottom: "5px",
    transition: "all 0.3s ease",
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

  return (
    <nav style={navStyle}>
      <div style={linksContainer}>
        {["Home", "Login", "Register"].map((item) => (
          <Link
            key={item}
            to={
              item === "Home"
                ? "/"
                : `/${item.toLowerCase()}`
            }
            style={linkStyle}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(null)}
          >
            {item}
            <span
              style={{
                ...underlineStyle,
                ...(hovered === item ? activeUnderline : {}),
              }}
            />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
