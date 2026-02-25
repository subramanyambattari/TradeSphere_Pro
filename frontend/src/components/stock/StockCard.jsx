import { Link } from "react-router-dom";

const StockCard = ({ stock }) => {
  return (
    <Link
      to={`/stocks/${stock.symbol}`}
      className="bg-white shadow-md p-4 rounded hover:shadow-lg"
    >
      <h3 className="font-bold text-lg">
        {stock.symbol}
      </h3>
      <p className="text-gray-600">
        ${stock.price}
      </p>
    </Link>
  );
};

export default StockCard;