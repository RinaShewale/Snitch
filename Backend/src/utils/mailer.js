import { Resend } from "resend";
import { config } from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // change after domain verification
      to,
      subject,
      html,
      text,
    });

    console.log("✅ Email sent:", data);

    return data;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};

export default resend;