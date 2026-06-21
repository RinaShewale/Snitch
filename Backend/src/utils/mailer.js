import nodemailer from "nodemailer";
import dns from "dns";
import { config } from "../config/config.js";

// ⭐ FORCE IPV4 (fixes ENETUNREACH on Render)
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // ⭐ safer for cloud servers
  secure: false, // TLS (NOT SSL)
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS, // Gmail App Password only
  },
});

// Optional debug (safe to keep in dev)
transporter.verify((error) => {
  if (error) {
    console.log("❌ Mailer error:", error.message);
  } else {
    console.log("✅ Mailer is ready");
  }
});

export default transporter;