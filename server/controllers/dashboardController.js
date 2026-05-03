import { performance } from "node:perf_hooks";
import { pool } from "../db/db.js";

const timedQuery = async (label, text, params) => {  //runs sql query and measure execution time
  const start = performance.now();
  const result = await pool.query(text, params);
  const durationMs = Math.round(performance.now() - start);
  if (process.env.NODE_ENV !== "production") {
    console.log(`[dashboard] ${label} ${durationMs}ms`);
  }
  return result;
};

export const getDashboard = async (req, res) => {    //main API
  try {
    const userId = req.user.userId;
    const [
      aggregateRes,
      upcomingRes,
      unusedRes,
      currencyRes,
      surveyUnusedRes,
    ] = await Promise.all([   //runs all queries simultaneously
      timedQuery(
        "aggregate",
        `
        SELECT
          COUNT(*) FILTER (WHERE status = 'active') AS total_active,   --count active subscription
          COALESCE(SUM(
            CASE WHEN status = 'active' THEN               --calculates monthly cost
              CASE WHEN billing_cycle = 'yearly' THEN price / 12
                   WHEN billing_cycle = 'quarterly' THEN price / 3
                   ELSE price END
            END
          ), 0) AS monthly_total,
          COUNT(*) FILTER (
            WHERE renewal_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
          ) AS upcoming_count,
          COALESCE(SUM(price) FILTER (
            WHERE renewal_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')   --money to be spend in a month
          ), 0) AS exposure
        FROM subscriptions
        WHERE user_id = $1
        `,
        [userId]
      ),
      timedQuery(
        "upcoming_renewals",
        `
        SELECT s.subscription_id, s.renewal_date, s.price, s.currency, s.status,
               srv.name AS service_name, sp.plan_name,
               GREATEST(0, (s.renewal_date - CURRENT_DATE)) AS days_left
        FROM subscriptions s
        JOIN services srv ON srv.service_id = s.service_id
        LEFT JOIN subscription_plans sp ON sp.plan_id = s.plan_id
        WHERE s.user_id = $1
          AND s.renewal_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
        ORDER BY s.renewal_date ASC
        `,
        [userId]
      ),
      timedQuery(
        "unused_count",
        `
        SELECT COUNT(*) AS unused_count
        FROM subscriptions s
        WHERE s.user_id = $1
          AND NOT EXISTS (
            SELECT 1
            FROM usage_logs ul
            WHERE ul.subscription_id = s.subscription_id
              AND ul.usage_date >= (CURRENT_DATE - INTERVAL '30 days')
          )
        `,
        [userId]
      ),
      timedQuery("currency", "SELECT currency FROM users WHERE user_id = $1", [userId]),
      timedQuery(
        "survey_unused",
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
        LEFT JOIN subscription_plans sp ON sp.plan_id = s.plan_id
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

    const aggregate = aggregateRes.rows[0] || {};

    return res.json({
      totalActive: Number(aggregate.total_active || 0),
      monthlyTotal: Number(aggregate.monthly_total || 0),
      upcomingRenewals: upcomingRes.rows,
      upcomingCount: Number(aggregate.upcoming_count || 0),
      financialExposure: Number(aggregate.exposure || 0),
      unusedCount: Number(unusedRes.rows[0].unused_count),
      currency: currencyRes.rows[0]?.currency || "INR",
      surveyUnused: surveyUnusedRes.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
};
