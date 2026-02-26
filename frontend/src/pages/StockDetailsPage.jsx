import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const StockDetailsPage = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await api.get(`/stocks/${symbol}`);
        const quote = res.data;
        if (!quote || !quote.symbol) {
          setError("Invalid stock data");
          return;
        }
        setStock(quote);
      } catch {
        setError("Failed to load stock");
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [symbol]);

  if (loading) {
    return <div className="text-center mt-10">Loading stock...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  const chartData = {
    labels: ["Open", "High", "Low", "Price"],
    datasets: [
      {
        label: `${symbol} Data`,
        data: [
          parseFloat(stock.open),
          parseFloat(stock.high),
          parseFloat(stock.low),
          parseFloat(stock.close),
        ],
        borderColor: "blue",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        {symbol} Stock Details
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <p><strong>Price:</strong> {stock.close}</p>
        <p><strong>Change:</strong> {stock.change}</p>
        <p><strong>Change %:</strong> {stock.percent_change}%</p>
        <p><strong>Volume:</strong> {stock.volume}</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default StockDetailsPage;
