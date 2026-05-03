import { pool } from "../db/db.js";

const isPossiblyUnused = (lastUsageDate) => {   //check whether subscription is unused
  if (!lastUsageDate) return true;
  const today = new Date();
  const lastUsed = new Date(lastUsageDate);
  const diffDays = Math.ceil((today - lastUsed) / (1000 * 60 * 60 * 24));
  return diffDays > 30;
};

export const getSubscriptions = async (req, res) => {  //fetch all subs of logged in user
  try {
    const result = await pool.query(
      `
      SELECT s.*, srv.name AS service_name, cat.name AS category_name, sp.plan_name,
              MAX(ul.usage_date) AS last_usage_date    --find last used date and add field if unused
      FROM subscriptions s
      JOIN services srv ON srv.service_id = s.service_id
      JOIN categories cat ON cat.category_id = s.category_id
      JOIN subscription_plans sp ON sp.plan_id = s.plan_id
      LEFT JOIN usage_logs ul ON ul.subscription_id = s.subscription_id
      WHERE s.user_id = $1
            GROUP BY s.subscription_id, srv.name, cat.name, sp.plan_name
      ORDER BY s.renewal_date ASC
      `,
      [req.user.userId]
    );

    const subscriptions = result.rows.map((item) => ({
      ...item,
      possibly_unused: isPossiblyUnused(item.last_usage_date),
    }));

    return res.json({ subscriptions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};

export const getSubscriptionById = async (req, res) => {
  const subscriptionId = Number(req.params.id);
  if (!subscriptionId) {
    return res.status(400).json({ message: "Invalid subscription id" });
  }

  try {
    const result = await pool.query(
      `
      SELECT * FROM subscriptions
      WHERE subscription_id = $1 AND user_id = $2
      `,
      [subscriptionId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.json({ subscription: result.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch subscription" });
  }
};

export const createSubscription = async (req, res) => { 
  const {
    serviceId,
    planId,
    categoryId,
    startDate,
    renewalDate,
    billingCycle,
    price,
    currency,
    status,
    autoRenew,
    importanceLevel,
    notes,
  } = req.body;

  if (!serviceId || !planId || !categoryId || !renewalDate || price === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO subscriptions
      (user_id, service_id, plan_id, category_id, start_date, renewal_date,
       billing_cycle, price, currency, status, auto_renew, importance_level, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
      `,
      [
        req.user.userId,
        serviceId,
        planId,
        categoryId,
        startDate || null,
        renewalDate,
        billingCycle || "monthly",
        price,
        currency || "INR",
        status || "active",
        autoRenew !== undefined ? Boolean(autoRenew) : true,
        importanceLevel || "medium",
        notes || null,
      ]
    );

    return res.status(201).json({ subscription: result.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create subscription" });
  }
};

export const updateSubscription = async (req, res) => {
  const subscriptionId = Number(req.params.id);
  const {
    serviceId,
    planId,
    categoryId,
    startDate,
    renewalDate,
    billingCycle,
    price,
    currency,
    status,
    autoRenew,
    importanceLevel,
    notes,
  } = req.body;

  if (!subscriptionId) {
    return res.status(400).json({ message: "Invalid subscription id" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE subscriptions
      SET service_id = $1,
          plan_id = $2,
          category_id = $3,
          start_date = $4,
          renewal_date = $5,
          billing_cycle = $6,
          price = $7,
          currency = $8,
          status = $9,
          auto_renew = $10,
          importance_level = $11,
          notes = $12,
          updated_at = CURRENT_TIMESTAMP
      WHERE subscription_id = $13 AND user_id = $14
      RETURNING *
      `,
      [
        serviceId,
        planId,
        categoryId,
        startDate || null,
        renewalDate,
        billingCycle,
        price,
        currency || "INR",
        status,
        autoRenew !== undefined ? Boolean(autoRenew) : true,
        importanceLevel || "medium",
        notes || null,
        subscriptionId,
        req.user.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.json({ subscription: result.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update subscription" });
  }
};

export const deleteSubscription = async (req, res) => {
  const subscriptionId = Number(req.params.id);
  if (!subscriptionId) {
    return res.status(400).json({ message: "Invalid subscription id" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM subscriptions WHERE subscription_id = $1 AND user_id = $2 RETURNING subscription_id",
      [subscriptionId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.json({ message: "Subscription deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete subscription" });
  }
};
