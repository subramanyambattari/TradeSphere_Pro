import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/useTheme";
import api from "../../services/api";

const AppShell = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const { data } = await api.get("/watchlist");
        setWatchlistCount(Array.isArray(data) ? data.length : 0);
      } catch {
        setWatchlistCount(0);
      }
    };

    loadWatchlist();
  }, []);

  const navItemClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      isActive
        ? "bg-emerald-900/80 text-white"
        : dark
          ? "text-cyan-200 hover:bg-slate-800"
          : "text-slate-700 hover:bg-slate-200"
    }`;

  const pageClass = dark ? "bg-slate-950" : "bg-slate-200";
  const barClass = dark
    ? "bg-slate-900 border-slate-700 text-white"
    : "bg-white border-slate-300 text-slate-900";

  return (
    <div className={`min-h-screen transition-colors ${pageClass}`}>
      <div className={`sticky top-0 z-20 border-b ${barClass}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cyan-900/80 px-3 py-2 text-sm font-semibold text-cyan-100">
              Hi, {user?.name || "User"}
            </span>
            <NavLink to="/dashboard" end className={navItemClass}>
              Dashboard
            </NavLink>
            <NavLink to="/dashboard/watchlist" className={navItemClass}>
              Watchlist ({watchlistCount})
            </NavLink>
            <NavLink to="/dashboard/transactions" className={navItemClass}>
              Transactions
            </NavLink>
            <NavLink to="/dashboard/insights" className={navItemClass}>
              Insights
            </NavLink>
            <NavLink to="/dashboard/market" className={navItemClass}>
              Market
            </NavLink>
            <NavLink to="/dashboard/reports" className={navItemClass}>
              Reports
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-emerald-700 bg-emerald-950/80 px-3 py-2 text-sm font-semibold text-emerald-100"
            >
              Theme: {dark ? "dark" : "light"}
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default AppShell;
