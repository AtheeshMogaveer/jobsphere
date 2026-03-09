import { useState } from "react";
import { saveJob, deleteSavedJob } from "../services/api";
import { useAuth } from "../context/AuthContext";

const JobCard = ({ job, isSaved = false, onUnsave }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const handleSaveToggle = async () => {
    if (!user) {
      alert("Please login to save jobs");
      return;
    }

    setLoading(true);
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
    } catch (error) {
      console.error("Save toggle error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary transition group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company}
              className="w-12 h-12 rounded-lg object-contain bg-white p-1"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
              {job.company?.[0]}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-white group-hover:text-primary transition">
              {job.job_title}
            </h3>
            <p className="text-slate-400 text-sm">{job.company}</p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveToggle}
          disabled={loading}
          className={`text-xl transition ${
            saved ? "text-yellow-400" : "text-slate-500 hover:text-yellow-400"
          }`}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.location && (
          <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">
            📍 {job.location}
          </span>
        )}
        {job.is_remote && (
          <span className="bg-green-900 text-green-300 text-xs px-3 py-1 rounded-full">
            🌐 Remote
          </span>
        )}
        {job.employment_type && (
          <span className="bg-blue-900 text-blue-300 text-xs px-3 py-1 rounded-full">
            {job.employment_type}
          </span>
        )}
        {job.salary_min && (
          <span className="bg-purple-900 text-purple-300 text-xs px-3 py-1 rounded-full">
            💰 {job.salary_currency} {job.salary_min?.toLocaleString()} -{" "}
            {job.salary_max?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-xs">
          {job.posted_at
            ? new Date(job.posted_at).toLocaleDateString()
            : "Recently posted"}
        </span>

        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          Apply Now →
        </a>
      </div>
    </div>
  );
};

export default JobCard;
