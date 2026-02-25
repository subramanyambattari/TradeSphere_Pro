import express from "express";
import { getStock } from "../controllers/stockController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:symbol", protect, getStock);

export default router;