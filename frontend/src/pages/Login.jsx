// ==================== LOGIN ====================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      navigate("/search");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 40px",
      }}
    >
      <div className="fade-up" style={{ width: "100%", maxWidth: "420px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              margin: "0 auto 20px",
              background: "linear-gradient(135deg, #4f8eff, #7c5cfc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "800",
              color: "white",
              fontFamily: "Syne, sans-serif",
              boxShadow: "0 8px 24px rgba(79,142,255,0.3)",
            }}
          >
            J
          </div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "28px",
              fontWeight: "800",
              color: "white",
              letterSpacing: "-0.03em",
              marginBottom: "8px",
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "15px" }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "32px",
          }}
        >
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "20px",
                fontSize: "13px",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#a0aec0",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(79,142,255,0.5)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#a0aec0",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(79,142,255,0.5)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
                background: "linear-gradient(135deg, #4f8eff, #7c5cfc)",
                boxShadow: "0 4px 16px rgba(79,142,255,0.25)",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s",
              }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "14px",
            color: "var(--muted)",
          }}
        >
          No account?{" "}
          <Link
            to="/register"
            style={{
              color: "#4f8eff",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
