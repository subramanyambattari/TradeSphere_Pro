import express from "express";
import {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
  updateTransactionStatus
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, createTransaction);
router.get("/mine", protect, getMyTransactions);

router.get("/", protect, adminOnly, getAllTransactions);
router.put("/:id", protect, adminOnly, updateTransactionStatus);

export default router;