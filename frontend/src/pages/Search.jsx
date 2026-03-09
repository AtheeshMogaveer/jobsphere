import { useState } from "react";
import { searchJobs, searchByCompany } from "../services/api";
import JobCard from "../components/JobCard";

const Search = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searchType, setSearchType] = useState("role"); // role or company
  const [employmentType, setEmploymentType] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      let res;
      if (searchType === "company") {
        res = await searchByCompany(query);
      } else {
        res = await searchJobs({
          query,
          location,
          employment_type: employmentType,
        });
      }
      setJobs(res.data.jobs || []);
      setSearched(true);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Search Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">
          Find Your Next Job
        </h1>
        <p className="text-slate-400">
          Search across LinkedIn, Indeed, Glassdoor and more
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <form onSubmit={handleSearch}>
          {/* Search Type Toggle */}
          <div className="flex gap-3 mb-5">
            <button
              type="button"
              onClick={() => setSearchType("role")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                searchType === "role"
                  ? "bg-primary text-white"
                  : "bg-secondary text-slate-400 hover:text-white"
              }`}
            >
              By Role / Title
            </button>
            <button
              type="button"
              onClick={() => setSearchType("company")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                searchType === "company"
                  ? "bg-primary text-white"
                  : "bg-secondary text-slate-400 hover:text-white"
              }`}
            >
              By Company
            </button>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchType === "company"
                  ? "Company name (e.g. Google)"
                  : "Job title (e.g. React Developer)"
              }
              className="bg-secondary border border-border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition"
            />
            {searchType === "role" && (
              <>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (e.g. Remote, Bangalore)"
                  className="bg-secondary border border-border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition"
                />
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                >
                  <option value="">All Types</option>
                  <option value="FULLTIME">Full Time</option>
                  <option value="PARTTIME">Part Time</option>
                  <option value="CONTRACTOR">Contract</option>
                  <option value="INTERN">Internship</option>
                </select>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Jobs"}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {searched && (
        <div>
          <p className="text-slate-400 mb-6">
            Found{" "}
            <span className="text-white font-semibold">{jobs.length}</span> jobs
          </p>
          {jobs.length === 0 ? (
            <div className="text-center text-slate-400 py-20">
              No jobs found. Try a different search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.job_id} job={job} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
