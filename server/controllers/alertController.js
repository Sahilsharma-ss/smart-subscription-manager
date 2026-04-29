import { pool } from "../db/db.js";

export const getAlerts = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT n.notification_id,
             n.status,
             n.message,
             a.alert_type,
             s.subscription_id,
             s.renewal_date,
             srv.name AS service_name,
             cat.name AS category_name,
             GREATEST(0, (s.renewal_date - CURRENT_DATE)) AS days_left
      FROM notifications n
      JOIN alerts a ON a.alert_id = n.alert_id
      JOIN subscriptions s ON s.subscription_id = a.subscription_id
      JOIN services srv ON srv.service_id = s.service_id
      JOIN categories cat ON cat.category_id = s.category_id
      WHERE n.user_id = $1
      ORDER BY a.alert_date ASC
      `,
      [req.user.userId]
    );

    return res.json({ alerts: result.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

export const markAlertRead = async (req, res) => {
  const notificationId = Number(req.params.id);
  if (!notificationId) {
    return res.status(400).json({ message: "Invalid notification id" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE notifications
      SET status = 'read'
      WHERE notification_id = $1 AND user_id = $2
      RETURNING notification_id
      `,
      [notificationId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({ message: "Marked as read" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update alert" });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await pool.query(
      "UPDATE notifications SET status = 'read' WHERE user_id = $1",
      [req.user.userId]
    );

    return res.json({ message: "All alerts marked as read" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update alerts" });
  }
};
