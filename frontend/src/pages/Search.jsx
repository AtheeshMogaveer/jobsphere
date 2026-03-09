import { useState } from "react";
import { searchJobs, searchByCompany } from "../services/api";
import JobCard from "../components/JobCard";

const Search = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searchType, setSearchType] = useState("role");
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
      const res =
        searchType === "company"
          ? await searchByCompany(query)
          : await searchJobs({
              query,
              location,
              employment_type: employmentType,
            });
      setJobs(res.data.jobs || []);
      setSearched(true);
    } catch {
      setError("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "10px",
    minWidth: "0",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const suggestions = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "DevOps Engineer",
  ];

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
        <div
          className="fade-up"
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "44px",
              fontWeight: "800",
              color: "white",
              letterSpacing: "-0.03em",
              marginBottom: "12px",
            }}
          >
            Search Jobs
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px" }}>
            Real-time listings from LinkedIn, Indeed, Glassdoor & more
          </p>
        </div>

        {/* Search Box */}
        <div
          className="fade-up-1"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "32px",
          }}
        >
          {/* Type Toggle */}
          <div
            style={{
              display: "inline-flex",
              gap: "4px",
              marginBottom: "20px",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "4px",
            }}
          >
            {["role", "company"].map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                style={{
                  padding: "7px 18px",
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                  background:
                    searchType === type ? "var(--surface)" : "transparent",
                  color: searchType === type ? "white" : "var(--muted)",
                  boxShadow:
                    searchType === type ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
                }}
              >
                By {type === "role" ? "Job Title" : "Company"}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <form onSubmit={handleSearch}>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchType === "company"
                    ? "e.g. Google, Microsoft, Apple"
                    : "e.g. React Developer, Product Manager"
                }
                required
                style={{ ...inputStyle, flex: "2", minWidth: "200px" }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(79,142,255,0.5)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              {searchType === "role" && (
                <>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location or Remote"
                    style={{ ...inputStyle, flex: "1", minWidth: "160px" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(79,142,255,0.5)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    style={{
                      ...inputStyle,
                      flex: "1",
                      minWidth: "140px",
                      cursor: "pointer",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(79,142,255,0.5)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  >
                    <option value="">All Types</option>
                    <option value="FULLTIME">Full Time</option>
                    <option value="PARTTIME">Part Time</option>
                    <option value="CONTRACTOR">Contract</option>
                    <option value="INTERN">Internship</option>
                  </select>
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "white",
                  background: "linear-gradient(135deg, #4f8eff, #7c5cfc)",
                  boxShadow: "0 4px 16px rgba(79,142,255,0.25)",
                  opacity: loading ? 0.7 : 1,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Searching..." : "Search →"}
              </button>
            </div>

            {/* Suggestions */}
            {!searched && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Try:
                </span>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setQuery(s);
                      setSearchType("role");
                    }}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "#a0aec0",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(79,142,255,0.3)";
                      e.currentTarget.style.color = "#4f8eff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "#a0aec0";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "12px",
              padding: "14px 18px",
              marginBottom: "24px",
              fontSize: "14px",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "16px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  height: "200px",
                  borderRadius: "16px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
                    animation: "shimmer 1.5s infinite",
                    backgroundSize: "200% 100%",
                  }}
                ></div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                Found{" "}
                <span style={{ color: "white", fontWeight: "600" }}>
                  {jobs.length}
                </span>{" "}
                jobs
              </p>
            </div>

            {jobs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 0",
                  color: "var(--muted)",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "white",
                    marginBottom: "8px",
                  }}
                >
                  No results found
                </p>
                <p style={{ fontSize: "14px" }}>
                  Try a different search term or location
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
                {jobs.map((job) => (
                  <JobCard key={job.job_id} job={job} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!searched && !loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>🌐</div>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "white",
                marginBottom: "10px",
                fontFamily: "Syne, sans-serif",
              }}
            >
              Ready to find your next role?
            </p>
            <p style={{ color: "var(--muted)", fontSize: "15px" }}>
              Search above to see real-time job listings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
