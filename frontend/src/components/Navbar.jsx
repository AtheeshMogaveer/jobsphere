import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Job<span className="text-white">Sphere</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/search"
            className="text-slate-300 hover:text-white transition"
          >
            Search Jobs
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-300 hover:text-white transition"
              >
                Dashboard
              </Link>
              <span className="text-slate-400 text-sm">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
