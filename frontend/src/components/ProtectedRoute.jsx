import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// If user not logged in → redirect to login
// If logged in → show the page
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
