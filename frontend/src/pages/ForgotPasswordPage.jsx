import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const requestForgotPassword = async (userEmail) => {
    try {
      const { data } = await api.post("/auth/forgot-password", { email: userEmail });
      return data;
    } catch (err) {
      const isLocal = window.location.hostname === "localhost";
      const status = err.response?.status;
      if (isLocal && status === 404) {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/forgot-password",
          { email: userEmail }
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

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const data = await requestForgotPassword(email.trim());
      setMessage(data.message || "Request submitted.");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Forgot password API not found. Redeploy backend on Render.");
      } else {
        setError(err.response?.data?.message || "Request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/90 p-8 shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
        <p className="text-slate-300 mb-6 text-sm">
          Enter your account email to request a password reset token.
        </p>

        {error && (
          <p className="text-red-300 mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm">
            {error}
          </p>
        )}
        {message && (
          <p className="text-green-300 mb-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm">
            {message}
          </p>
        )}
        <label className="mb-2 block text-sm text-slate-300">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full p-3 mb-5 bg-slate-700 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 p-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-indigo-700"
        >
          {loading ? "Submitting..." : "Send Reset Request"}
        </button>

        <p className="mt-5 text-center text-sm">
          Back to <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
