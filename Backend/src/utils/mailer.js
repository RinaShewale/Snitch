import nodemailer from "nodemailer";
import { config } from "../config/config.js";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

// Optional: verify connection (good for debugging)
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mailer error:", error.message);
  } else {
    console.log("✅ Mailer is ready to send emails");
  }
});

export default transporter;