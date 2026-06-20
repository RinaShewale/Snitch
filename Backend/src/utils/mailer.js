import * as brevo from "@getbrevo/brevo";
import { config } from "../config/config.js";

// correct way (IMPORTANT)
const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  config.BREVO_API_KEY
);

console.log("✅ Brevo API mailer ready");

// ================= SEND EMAIL =================
export const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const email = new brevo.SendSmtpEmail();

    email.sender = {
      name: config.SENDER_NAME || "Snitch",
      email: config.SENDER_EMAIL,
    };

    email.to = [{ email: to }];
    email.subject = subject;
    email.htmlContent = htmlContent;

    const response = await apiInstance.sendTransacEmail(email);

    console.log("📧 Email sent successfully");
    return response;
  } catch (error) {
    console.error("❌ Brevo Error:", error.body || error.message);
    throw error;
  }
};

export default sendEmail;