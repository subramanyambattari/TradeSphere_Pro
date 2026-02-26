import { useEffect, useState } from "react";
import api from "../services/api";
import { useTheme } from "../context/useTheme";

const WatchlistPage = () => {
  const { dark } = useTheme();
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadWatchlist = async () => {
    try {
      const { data } = await api.get("/watchlist");
      const list = Array.isArray(data) ? data : [];
      setItems(list);

      const symbols = list.map((item) => item.symbol).filter(Boolean);
      const quoteResponses = await Promise.all(
        symbols.map(async (s) => {
          try {
            const { data: q } = await api.get(`/stocks/${s}`);
            return [s, q];
          } catch {
            return [s, null];
          }
        })
      );
      setQuotes(Object.fromEntries(quoteResponses));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load watchlist.");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        await loadWatchlist();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addToWatchlist = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    try {
      setSaving(true);
      setError("");
      await api.post("/watchlist", { symbol: symbol.trim().toUpperCase() });
      setSymbol("");
      await loadWatchlist();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add symbol.");
    } finally {
      setSaving(false);
    }
  };

  const removeFromWatchlist = async (s) => {
    try {
      setError("");
      await api.delete(`/watchlist/${s}`);
      await loadWatchlist();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove symbol.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div
        className={`rounded-2xl border p-6 ${
          dark
            ? "border-slate-700 bg-slate-900 text-slate-100"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">Watchlist</h1>

        <form onSubmit={addToWatchlist} className="mb-4 flex gap-2">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Add symbol (AAPL)"
            className={`h-11 flex-1 rounded-xl border px-3 outline-none ${
              dark
                ? "border-slate-600 bg-slate-800 text-slate-100"
                : "border-slate-300 bg-white text-slate-800"
            }`}
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add"}
          </button>
        </form>

        {error && (
          <div className="mb-3 rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No watchlist items.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => {
              const s = item.symbol || `item-${idx}`;
              const q = quotes[s];
              return (
                <div
                  key={s}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="text-lg font-semibold">{s}</div>
                    <div className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                      {q?.close ? `Price: $${Number(q.close).toFixed(2)}` : "Price unavailable"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromWatchlist(s)}
                    className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
