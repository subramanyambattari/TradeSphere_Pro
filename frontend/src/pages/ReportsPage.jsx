import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/useTheme";
import api from "../services/api";

const ReportsPage = () => {
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

  const summary = useMemo(() => {
    const grossBuy = rows
      .filter((r) => r.type === "buy")
      .reduce((acc, r) => acc + Number(r.price) * Number(r.quantity), 0);
    const grossSell = rows
      .filter((r) => r.type === "sell")
      .reduce((acc, r) => acc + Number(r.price) * Number(r.quantity), 0);
    return {
      count: rows.length,
      grossBuy,
      grossSell,
      net: grossSell - grossBuy,
    };
  }, [rows]);

  const exportSummaryCsv = () => {
    const csv = [
      ["Metric", "Value"],
      ["Total Trades", summary.count],
      ["Gross Buy", summary.grossBuy.toFixed(2)],
      ["Gross Sell", summary.grossSell.toFixed(2)],
      ["Net Cash Flow", summary.net.toFixed(2)],
    ]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report-summary.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportTransactionsCsv = () => {
    const csv = [
      ["Symbol", "Type", "Quantity", "Price", "Amount", "Date"],
      ...rows.map((r) => [
        r.symbol,
        String(r.type).toUpperCase(),
        r.quantity,
        Number(r.price).toFixed(2),
        (Number(r.price) * Number(r.quantity)).toFixed(2),
        new Date(r.createdAt).toLocaleString(),
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const cardClass = dark
    ? "border-slate-700 bg-slate-900 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className={`rounded-2xl border p-6 ${cardClass}`}>
        <h1 className="text-2xl font-bold mb-2">Reports</h1>
        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div className={`rounded-xl border p-4 ${cardClass}`}>
                <p className="text-sm opacity-80">Trades</p>
                <p className="text-2xl font-bold">{summary.count}</p>
              </div>
              <div className={`rounded-xl border p-4 ${cardClass}`}>
                <p className="text-sm opacity-80">Gross Buy</p>
                <p className="text-2xl font-bold">${summary.grossBuy.toFixed(2)}</p>
              </div>
              <div className={`rounded-xl border p-4 ${cardClass}`}>
                <p className="text-sm opacity-80">Gross Sell</p>
                <p className="text-2xl font-bold">${summary.grossSell.toFixed(2)}</p>
              </div>
              <div className={`rounded-xl border p-4 ${cardClass}`}>
                <p className="text-sm opacity-80">Net Cash Flow</p>
                <p className={`text-2xl font-bold ${summary.net >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  ${summary.net.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportSummaryCsv}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Export Summary CSV
              </button>
              <button
                type="button"
                onClick={exportTransactionsCsv}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Export Transactions CSV
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
