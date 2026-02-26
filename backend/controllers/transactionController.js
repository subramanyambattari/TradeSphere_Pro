import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const createTransaction = async (req, res) => {
  const { symbol, type, quantity, price } = req.body;

  if (!symbol || !type || !quantity || !price) {
    return res.status(400).json({ message: "All fields required" });
  }

  const transaction = await Transaction.create({
    user: req.user._id, 
    symbol: symbol.toUpperCase(),
    type,
    quantity,
    price
  });

  res.status(201).json(transaction);
};

export const getMyTransactions = async (req, res) => {
  const transactions = await Transaction.find({
    user: req.user._id
  }).sort({ createdAt: -1 });

  res.json(transactions);
};

export const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(transactions);
};

export const updateTransactionStatus = async (req, res) => {
  const { status } = req.body;

  const transaction = await Transaction.findById(req.params.id)
    .populate("user");

  if (!transaction)
    return res.status(404).json({ message: "Transaction not found" });

  if (transaction.status !== "pending")
    return res.status(400).json({ message: "Already processed" });

  transaction.status = status;

  const user = await User.findById(transaction.user._id);

  if (status === "approved") {
    if (transaction.type === "buy") {
      const totalCost = transaction.quantity * transaction.price;

      if (user.balance < totalCost)
        return res.status(400).json({ message: "Insufficient balance" });

      user.balance -= totalCost;

      const stock = user.portfolio.find(
        (item) => item.symbol === transaction.symbol
      );

      if (stock) {
        stock.quantity += transaction.quantity;
      } else {
        user.portfolio.push({
          symbol: transaction.symbol,
          quantity: transaction.quantity
        });
      }
    }

    if (transaction.type === "sell") {
      const stock = user.portfolio.find(
        (item) => item.symbol === transaction.symbol
      );

      if (!stock || stock.quantity < transaction.quantity)
        return res.status(400).json({ message: "Not enough shares" });

      stock.quantity -= transaction.quantity;
      user.balance += transaction.quantity * transaction.price;
    }
  }

  await user.save();
  await transaction.save();

  res.json({ message: "Transaction updated", transaction });
};