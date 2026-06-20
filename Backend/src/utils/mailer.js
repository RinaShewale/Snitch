import nodemailer from "nodemailer";
import { config } from "../config/config.js";

console.log("EMAIL:", config.BREVO_EMAIL);
console.log("KEY EXISTS:", !!config.BREVO_SMTP_KEY);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: config.BREVO_EMAIL,
    pass: config.BREVO_SMTP_KEY,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Brevo mailer error:", error);
  } else {
    console.log("✅ Brevo mailer is ready");
  }
});

export default transporter;