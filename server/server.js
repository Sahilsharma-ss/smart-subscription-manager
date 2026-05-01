import "dotenv/config";
import dns from "node:dns";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import usageLogRoutes from "./routes/usageLogRoutes.js";
import metadataRoutes from "./routes/metadataRoutes.js";
import { startReminderJob } from "./scheduler/reminderJob.js";  //start background jobs
import { startSurveyJob } from "./scheduler/surveyJob.js";

const app = express();
const PORT = process.env.PORT || 5000;

dns.setDefaultResultOrder("ipv4first");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Smart Subscription Manager API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/usage", usageLogRoutes);
app.use("/api/metadata", metadataRoutes);

startReminderJob();
startSurveyJob();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
