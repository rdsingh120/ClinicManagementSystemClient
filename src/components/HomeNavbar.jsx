import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const HomeNavbar = () => {
  const { user, loading } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            C
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ClinicMS
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          
          {/* If NOT logged in */}
          {!user && !loading && (
            <>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200"
              >
                Register
              </Link>

              <Link
                to="/signin"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
              >
                Login
              </Link>
            </>
          )}

          {/* If logged in */}
          {user && !loading && (
            <>
              <Link
                to="/dashboard"
                className="px-6 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
