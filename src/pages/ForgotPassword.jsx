import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { useTheme } from "../context/ThemeContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { email, newPassword });
      setMessage("Password updated. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update password.");
    } finally {
      setLoading(false);
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
        className={`flex flex-col gap-4 p-8 rounded-2xl shadow-lg w-96 border transition-all duration-300 ${
          darkMode ? "bg-[#111827] border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <h2
          className={`text-2xl font-semibold text-center ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Forgot Password
        </h2>

        {message && (
          <div
            className={`text-sm p-2 rounded ${
              message.toLowerCase().includes("fail") || message.toLowerCase().includes("match")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

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

        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`p-2 pr-10 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-gray-100 text-gray-900 border-gray-300"
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((s) => !s)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Toggle new password visibility"
          >
            {showNewPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.53 2.47a.75.75 0 1 0-1.06 1.06l2.112 2.113A11.91 11.91 0 0 0 1.5 12s3 7.5 10.5 7.5a10.9 10.9 0 0 0 5.042-1.196l3.428 3.426a.75.75 0 1 0 1.06-1.06L3.53 2.47Zm12.643 14.763A9.42 9.42 0 0 1 12 18c-5.716 0-8.476-5.006-9.404-6 .453-.49 1.38-1.39 2.64-2.18l2.18 2.18a4.5 4.5 0 0 0 6.307 6.233Zm-4.77-4.77 3.57 3.57a4.5 4.5 0 0 0-3.57-3.57Z"/>
                <path d="M12 6a10.9 10.9 0 0 1 5.042 1.196l-1.7 1.7A9.42 9.42 0 0 0 12 6c-5.716 0-8.476 5.006-9.404 6 .453.49 1.38 1.39 2.64 2.18l1.064 1.065A6 6 0 0 1 12 6Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 5c7.5 0 10.5 7 10.5 7s-3 7-10.5 7S1.5 12 1.5 12 4.5 5 12 5Zm0 2C6.284 7 3.524 12.006 2.596 13c.928.994 3.688 6 9.404 6s8.476-5.006 9.404-6C20.476 12.006 17.716 7 12 7Zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`p-2 pr-10 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-gray-100 text-gray-900 border-gray-300"
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((s) => !s)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.53 2.47a.75.75 0 1 0-1.06 1.06l2.112 2.113A11.91 11.91 0 0 0 1.5 12s3 7.5 10.5 7.5a10.9 10.9 0 0 0 5.042-1.196l3.428 3.426a.75.75 0 1 0 1.06-1.06L3.53 2.47Zm12.643 14.763A9.42 9.42 0 0 1 12 18c-5.716 0-8.476-5.006-9.404-6 .453-.49 1.38-1.39 2.64-2.18l2.18 2.18a4.5 4.5 0 0 0 6.307 6.233Zm-4.77-4.77 3.57 3.57a4.5 4.5 0 0 0-3.57-3.57Z"/>
                <path d="M12 6a10.9 10.9 0 0 1 5.042 1.196l-1.7 1.7A9.42 9.42 0 0 0 12 6c-5.716 0-8.476 5.006-9.404 6 .453.49 1.38 1.39 2.64 2.18l1.064 1.065A6 6 0 0 1 12 6Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 5c7.5 0 10.5 7 10.5 7s-3 7-10.5 7S1.5 12 1.5 12 4.5 5 12 5Zm0 2C6.284 7 3.524 12.006 2.596 13c.928.994 3.688 6 9.404 6s8.476-5.006 9.404-6C20.476 12.006 17.716 7 12 7Zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/>
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white p-2 rounded font-medium transition-all duration-200"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <p className={`text-center text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Remembered your password?{" "}
          <Link to="/login" className="text-indigo-500 hover:text-indigo-400 underline">
            Go to Login
          </Link>
        </p>
      </form>
    </div>
  );
}