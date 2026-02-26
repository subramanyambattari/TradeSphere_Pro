import { useEffect, useState } from "react";
import api from "../services/api";
import { useTheme } from "../context/useTheme";

const TransactionsPage = () => {
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className={`rounded-2xl border p-6 ${dark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"}`}>
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        {loading ? (
          <p>Loading...</p>
        ) : rows.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="text-left text-sm">
                <tr>
                  <th className="py-2 pr-4">Symbol</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Quantity</th>
                  <th className="py-2 pr-4">Price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t._id} className="border-t border-slate-300/30">
                    <td className="py-2 pr-4">{t.symbol}</td>
                    <td className="py-2 pr-4 uppercase">{t.type}</td>
                    <td className="py-2 pr-4">{t.quantity}</td>
                    <td className="py-2 pr-4">${Number(t.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
