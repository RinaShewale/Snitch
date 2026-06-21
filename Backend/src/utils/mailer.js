import nodemailer from "nodemailer";
import dns from "dns";
import { config } from "../config/config.js";

// Force IPv4
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("❌ Mailer error:", error);
  } else {
    console.log("✅ Mailer is ready");
  }
});

export default transporter;