import { pool } from "../db/db.js";

export const createUsageLog = async (req, res) => {  //create usage record
  const subscriptionId = Number(req.params.subscriptionId);
  const { usageDate, usageType, usageValue } = req.body;

  if (!subscriptionId || !usageDate || !usageType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const ownsSubscription = await pool.query(
      "SELECT 1 FROM subscriptions WHERE subscription_id = $1 AND user_id = $2",
      [subscriptionId, req.user.userId]
    );

    if (ownsSubscription.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const result = await pool.query(
      `
      INSERT INTO usage_logs (subscription_id, usage_date, usage_type, usage_value)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [subscriptionId, usageDate, usageType, usageValue || null]
    );

    return res.status(201).json({ usageLog: result.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to log usage" });
  }
};

export const getUsageLogs = async (req, res) => {
  const subscriptionId = Number(req.params.subscriptionId);
  if (!subscriptionId) {
    return res.status(400).json({ message: "Invalid subscription id" });
  }

  try {
    const result = await pool.query(
      `
      SELECT ul.*
      FROM usage_logs ul
      JOIN subscriptions s ON s.subscription_id = ul.subscription_id
      WHERE ul.subscription_id = $1 AND s.user_id = $2
      ORDER BY ul.usage_date DESC
      `,
      [subscriptionId, req.user.userId]
    );

    return res.json({ usageLogs: result.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch usage logs" });
  }
};

export const createUsageSurvey = async (req, res) => {
  const { responses } = req.body;

  if (!Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({ message: "Survey responses are required" });
  }

  const ids = responses
    .map((item) => Number(item.subscriptionId))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (ids.length === 0) {
    return res.status(400).json({ message: "No valid subscriptions provided" });
  }

  try {
    const allowed = await pool.query(
      "SELECT subscription_id FROM subscriptions WHERE user_id = $1 AND subscription_id = ANY($2::int[])",
      [req.user.userId, ids]
    );

    const allowedSet = new Set(allowed.rows.map((row) => row.subscription_id));
    const normalized = responses
      .map((item) => ({
        subscriptionId: Number(item.subscriptionId),
        status: String(item.status || "").toLowerCase(),
      }))
      .filter(
        (item) =>
          allowedSet.has(item.subscriptionId) &&
          (item.status === "using" || item.status === "not_using")
      );

    if (normalized.length === 0) {
      return res.status(400).json({ message: "No valid survey entries" });
    }

    const values = [];
    const placeholders = normalized.map((item, index) => {
      const offset = index * 2;
      values.push(item.subscriptionId, item.status);
      return `($${offset + 1}, CURRENT_DATE, 'survey', $${offset + 2})`;
    });

    const result = await pool.query(
      `
      INSERT INTO usage_logs (subscription_id, usage_date, usage_type, usage_value)
      VALUES ${placeholders.join(", ")}
      RETURNING usage_id
      `,
      values
    );

    return res.status(201).json({ saved: result.rows.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to save survey responses" });
  }
};
