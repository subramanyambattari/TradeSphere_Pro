import { useEffect, useState } from "react";
import { useTheme } from "../context/useTheme";
import api from "../services/api";

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "AMZN"];

const MarketPage = () => {
  const { dark } = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const results = await Promise.all(
          DEFAULT_SYMBOLS.map(async (s) => {
            const { data } = await api.get(`/stocks/${s}`);
            return data;
          })
        );
        setRows(results.filter(Boolean));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load market data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cardClass = dark
    ? "border-slate-700 bg-slate-900 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className={`rounded-2xl border p-6 ${cardClass}`}>
        <h1 className="text-2xl font-bold mb-2">Market</h1>
        {loading ? <p>Loading market snapshot...</p> : null}
        {error ? <p className="text-rose-400">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => (
              <div key={row.symbol} className={`rounded-xl border p-4 ${cardClass}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">{row.symbol}</h2>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      Number(row.change || 0) >= 0
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {row.percent_change || "0%"}
                  </span>
                </div>
                <p className="mt-2 text-sm opacity-80">{row.name || "Company"}</p>
                <p className="mt-3 text-2xl font-bold">${Number(row.close || 0).toFixed(2)}</p>
                <p className="text-sm opacity-80">
                  Day range: {row.low} - {row.high}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MarketPage;
