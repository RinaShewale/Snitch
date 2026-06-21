import { Resend } from "resend";
import { config } from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

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

  const themeColor =
    statusColors[status?.toLowerCase()] || "#6366f1";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      .container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9fafb;
      }
      .card {
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,.1);
        border: 1px solid #e5e7eb;
      }
      .header {
        background-color: ${themeColor};
        padding: 30px 20px;
        text-align: center;
        color: white;
      }
      .content {
        padding: 30px;
      }
      .status-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 50px;
        background-color: #f3f4f6;
        color: ${themeColor};
        font-weight: bold;
        font-size: 14px;
        text-transform: uppercase;
        margin-bottom: 20px;
      }
      .order-info {
        background-color: #f8fafc;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        border: 1px solid #edf2f7;
      }
      .info-label {
        color: #64748b;
        font-weight: 500;
      }
      .info-value {
        color: #1e293b;
        font-weight: 600;
        text-align: right;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: ${themeColor};
        color: white !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #94a3b8;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <h1 style="margin:0">Order Update</h1>
          <p style="margin:5px 0 0">
            Order #${orderId}
          </p>
        </div>

        <div class="content">
          <div class="status-badge">${status}</div>

          <p>Hi <b>${name}</b>,</p>

          <p>
            Your order status has been updated.
            Here are the latest details.
          </p>

          <div class="order-info">
            <table width="100%">
              <tr>
                <td class="info-label">Courier Partner</td>
                <td class="info-value">
                  ${courierPartner || "Assigning Soon"}
                </td>
              </tr>

              <tr>
                <td class="info-label">Tracking ID</td>
                <td class="info-value">
                  ${trackingNumber || "Not Available"}
                </td>
              </tr>

              <tr>
                <td class="info-label">Estimated Delivery</td>
                <td class="info-value">
                  ${
                    estimatedDeliveryDate
                      ? new Date(
                          estimatedDeliveryDate
                        ).toDateString()
                      : "TBD"
                  }
                </td>
              </tr>
            </table>
          </div>

          ${
            trackingNumber
              ? `
              <div style="text-align:center">
                <p style="font-size:12px;color:#64748b">
                  Tracking Number:
                  <b>${trackingNumber}</b>
                </p>
              </div>
            `
              : `
              <p style="text-align:center;color:#64748b">
                We'll notify you once a tracking number is generated.
              </p>
            `
          }

          <hr>

          <p
            style="
              font-size:13px;
              color:#64748b;
              text-align:center;
            "
          >
            Thank you for shopping with us!
          </p>
        </div>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Your Shop Name.
        All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

export const sendOrderStatusEmail = async (data) => {
  try {
    const info = await resend.emails.send({
      from: "Shop <onboarding@resend.dev>",
      to: data.email,
      subject: `Update for Order #${data.orderId}: ${data.status}`,
      html: template(data),
    });

    console.log("📧 Order email sent:", info);

    return info;
  } catch (error) {
    console.error("❌ Failed to send order email:", error);
    throw error;
  }
};