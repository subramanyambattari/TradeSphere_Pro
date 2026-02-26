import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || form.password.length < 6) {
      return setError("Valid data required (password min 6)");
    }
    try {
      setLoading(true);
      await signup(form.name, form.email, form.password);
      navigate("/login", {
        state: {
          message: "Signup successful. Please login to continue.",
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/90 p-8 shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-slate-300 mb-6 text-sm">Sign up to start trading and tracking.</p>
        {error && (
          <p className="text-red-300 mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm">
            {error}
          </p>
        )}

        <label className="mb-2 block text-sm text-slate-300">Name</label>
        <input
          type="text"
          name="name"
          autoComplete="name"
          required
          placeholder="Your full name"
          className="w-full p-3 mb-4 bg-slate-700 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="mb-2 block text-sm text-slate-300">Email</label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full p-3 mb-4 bg-slate-700 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="mb-2 block text-sm text-slate-300">Password</label>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          required
          placeholder="Minimum 6 characters"
          className="w-full p-3 mb-5 bg-slate-700 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 p-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>
        <p className="mt-5 text-center text-sm">
          Have account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
