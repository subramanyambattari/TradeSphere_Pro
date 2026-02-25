import express from "express";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist
} from "../controllers/watchlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWatchlist);
router.post("/", protect, addToWatchlist);
router.delete("/:symbol", protect, removeFromWatchlist);

export default router;