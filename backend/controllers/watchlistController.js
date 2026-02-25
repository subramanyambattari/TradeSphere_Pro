import User from "../models/User.js";

export const addToWatchlist = async (req, res) => {
  const { symbol } = req.body;

  const user = await User.findById(req.user._id);

  const exists = user.watchlist.find(
    (item) => item.symbol === symbol.toUpperCase()
  );

  if (exists)
    return res.status(400).json({ message: "Already in watchlist" });

  user.watchlist.push({ symbol: symbol.toUpperCase() });

  await user.save();

  res.json(user.watchlist);
};

export const removeFromWatchlist = async (req, res) => {
  const { symbol } = req.params;

  const user = await User.findById(req.user._id);

  user.watchlist = user.watchlist.filter(
    (item) => item.symbol !== symbol.toUpperCase()
  );

  await user.save();

  res.json(user.watchlist);
};

export const getWatchlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json(user.watchlist);
};