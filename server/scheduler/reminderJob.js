import cron from "node-cron";   //to run daily automatically
import { pool } from "../db/db.js";
import { sendEmail } from "../services/mailer.js";

const createAlerts = async () => {
  const upcoming = await pool.query(
    `
    SELECT s.subscription_id,
           s.user_id,
           s.renewal_date,
           srv.name AS service_name,
           u.email,
           u.name AS user_name
    FROM subscriptions s
    JOIN services srv ON srv.service_id = s.service_id
    JOIN users u ON u.user_id = s.user_id
    WHERE s.status = 'active'
      AND s.renewal_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
    `
  );

  for (const row of upcoming.rows) {    //avoid duplicate alert
    const existing = await pool.query(
      `
      SELECT 1 FROM alerts
      WHERE subscription_id = $1 AND alert_date = $2 AND alert_type = 'renewal_reminder'
      `,
      [row.subscription_id, row.renewal_date]
    );

    if (existing.rows.length > 0) {
      continue;
    }

    const alertResult = await pool.query(
      `
      INSERT INTO alerts (user_id, subscription_id, alert_type, alert_date, status)
      VALUES ($1, $2, 'renewal_reminder', $3, 'pending')
      RETURNING alert_id
      `,
      [row.user_id, row.subscription_id, row.renewal_date]
    );

    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(row.renewal_date) - new Date()) / (1000 * 60 * 60 * 24))
    );

    const message = `Your ${row.service_name} subscription renews in ${daysLeft} days on ${row.renewal_date}.`;
    const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const emailText = `${message}\n\nManage your subscriptions: ${appUrl}/subscriptions`;

    await pool.query(
      `
      INSERT INTO notifications (alert_id, user_id, message, channel, status)
      VALUES ($1, $2, $3, 'in-app', 'unread')
      `,
      [alertResult.rows[0].alert_id, row.user_id, message]
    );

    if (row.email) {
      await sendEmail({
        to: row.email,
        subject: "Subscription renewal reminder",
        text: emailText,
      });
    }
  }
};

export const startReminderJob = () => {
  cron.schedule("8 15 * * *", async () => {
    try {
      await createAlerts();
    } catch (error) {
      console.log("Reminder job failed", error.message);
    }
  });
};
