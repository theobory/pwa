import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function LandingPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative">
      {/* Navbar */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-6 flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-24" />
        <Link
          to="/login"
          className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition"
        >
          Connexion
        </Link>
      </div>

      {/* Main content */}
      <div className="text-center mt-32">
        <h1 className="text-3xl font-bold max-w-xl mx-auto">
          Organisez vos tâches et collaborez facilement avec Trello Lite.
        </h1>

        <div className="mt-6 w-full max-w-xl h-64 bg-gray-200 rounded-lg mx-auto" />
      </div>
    </div>
  );
}
