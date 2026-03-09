import { useState, useEffect } from "react";
import { getSavedJobs, getSearchHistory } from "../services/api";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("saved");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [savedRes, historyRes] = await Promise.all([
          getSavedJobs(),
          getSearchHistory(),
        ]);
        setSavedJobs(savedRes.data.saved_jobs);
        setHistory(historyRes.data.history);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUnsave = (jobId) =>
    setSavedJobs((prev) => prev.filter((j) => j.job_id !== jobId));

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid var(--border)",
            borderTopColor: "#4f8eff",
            animation: "spin 0.8s linear infinite",
          }}
        ></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 24px 40px",
        }}
      >
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #4f8eff, #7c5cfc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "800",
                color: "white",
                fontFamily: "Syne, sans-serif",
                boxShadow: "0 8px 24px rgba(79,142,255,0.3)",
              }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "white",
                  letterSpacing: "-0.03em",
                }}
              >
                Hey, {user?.name} 👋
              </h1>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "14px",
                  marginTop: "2px",
                }}
              >
                {user?.email}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              {
                label: "Saved Jobs",
                value: savedJobs.length,
                color: "#4f8eff",
              },
              {
                label: "Searches Made",
                value: history.length,
                color: "#7c5cfc",
              },
              {
                label: "Member Since",
                value: user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Today",
                color: "#10b981",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "20px 24px",
                  borderRadius: "14px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  minWidth: "160px",
                }}
              >
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "28px",
                    fontWeight: "800",
                    color: stat.color,
                    letterSpacing: "-0.03em",
                    marginBottom: "4px",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "inline-flex",
            gap: "4px",
            marginBottom: "28px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "4px",
          }}
        >
          {[
            { id: "saved", label: `Saved Jobs (${savedJobs.length})` },
            { id: "history", label: `Search History (${history.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "9px 20px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.2s",
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg, #4f8eff, #7c5cfc)"
                    : "transparent",
                color: activeTab === tab.id ? "white" : "var(--muted)",
                boxShadow:
                  activeTab === tab.id
                    ? "0 4px 14px rgba(79,142,255,0.25)"
                    : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Saved Jobs */}
        {activeTab === "saved" &&
          (savedJobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "56px", marginBottom: "20px" }}>📭</div>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "white",
                  marginBottom: "10px",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                No saved jobs yet
              </p>
              <p style={{ color: "var(--muted)", fontSize: "15px" }}>
                Star jobs while searching to save them here
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "16px",
              }}
            >
              {savedJobs.map((job) => (
                <JobCard
                  key={job.job_id}
                  job={{
                    job_id: job.job_id,
                    job_title: job.job_title,
                    company: job.company,
                    location: job.location,
                    apply_url: job.job_url,
                  }}
                  isSaved={true}
                  onUnsave={handleUnsave}
                />
              ))}
            </div>
          ))}

        {/* Search History */}
        {activeTab === "history" &&
          (history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "56px", marginBottom: "20px" }}>🔍</div>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "white",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                No search history yet
              </p>
            </div>
          ) : (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {history.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    borderBottom:
                      i < history.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.02)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "rgba(79,142,255,0.08)",
                        border: "1px solid rgba(79,142,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                      }}
                    >
                      🔍
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "var(--text)",
                        fontWeight: "500",
                      }}
                    >
                      {item.search_query}
                    </span>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    {formatDate(item.searched_at)}
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
