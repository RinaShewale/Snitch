import nodemailer from "nodemailer";
import { config } from "../config/config.js";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: config.BREVO_EMAIL,
    pass: config.BREVO_SMTP_KEY,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Brevo mailer error:", error);
  } else {
    console.log("✅ Brevo mailer is ready");
  }
});

export default transporter;