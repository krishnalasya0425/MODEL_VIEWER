
import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      navigate(res.data.user.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      className={`flex justify-center items-center h-screen transition-all duration-500 ${
        darkMode ? "bg-[#0B1120]" : "bg-gray-100"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-4 p-8 rounded-2xl shadow-lg w-80 border transition-all duration-300 ${
          darkMode
            ? "bg-[#111827] border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        <h2
          className={`text-3xl font-semibold text-center ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Register
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-gray-100 text-gray-900 border-gray-300"
          }`}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-gray-100 text-gray-900 border-gray-300"
          }`}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded font-medium transition-all duration-200"
        >
          Register
        </button>
        <p
          className={`text-center text-sm ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-500 hover:text-indigo-400 underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
