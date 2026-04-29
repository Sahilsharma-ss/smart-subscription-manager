import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptionById,
  getSubscriptions,
  updateSubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getSubscriptions);
router.get("/:id", getSubscriptionById);
router.post("/", createSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
