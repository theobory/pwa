import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Trello Lite</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">👋 {user?.name}</span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
