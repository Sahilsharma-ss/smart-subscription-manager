import { pool } from "../db/db.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [
      totalActiveRes,
      monthlyTotalRes,
      upcomingRes,
      financialExposureRes,
      unusedRes,
      currencyRes,
      surveyUnusedRes,
    ] = await Promise.all([
      pool.query(
        "SELECT COUNT(*) FROM subscriptions WHERE user_id = $1 AND status = 'active'",
        [userId]
      ),
      pool.query(
        `
        SELECT COALESCE(SUM(
          CASE WHEN billing_cycle = 'yearly' THEN price / 12
               WHEN billing_cycle = 'quarterly' THEN price / 3
               ELSE price END
        ), 0) AS monthly_total
        FROM subscriptions
        WHERE user_id = $1 AND status = 'active'
        `,
        [userId]
      ),
      pool.query(
        `
        SELECT s.subscription_id, s.renewal_date, s.price, s.currency, s.status,
               srv.name AS service_name, sp.plan_name,
               GREATEST(0, (s.renewal_date - CURRENT_DATE)) AS days_left
        FROM subscriptions s
        JOIN services srv ON srv.service_id = s.service_id
        JOIN subscription_plans sp ON sp.plan_id = s.plan_id
        WHERE s.user_id = $1
          AND s.renewal_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
        ORDER BY s.renewal_date ASC
        `,
        [userId]
      ),
      pool.query(
        `
        SELECT COALESCE(SUM(price), 0) AS exposure
        FROM subscriptions
        WHERE user_id = $1
          AND renewal_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
        `,
        [userId]
      ),
      pool.query(
        `
        SELECT COUNT(*) AS unused_count
        FROM subscriptions s
        LEFT JOIN (
          SELECT subscription_id, MAX(usage_date) AS last_usage
          FROM usage_logs
          GROUP BY subscription_id
        ) ul ON ul.subscription_id = s.subscription_id
        WHERE s.user_id = $1
          AND (ul.last_usage IS NULL OR ul.last_usage < (CURRENT_DATE - INTERVAL '30 days'))
        `,
        [userId]
      ),
      pool.query("SELECT currency FROM users WHERE user_id = $1", [userId]),
      pool.query(
        `
        SELECT s.subscription_id,
               s.price,
               s.currency,
               s.renewal_date,
               srv.name AS service_name,
               sp.plan_name,
               ul.usage_date
        FROM subscriptions s
        JOIN services srv ON srv.service_id = s.service_id
        JOIN subscription_plans sp ON sp.plan_id = s.plan_id
        JOIN LATERAL (
          SELECT usage_date, usage_value
          FROM usage_logs
          WHERE subscription_id = s.subscription_id
            AND usage_type = 'survey'
          ORDER BY usage_date DESC, usage_id DESC
          LIMIT 1
        ) ul ON true
        WHERE s.user_id = $1
          AND ul.usage_value = 'not_using'
        ORDER BY s.renewal_date ASC
        `,
        [userId]
      ),
    ]);

    return res.json({
      totalActive: Number(totalActiveRes.rows[0].count),
      monthlyTotal: Number(monthlyTotalRes.rows[0].monthly_total),
      upcomingRenewals: upcomingRes.rows,
      upcomingCount: upcomingRes.rows.length,
      financialExposure: Number(financialExposureRes.rows[0].exposure),
      unusedCount: Number(unusedRes.rows[0].unused_count),
      currency: currencyRes.rows[0]?.currency || "INR",
      surveyUnused: surveyUnusedRes.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
};
