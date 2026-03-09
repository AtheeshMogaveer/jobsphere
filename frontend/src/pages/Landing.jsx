import { Link } from "react-router-dom";

const stats = [
  { value: "500K+", label: "Active Jobs" },
  { value: "50+", label: "Job Platforms" },
  { value: "120+", label: "Countries" },
];

const features = [
  {
    icon: "⚡",
    title: "Unified Search",
    desc: "Search LinkedIn, Indeed, Glassdoor and 50+ platforms simultaneously.",
  },
  {
    icon: "★",
    title: "Smart Saves",
    desc: "Bookmark jobs and track everything from one personal dashboard.",
  },
  {
    icon: "🎯",
    title: "Precision Filters",
    desc: "Filter by role, company, location, salary and employment type.",
  },
];

const Landing = () => {
  return (
    <div style={{ paddingTop: "64px" }}>
      {/* Hero */}
      <section
        style={{
          minHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px 60px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Badge */}
        <div
          className="fade-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "20px",
            marginBottom: "32px",
            background: "rgba(79,142,255,0.08)",
            border: "1px solid rgba(79,142,255,0.2)",
            fontSize: "12px",
            fontWeight: "600",
            color: "#4f8eff",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4f8eff",
              display: "inline-block",
              boxShadow: "0 0 8px #4f8eff",
            }}
          ></span>
          All job platforms. One search.
        </div>

        {/* Headline */}
        <h1
          className="fade-up-1"
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: "800",
            lineHeight: "1.0",
            letterSpacing: "-0.04em",
            maxWidth: "800px",
            marginBottom: "28px",
            color: "white",
          }}
        >
          Find jobs across{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #4f8eff 0%, #7c5cfc 60%, #ff6b9d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            every platform
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="fade-up-2"
          style={{
            fontSize: "18px",
            color: "var(--muted)",
            maxWidth: "480px",
            lineHeight: "1.7",
            marginBottom: "44px",
            fontWeight: "400",
          }}
        >
          Stop switching between job boards. JobSphere aggregates listings from
          LinkedIn, Indeed, Glassdoor and more — in one clean interface.
        </p>

        {/* CTA */}
        <div
          className="fade-up-3"
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "80px",
          }}
        >
          <Link
            to="/search"
            style={{
              textDecoration: "none",
              padding: "14px 32px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              color: "white",
              background: "linear-gradient(135deg, #4f8eff, #7c5cfc)",
              boxShadow: "0 8px 32px rgba(79,142,255,0.3)",
              transition: "all 0.2s",
              display: "inline-block",
            }}
          >
            Search Jobs →
          </Link>
          <Link
            to="/register"
            style={{
              textDecoration: "none",
              padding: "14px 32px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              color: "white",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              transition: "all 0.2s",
              display: "inline-block",
            }}
          >
            Create Account
          </Link>
        </div>

        {/* Stats */}
        <div
          className="fade-up-4"
          style={{
            display: "flex",
            gap: "48px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "white",
                  letterSpacing: "-0.03em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--muted)",
                  marginTop: "4px",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "36px",
              fontWeight: "800",
              color: "white",
              letterSpacing: "-0.03em",
              marginBottom: "12px",
            }}
          >
            Everything you need
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "16px" }}>
            Designed for serious job seekers
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "32px",
                borderRadius: "16px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                transition: "all 0.25s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "rgba(79,142,255,0.25)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  fontSize: "20px",
                  background: "rgba(79,142,255,0.1)",
                  border: "1px solid rgba(79,142,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "white",
                  marginBottom: "10px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "14px",
                  lineHeight: "1.7",
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "60px 24px 100px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "60px 40px",
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(79,142,255,0.08), rgba(124,92,252,0.08))",
            border: "1px solid rgba(79,142,255,0.15)",
          }}
        >
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "32px",
              fontWeight: "800",
              color: "white",
              letterSpacing: "-0.03em",
              marginBottom: "14px",
            }}
          >
            Ready to find your dream job?
          </h2>
          <p
            style={{
              color: "var(--muted)",
              marginBottom: "28px",
              fontSize: "15px",
            }}
          >
            Join thousands of professionals using JobSphere
          </p>
          <Link
            to="/register"
            style={{
              textDecoration: "none",
              padding: "14px 36px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              color: "white",
              display: "inline-block",
              background: "linear-gradient(135deg, #4f8eff, #7c5cfc)",
              boxShadow: "0 8px 32px rgba(79,142,255,0.3)",
            }}
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
