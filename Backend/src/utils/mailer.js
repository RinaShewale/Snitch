import Brevo from "@getbrevo/brevo";
import { config } from "../config/config.js";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  config.BREVO_API_KEY
);

console.log("✅ Brevo API mailer is ready");

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
}) => {
  try {
    const email = new Brevo.SendSmtpEmail();

    email.sender = {
      name: config.SENDER_NAME || "Snitch",
      email: config.SENDER_EMAIL,
    };

    email.to = [{ email: to }];
    email.subject = subject;
    email.htmlContent = htmlContent;

    const response = await apiInstance.sendTransacEmail(email);

    console.log("✅ Email sent:", response);
    return response;
  } catch (error) {
    console.error(
      "❌ Brevo API Error:",
      error.response?.body || error.message
    );
    throw error;
  }
};

export default sendEmail;