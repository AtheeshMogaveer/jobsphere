import { useState } from "react";
import { saveJob, deleteSavedJob } from "../services/api";
import { useAuth } from "../context/AuthContext";

const JobCard = ({ job, isSaved = false, onUnsave }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async () => {
    if (!user) {
      alert("Please login to save jobs");
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        await deleteSavedJob(job.job_id);
        setSaved(false);
        if (onUnsave) onUnsave(job.job_id);
      } else {
        await saveJob({
          job_id: job.job_id,
          job_title: job.job_title,
          company: job.company,
          location: job.location,
          job_url: job.apply_url,
          salary: job.salary_min
            ? `${job.salary_currency} ${job.salary_min} - ${job.salary_max}`
            : null,
        });
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const timeAgo = (date) => {
    if (!date) return "Recently";
    const days = Math.floor((Date.now() - new Date(date)) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "1d ago";
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "22px",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "rgba(79,142,255,0.22)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.35)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                objectFit: "contain",
                background: "white",
                padding: "4px",
              }}
            />
          ) : (
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4f8eff22, #7c5cfc22)",
                border: "1px solid rgba(79,142,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "700",
                color: "#4f8eff",
                fontFamily: "Syne, sans-serif",
              }}
            >
              {job.company?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "white",
                lineHeight: "1.3",
                marginBottom: "2px",
              }}
            >
              {job.job_title}
            </div>
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>
              {job.company}
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSaveToggle}
          disabled={saving}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            border: "none",
            background: saved
              ? "rgba(251,191,36,0.1)"
              : "rgba(255,255,255,0.04)",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: saved ? "#fbbf24" : "var(--muted)",
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            if (!saved) e.currentTarget.style.color = "#fbbf24";
          }}
          onMouseOut={(e) => {
            if (!saved) e.currentTarget.style.color = "var(--muted)";
          }}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      {/* Tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "14px",
        }}
      >
        {job.location && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "500",
              padding: "4px 10px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "#a0aec0",
            }}
          >
            📍 {job.location}
          </span>
        )}
        {job.is_remote && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "600",
              padding: "4px 10px",
              borderRadius: "20px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#34d399",
              letterSpacing: "0.02em",
            }}
          >
            REMOTE
          </span>
        )}
        {job.employment_type && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "500",
              padding: "4px 10px",
              borderRadius: "20px",
              background: "rgba(79,142,255,0.08)",
              border: "1px solid rgba(79,142,255,0.15)",
              color: "#7eb8ff",
            }}
          >
            {job.employment_type}
          </span>
        )}
        {job.salary_min && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "500",
              padding: "4px 10px",
              borderRadius: "20px",
              background: "rgba(124,92,252,0.08)",
              border: "1px solid rgba(124,92,252,0.15)",
              color: "#a78bfa",
            }}
          >
            💰 {job.salary_currency} {Number(job.salary_min).toLocaleString()}–
            {Number(job.salary_max).toLocaleString()}
          </span>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--muted)",
            lineHeight: "1.6",
            marginBottom: "16px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {job.description}
        </p>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>
          {timeAgo(job.posted_at)}
        </span>
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            padding: "7px 16px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
            color: "white",
            background: "linear-gradient(135deg, #4f8eff, #7c5cfc)",
            transition: "all 0.2s",
            display: "inline-block",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 4px 16px rgba(79,142,255,0.3)")
          }
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          Apply →
        </a>
      </div>
    </div>
  );
};

export default JobCard;
