import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAlerts, markAlertRead, markAllRead } from "../controllers/alertController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getAlerts);
router.put("/read-all", markAllRead);
router.put("/:id/read", markAlertRead);

export default router;
