import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMetadata } from "../controllers/metadataController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getMetadata);

export default router;
