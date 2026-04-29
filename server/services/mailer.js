import nodemailer from "nodemailer";

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

export const sendEmail = async ({ to, subject, text }) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transporter || !from) {
    console.log("Email not sent: SMTP is not configured");
    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
};
