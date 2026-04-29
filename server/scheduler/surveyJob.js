import cron from "node-cron";
import { pool } from "../db/db.js";
import { sendEmail } from "../services/mailer.js";

const sendSurveyEmails = async () => {
  const result = await pool.query(
    `
    SELECT DISTINCT u.user_id, u.email, u.name
    FROM users u
    JOIN subscriptions s ON s.user_id = u.user_id
    WHERE s.status = 'active'
    `
  );

  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const surveyLink = `${appUrl}/survey`;

  for (const user of result.rows) {
    if (!user.email) {
      continue;
    }

    const greeting = user.name ? `Hi ${user.name},` : "Hi,";
    const text = `${greeting}\n\nPlease take a minute to tell us which subscriptions you are actively using. This helps us suggest cost savings.\n\nSurvey link: ${surveyLink}`;

    await sendEmail({
      to: user.email,
      subject: "Quick subscription usage survey",
      text,
    });
  }
};

export const startSurveyJob = () => {
  cron.schedule("0 9 * * 1", async () => {
    try {
      await sendSurveyEmails();
    } catch (error) {
      console.log("Survey job failed", error.message);
    }
  });
};
