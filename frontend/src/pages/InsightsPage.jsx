import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/useTheme";
import api from "../services/api";

const InsightsPage = () => {
  const { dark } = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/transactions/mine");
        setRows(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const metrics = useMemo(() => {
    const totalTrades = rows.length;
    const buyTrades = rows.filter((r) => r.type === "buy");
    const sellTrades = rows.filter((r) => r.type === "sell");
    const buyVolume = buyTrades.reduce((acc, r) => acc + Number(r.quantity || 0), 0);
    const sellVolume = sellTrades.reduce((acc, r) => acc + Number(r.quantity || 0), 0);
    const grossBuy = buyTrades.reduce(
      (acc, r) => acc + Number(r.price || 0) * Number(r.quantity || 0),
      0
    );
    const grossSell = sellTrades.reduce(
      (acc, r) => acc + Number(r.price || 0) * Number(r.quantity || 0),
      0
    );

    return {
      totalTrades,
      buyVolume,
      sellVolume,
      grossBuy,
      grossSell,
      netCashFlow: grossSell - grossBuy,
    };
  }, [rows]);

  const cardClass = dark
    ? "border-slate-700 bg-slate-900 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className={`rounded-2xl border p-6 ${cardClass}`}>
        <h1 className="text-2xl font-bold mb-2">Insights</h1>
        {loading ? (
          <p>Loading insights...</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className={`rounded-xl border p-4 ${cardClass}`}>
              <p className="text-sm opacity-80">Total Trades</p>
              <p className="text-2xl font-bold">{metrics.totalTrades}</p>
            </div>
            <div className={`rounded-xl border p-4 ${cardClass}`}>
              <p className="text-sm opacity-80">Buy vs Sell Volume</p>
              <p className="text-2xl font-bold">
                {metrics.buyVolume} / {metrics.sellVolume}
              </p>
            </div>
            <div className={`rounded-xl border p-4 ${cardClass}`}>
              <p className="text-sm opacity-80">Net Cash Flow</p>
              <p
                className={`text-2xl font-bold ${
                  metrics.netCashFlow >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                ${metrics.netCashFlow.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
