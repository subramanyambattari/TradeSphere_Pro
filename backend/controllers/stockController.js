import axios from "axios";

export const getStock = async (req, res) => {
  const { symbol } = req.params;

  try {
    const response = await axios.get(
      // `https://www.alphavantage.co/query`,
      `https://api.twelvedata.com/quote`,
      {
        params: {
          // function: "GLOBAL_QUOTE",
          symbol,
          apikey: process.env.STOCK_API_KEY
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Stock API error" });
  }
};