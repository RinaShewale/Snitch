import nodemailer from "nodemailer";

// Updated to use Brevo SMTP settings with port 2525 to bypass firewall timeout blocks
const transporter = nodemailer.createTransport({
  host: "://brevo.com",
  port: 2525, // Port 2525 explicitly bypasses cloud provider network blocks
  secure: false, // Must be false for port 2525
  auth: {
    user: process.env.BREVO_EMAIL, // Your verified Brevo sender email
    pass: process.env.BREVO_SMTP_KEY, // Your Master SMTP key (starts with xsmtpsib-)
  },
  tls: {
    rejectUnauthorized: false, // Prevents timeouts caused by local/network SSL handshake lags
  },
});

const template = ({
  name,
  orderId,
  status,
  trackingNumber,
  courierPartner,
  estimatedDeliveryDate,
}) => {
  // Define a color based on status
  const statusColors = {
    shipped: "#3b82f6",
    delivered: "#10b981",
    processing: "#f59e0b",
    cancelled: "#ef4444",
  };
  const themeColor = statusColors[status.toLowerCase()] || "#6366f1";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
      .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
      .header { background-color: ${themeColor}; padding: 30px 20px; text-align: center; color: white; }
      .content { padding: 30px; }
      .status-badge { display: inline-block; padding: 6px 12px; border-radius: 50px; background-color: #f3f4f6; color: ${themeColor}; font-weight: bold; font-size: 14px; text-transform: uppercase; margin-bottom: 20px; }
      .order-info { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #edf2f7; }
      .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
      .info-label { color: #64748b; font-weight: 500; }
      .info-value { color: #1e293b; font-weight: 600; text-align: right; }
      .button { display: inline-block; padding: 12px 24px; background-color: ${themeColor}; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; }
      hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <h1 style="margin:0; font-size: 24px;">Order Update</h1>
          <p style="margin:5px 0 0; opacity: 0.9;">Order #${orderId}</p>
        </div>
        
        <div class="content">
          <div class="status-badge">${status}</div>
          <p style="font-size: 18px; margin-top: 0;">Hi <b>${name}</b>,</p>
          <p>Great news! Your order status has been updated. Here are the latest details regarding your delivery.</p>
          
          <div class="order-info">
            <table width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td class="info-label" style="padding: 5px 0;">Courier Partner</td>
                <td class="info-value" style="padding: 5px 0;">${courierPartner || "Assigning Soon"}</td>
              </tr>
              <tr>
                <td class="info-label" style="padding: 5px 0;">Tracking ID</td>
                <td class="info-value" style="padding: 5px 0;">${trackingNumber || "Not Available"}</td>
              </tr>
              <tr>
                <td class="info-label" style="padding: 5px 0;">Est. Delivery</td>
                <td class="info-value" style="padding: 5px 0;">${
                  estimatedDeliveryDate
                    ? new Date(estimatedDeliveryDate).toDateString()
                    : "TBD"
                }</td>
              </tr>
            </table>
          </div>

          ${
            trackingNumber
              ? `<div style="text-align: center;">
                  <a href="#" class="button">Track Your Package</a>
                  <p style="font-size: 12px; color: #64748b; margin-top: 15px;">If the button doesn't work, use tracking number <b>${trackingNumber}</b> on the courier's website.</p>
                 </div>`
              : `<p style="text-align: center; color: #64748b; font-style: italic;">We'll notify you as soon as your tracking number is generated.</p>`
          }
          
          <hr />
          
          <p style="font-size: 13px; color: #64748b; text-align: center;">
            Thank you for shopping with us!<br/>
            If you have any questions, reply to this email.
          </p>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Your Shop Name. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

export const sendOrderStatusEmail = async (data) => {
  try {
    await transporter.sendMail({
      from: `"Shop" <${process.env.BREVO_EMAIL}>`, // Must match your verified Brevo sender email
      to: data.email,
      subject: `Update for Order #${data.orderId}: ${data.status}`,
      html: template(data),
    });
    console.log("✅ Email sent successfully.");
  } catch (error) {
    console.error("❌ Nodemailer send error:", error.message);
    throw error;
  }
};
