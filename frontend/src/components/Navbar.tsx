import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { setToken } = useContext(AuthContext);

  function logout() {
    setToken(null);
    window.location.href = "/";
  }

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">
        <Link to="/dashboard">Sweet Shop</Link>
      </h1>

      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>

        {/* ✅ ADMIN LINK */}
        <Link to="/admin" className="hover:underline">
          Admin
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
