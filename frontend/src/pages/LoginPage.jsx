import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signupMessage = location.state?.message || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-slate-300 mb-6 text-sm">Login to continue to TradeSphere.</p>

        {signupMessage && (
          <p className="text-green-400 mb-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm">
            {signupMessage}
          </p>
        )}
        {error && (
          <p className="text-red-300 mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm">
            {error}
          </p>
        )}

        <label className="mb-2 block text-sm text-slate-300">Email</label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full p-3 mb-4 bg-slate-700 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mb-2 block text-sm text-slate-300">Password</label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="Enter password"
          className="w-full p-3 mb-5 bg-slate-700 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 p-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-5 flex justify-between text-sm">
          <Link to="/signup" className="text-blue-400 hover:text-blue-300">
            Create account
          </Link>
          <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
