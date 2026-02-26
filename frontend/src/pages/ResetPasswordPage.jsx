import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitResetPassword = async (payload) => {
    try {
      const { data } = await api.post("/auth/reset-password", payload);
      return data;
    } catch (err) {
      const isLocal = window.location.hostname === "localhost";
      const status = err.response?.status;
      if (isLocal && status === 404) {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/reset-password",
          payload
        );
        return data;
      }
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token.trim() || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const data = await submitResetPassword({
        token: token.trim(),
        newPassword,
      });
      setMessage(data.message || "Password reset successful.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Reset password API not found. Redeploy backend on Render.");
      } else {
        setError(err.response?.data?.message || "Reset failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-2xl mb-6">Reset Password</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {message && <p className="text-green-400 mb-4">{message}</p>}

        <input
          type="text"
          placeholder="Reset token"
          className="w-full p-3 mb-3 bg-gray-700 rounded"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 mb-3 bg-gray-700 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full p-3 mb-4 bg-gray-700 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 p-3 rounded disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="mt-4 text-center text-sm">
          Back to <Link to="/login" className="text-blue-400">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
