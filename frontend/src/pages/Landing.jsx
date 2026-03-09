import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl">
        <h1 className="text-6xl font-bold text-white mb-6">
          Find Jobs Across
          <span className="text-primary"> Every Platform</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10">
          Search LinkedIn, Indeed, Glassdoor and more — all in one place. Save
          your favorites, track your search history.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/search"
            className="bg-primary hover:bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            Search Jobs
          </Link>
          <Link
            to="/register"
            className="border border-border hover:border-primary text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
