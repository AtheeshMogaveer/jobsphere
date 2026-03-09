import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const isActive = (p) => location.pathname === p;

  const navLink = (to, label) => (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        padding: "6px 14px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s",
        color: isActive(to) ? "white" : "var(--muted)",
        background: isActive(to) ? "rgba(255,255,255,0.06)" : "transparent",
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        background: scrolled ? "rgba(8,11,17,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "all 0.35s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #4f8eff 0%, #7c5cfc 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "800",
              color: "white",
              fontFamily: "Syne, sans-serif",
              boxShadow: "0 4px 12px rgba(79,142,255,0.3)",
            }}
          >
            J
          </div>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: "700",
              fontSize: "17px",
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            JobSphere
          </span>
        </Link>

        {/* Center nav */}
        <div style={{ display: "flex", gap: "4px" }}>
          {navLink("/search", "Search Jobs")}
          {user && navLink("/dashboard", "Dashboard")}
        </div>

        {/* Right auth */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {user ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "5px 10px 5px 6px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4f8eff, #7c5cfc)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#a0aec0",
                    fontWeight: "500",
                  }}
                >
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--muted)",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "var(--muted)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "var(--muted)",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  padding: "7px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "white",
                  background: "linear-gradient(135deg, #4f8eff, #7c5cfc)",
                  boxShadow: "0 4px 16px rgba(79,142,255,0.28)",
                }}
              >
                Get Started →
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
