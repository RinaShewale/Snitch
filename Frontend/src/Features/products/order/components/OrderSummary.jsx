import React from "react";
import StatusBadge from "./StatusBadge";
import downloadInvoice from "../utils/downloadInvoice";

const OrderSummary = ({ order }) => {
  const subtotal = Math.max(
    (order?.totalAmount || 0) - 500,
    0
  );

  return (
    <div
      id="invoice"
      className="reveal bg-white p-8 md:p-12 border border-[#1a1714]/5 sticky top-24"
    >
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#1a1714]/10">
        <h2 className="text-3xl font-serif italic">
          Invoice
        </h2>

        <div className="mt-6 space-y-1 text-sm opacity-70">
          <p>
            Order ID:
            {" "}
            {order?._id}
          </p>

          <p>
            Date:
            {" "}
            {new Date(
              order?.createdAt
            ).toLocaleDateString()}
          </p>

          <p>
            Customer:
            {" "}
            {order?.shippingAddress
              ?.fullName ||
              order?.user?.fullName}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="mb-10">
        <h3 className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-6">
          Items
        </h3>

        <div className="space-y-4">
          {order?.items?.map(
            (item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm"
              >
                <div>
                  <p>
                    {
                      item.product
                        ?.title
                    }
                  </p>

                  <p className="text-xs opacity-50">
                    Qty:
                    {" "}
                    {
                      item.quantity
                    }
                  </p>
                </div>

                <p>
                  ₹
                  {(
                    item.price
                      ?.amount *
                    item.quantity
                  ).toLocaleString()}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Summary */}
      <h2 className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-10">
        Financial Summary
      </h2>

      <div className="space-y-5 pb-10 border-b border-[#1a1714]/5">
        <div className="flex justify-between text-sm font-light">
          <span className="opacity-60">
            Subtotal
          </span>

          <span>
            ₹
            {subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm font-light">
          <span className="opacity-60">
            Shipping
          </span>

          <span className="italic text-[10px] uppercase tracking-widest text-emerald-700">
            Complimentary
          </span>
        </div>

        <div className="flex justify-between text-sm font-light">
          <span className="opacity-60">
            Estimated Tax
          </span>

          <span>₹500</span>
        </div>
      </div>

      <div className="py-10">
        <div className="flex justify-between items-baseline">
          <span className="text-sm uppercase tracking-[0.2em]">
            Total Amount
          </span>

          <span className="text-4xl font-serif italic">
            ₹
            {(
              order?.totalAmount ||
              0
            ).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-6 pt-10 border-t border-[#1a1714]/5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-40">
            Order Status
          </span>

          <StatusBadge
            status={order?.status}
          />
        </div>

        <button
          onClick={downloadInvoice}
          className="w-full py-4 border border-[#1a1714] text-[10px] uppercase tracking-[0.3em] hover:bg-[#1a1714] hover:text-[#f5f1ec] transition-all duration-500"
        >
          Download Invoice (PDF)
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;