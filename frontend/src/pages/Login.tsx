import { useState, useContext } from "react";
import { apiRequest } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  async function handleLogin() {
    const res = await apiRequest("/api/auth/login", "POST", form);

    if (res.access_token) {
      setToken(res.access_token);
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Login</h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>

      {/* ✅ Register Link */}
      <p className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
