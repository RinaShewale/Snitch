import React from "react";
import { MapPin, CreditCard, Truck } from "lucide-react";

const ShippingPaymentInfo = ({ order }) => {
    const address = order?.shippingAddress || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-t border-[#1a1714]/10">
            <div className="space-y-6">
                <div className="flex items-center gap-3 opacity-40">
                    <MapPin size={14} />
                    <h4 className="text-[10px] uppercase tracking-[0.4em]">Destination</h4>
                </div>
                <div className="text-sm font-light leading-relaxed">
                    <p className="font-medium mb-2 text-base">{address.fullName || "Valued Client"}</p>
                    <p className="opacity-70">{address.addressLine1}</p>
                    <p className="opacity-70">{address.city}, {address.state} {address.postalCode}</p>
                    <p className="opacity-70 uppercase mt-2 tracking-widest text-[10px]">{address.country || "India"}</p>
                </div>
            </div>

            <div className="space-y-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 opacity-40">
                        <CreditCard size={14} />
                        <h4 className="text-[10px] uppercase tracking-[0.4em]">Payment</h4>
                    </div>
                    <p className="text-sm font-light uppercase tracking-widest text-[10px]">
                        Method: <span className="opacity-100 font-medium ml-2">Online Transaction</span>
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 opacity-40">
                        <Truck size={14} />
                        <h4 className="text-[10px] uppercase tracking-[0.4em]">Logistics</h4>
                    </div>
                    <div className="text-[11px] font-light space-y-2 uppercase tracking-tighter">
                        <p className="opacity-60">Courier: <span className="text-[#1a1714] font-medium ml-2">{order?.courierPartner || "Awaiting Assignment"}</span></p>
                        <p className="opacity-60">Tracking: <span className="text-[#1a1714] font-mono ml-2 select-all">{order?.trackingNumber || "N/A"}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPaymentInfo;