import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useTheme } from "../context/useTheme";

const DashboardPage = () => {
  const { dark } = useTheme();

  const [symbol, setSymbol] = useState("");
  const [stock, setStock] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState("1");
  const [type, setType] = useState("BUY");
  const [transactions, setTransactions] = useState([]);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(true);

  const lastPrice = useMemo(
    () => (stock?.close ? Number.parseFloat(stock.close) : 0),
    [stock]
  );

  const normalizeTransactions = (items) =>
    items.map((t) => ({
      id: t._id || t.id || Date.now(),
      symbol: t.symbol,
      unitPrice: Number.parseFloat(t.price),
      quantity: Number(t.quantity),
      totalPrice: Number.parseFloat(t.price) * Number(t.quantity),
      type: String(t.type || "").toUpperCase(),
      date: t.createdAt ? new Date(t.createdAt).toLocaleString() : t.date,
    }));

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const { data } = await api.get("/transactions/mine");
        setTransactions(normalizeTransactions(data || []));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transactions.");
      } finally {
        setTxLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const searchStock = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) {
      setError("Please enter a stock symbol.");
      return;
    }

    try {
      setSearchLoading(true);
      setError("");
      const { data } = await api.get(`/stocks/${symbol.trim().toUpperCase()}`);
      if (!data?.symbol) {
        setError("Invalid stock response.");
        return;
      }
      setStock(data);
    } catch (err) {
      setError(err.response?.data?.message || "Stock not found or server error.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleTrade = async () => {
    if (!stock) {
      setError("Search a stock first.");
      return;
    }

    const parsedQty = Number.parseInt(quantity, 10);
    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    setError("");
    try {
      setTradeLoading(true);
      const payload = {
        symbol: stock.symbol,
        price: Number.parseFloat(stock.close),
        quantity: parsedQty,
        type: type.toLowerCase(),
      };

      const { data } = await api.post("/transactions", payload);
      const [saved] = normalizeTransactions([data]);
      setTransactions((prev) => [saved, ...prev]);
      setQuantity("1");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save transaction.");
    } finally {
      setTradeLoading(false);
    }
  };

  const exportCsv = () => {
    if (transactions.length === 0) return;
    const rows = [
      ["Symbol", "Unit Price", "Quantity", "Total", "Type", "Date"],
      ...transactions.map((t) => [
        t.symbol,
        t.unitPrice.toFixed(2),
        t.quantity,
        t.totalPrice.toFixed(2),
        t.type,
        t.date,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const cardClass = dark
    ? "bg-slate-900 border-slate-700 text-slate-100"
    : "bg-slate-100 border-slate-200 text-slate-900";
  const panelClass = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const inputClass = dark
    ? "border-slate-600 bg-slate-800 text-slate-100 focus:ring-blue-500"
    : "border-slate-300 bg-white text-slate-800 focus:ring-blue-500";
  const tableHeadClass = dark
    ? "bg-slate-800 text-slate-300"
    : "bg-slate-50 text-slate-500";
  const rowClass = dark ? "border-slate-700" : "border-slate-100";

  return (
    <div className="py-6 px-4 transition-colors">
      <div className={`mx-auto w-full max-w-5xl rounded-3xl p-6 md:p-8 shadow-xl border transition-colors ${cardClass}`}>
        <div className="mb-6">
          <h1 className={`text-4xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>Stock Market Dashboard</h1>
          <p className={`mt-2 ${dark ? "text-slate-300" : "text-slate-500"}`}>
            Track live quotes and add trade entries in one place.
          </p>
        </div>

        <form onSubmit={searchStock} className="mb-6 flex flex-col gap-3 md:flex-row">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (AAPL)"
            className={`h-11 flex-1 rounded-xl border px-4 outline-none focus:ring-2 transition-colors ${inputClass}`}
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="h-11 rounded-xl bg-blue-600 px-8 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            dark
              ? "border-rose-400/50 bg-rose-950/40 text-rose-200"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}>
            {error}
          </div>
        )}

        {stock && (
          <div className={`mb-6 rounded-2xl border p-5 shadow-sm transition-colors ${panelClass}`}>
            <h2 className={`text-xl font-bold ${dark ? "text-slate-100" : "text-slate-800"}`}>
              {stock.name || stock.symbol} ({stock.symbol})
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <div className={`rounded-lg p-3 ${dark ? "bg-slate-700 text-slate-100" : "bg-slate-50"}`}>Open: {stock.open}</div>
              <div className={`rounded-lg p-3 ${dark ? "bg-slate-700 text-slate-100" : "bg-slate-50"}`}>High: {stock.high}</div>
              <div className={`rounded-lg p-3 ${dark ? "bg-slate-700 text-slate-100" : "bg-slate-50"}`}>Low: {stock.low}</div>
              <div className={`rounded-lg p-3 font-semibold ${dark ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}>
                Price: {stock.close}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`h-11 rounded-xl border px-3 outline-none focus:ring-2 transition-colors ${inputClass}`}
                placeholder="Quantity"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`h-11 rounded-xl border px-3 outline-none focus:ring-2 transition-colors ${inputClass}`}
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
              <div className={`h-11 rounded-xl border px-3 flex items-center transition-colors ${
                dark
                  ? "border-slate-600 bg-slate-700 text-slate-200"
                  : "border-slate-300 bg-slate-50 text-slate-700"
              }`}>
                Total: ${(lastPrice * Number(quantity || 0)).toFixed(2)}
              </div>
              <button
                type="button"
                onClick={handleTrade}
                disabled={tradeLoading}
                className="h-11 rounded-xl bg-emerald-600 px-4 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {tradeLoading ? "Saving..." : "Confirm Trade"}
              </button>
            </div>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-slate-900"}`}>My Transactions</h2>
          <button
            type="button"
            onClick={exportCsv}
            disabled={transactions.length === 0}
            className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>

        <div className={`overflow-x-auto rounded-2xl border shadow-sm transition-colors ${panelClass}`}>
          <table className="min-w-full text-left">
            <thead className={`text-xs uppercase tracking-wide ${tableHeadClass}`}>
              <tr>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {txLoading ? (
                <tr>
                  <td colSpan="6" className={`px-4 py-6 text-center ${dark ? "text-slate-300" : "text-slate-500"}`}>
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className={`px-4 py-6 text-center ${dark ? "text-slate-300" : "text-slate-500"}`}>
                    No transactions yet. Search a stock and place your first trade.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className={`border-t ${rowClass}`}>
                    <td className={`px-4 py-3 font-medium ${dark ? "text-slate-100" : "text-slate-700"}`}>{t.symbol}</td>
                    <td className={`px-4 py-3 ${dark ? "text-slate-200" : "text-slate-700"}`}>${t.unitPrice.toFixed(2)}</td>
                    <td className={`px-4 py-3 ${dark ? "text-slate-200" : "text-slate-700"}`}>{t.quantity}</td>
                    <td className={`px-4 py-3 ${dark ? "text-slate-200" : "text-slate-700"}`}>${t.totalPrice.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          t.type === "BUY"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${dark ? "text-slate-300" : "text-slate-600"}`}>{t.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
