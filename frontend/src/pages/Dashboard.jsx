import { useState, useEffect } from "react";
import {
  getSavedJobs,
  getSearchHistory,
  deleteSavedJob,
} from "../services/api";
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

  const handleUnsave = (jobId) => {
    setSavedJobs((prev) => prev.filter((j) => j.job_id !== jobId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-slate-400">
          {savedJobs.length} saved jobs · {history.length} searches
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "saved"
              ? "bg-primary text-white"
              : "bg-card text-slate-400 hover:text-white border border-border"
          }`}
        >
          Saved Jobs ({savedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "history"
              ? "bg-primary text-white"
              : "bg-card text-slate-400 hover:text-white border border-border"
          }`}
        >
          Search History ({history.length})
        </button>
      </div>

      {/* Saved Jobs Tab */}
      {activeTab === "saved" && (
        <div>
          {savedJobs.length === 0 ? (
            <div className="text-center text-slate-400 py-20">
              <p className="text-6xl mb-4">📭</p>
              <p className="text-xl">No saved jobs yet</p>
              <p className="text-sm mt-2">
                Star jobs while searching to save them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      )}

      {/* Search History Tab */}
      {activeTab === "history" && (
        <div className="bg-card border border-border rounded-2xl p-6">
          {history.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              No search history yet
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <span className="text-white">🔍 {item.search_query}</span>
                  <span className="text-slate-500 text-sm">
                    {new Date(item.searched_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
