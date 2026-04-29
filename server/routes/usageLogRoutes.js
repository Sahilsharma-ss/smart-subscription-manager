import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
	createUsageLog,
	createUsageSurvey,
	getUsageLogs,
} from "../controllers/usageLogController.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/survey", createUsageSurvey);
router.post("/:subscriptionId", createUsageLog);
router.get("/:subscriptionId", getUsageLogs);

export default router;
