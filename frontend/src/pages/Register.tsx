import { useState } from "react";
import { apiRequest } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });

  async function handleRegister() {
    const res = await apiRequest("/api/auth/register", "POST", form);
    if (res.username) {
      alert("Registered! Now login.");
      window.location.href = "/";
    } else {
      alert("Registration failed");
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Register</h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Register
      </button>

      <p className="mt-4">
        Already have an account?{" "}
        <a href="/" className="text-blue-600 underline">
          Login
        </a>
      </p>
    </div>
  );
}
