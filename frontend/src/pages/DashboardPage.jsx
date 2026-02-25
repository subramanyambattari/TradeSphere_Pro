import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [symbol, setSymbol] = useState("");
  const [stock, setStock] = useState(null);
  const navigate = useNavigate();

  const searchStock = async () => {
    const { data } = await api.get(`/stocks/${symbol}`);
    setStock(data["Global Quote"]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <input
          className="bg-gray-800 p-3 rounded"
          placeholder="Enter Symbol (AAPL)"
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button
          onClick={searchStock}
          className="bg-blue-600 px-6 rounded"
        >
          Search
        </button>
      </div>

      {stock && (
        <div
          className="bg-gray-900 p-6 rounded cursor-pointer"
          onClick={() => navigate(`/stock/${stock["01. symbol"]}`)}
        >
          <h2 className="text-xl font-bold">
            {stock["01. symbol"]}
          </h2>
          <p>${stock["05. price"]}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;