import * as Brevo from "@getbrevo/brevo";
import { config } from "../config/config.js";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  config.BREVO_API_KEY
);

// ================= HTML TEMPLATE =================
const template = ({
  name,
  orderId,
  status,
  trackingNumber,
  courierPartner,
  estimatedDeliveryDate,
}) => {
  const statusColors = {
    shipped: "#3b82f6",
    delivered: "#10b981",
    processing: "#f59e0b",
    cancelled: "#ef4444",
  };

  const themeColor = statusColors[status?.toLowerCase()] || "#6366f1";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      .container { font-family: Arial; max-width: 600px; margin: auto; padding: 20px; background:#f9fafb; }
      .card { background:#fff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb; }
      .header { background:${themeColor}; padding:20px; text-align:center; color:#fff; }
      .content { padding:20px; }
      .status-badge { display:inline-block; padding:6px 12px; border-radius:20px; background:#f3f4f6; color:${themeColor}; font-weight:bold; }
      .order-info { background:#f8fafc; padding:15px; border-radius:8px; margin:15px 0; }
      .footer { text-align:center; font-size:12px; color:#94a3b8; margin-top:20px; }
      .button { background:${themeColor}; color:#fff; padding:10px 15px; text-decoration:none; border-radius:6px; display:inline-block; margin-top:10px; }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <h2>Order Update</h2>
          <p>Order #${orderId}</p>
        </div>

        <div class="content">
          <p>Hi <b>${name}</b>,</p>

          <div class="status-badge">${status}</div>

          <div class="order-info">
            <p><b>Courier:</b> ${courierPartner || "Assigning Soon"}</p>
            <p><b>Tracking:</b> ${trackingNumber || "Not Available"}</p>
            <p><b>Delivery:</b> ${
              estimatedDeliveryDate
                ? new Date(estimatedDeliveryDate).toDateString()
                : "TBD"
            }</p>
          </div>

          ${
            trackingNumber
              ? `<a class="button" href="#">Track Package</a>`
              : `<p>Tracking will be available soon.</p>`
          }

          <hr/>
          <p style="font-size:12px;">If you have questions, reply to this email.</p>
        </div>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Your Shop Name
      </div>
    </div>
  </body>
  </html>
  `;
};

// ================= SEND EMAIL =================
export const sendOrderStatusEmail = async (data) => {
  try {
    const email = new Brevo.SendSmtpEmail();

    email.sender = {
      name: config.SENDER_NAME || "Shop",
      email: config.SENDER_EMAIL,
    };

    email.to = [{ email: data.email }];

    email.subject = `Update for Order #${data.orderId}: ${data.status}`;

    email.htmlContent = template(data);

    const response = await apiInstance.sendTransacEmail(email);

    console.log("✅ Order email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Order mail error:", error.response?.body || error.message);
    throw error;
  }
};