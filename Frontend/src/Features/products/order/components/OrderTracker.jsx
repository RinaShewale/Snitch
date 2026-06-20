import React from "react";
import { Check } from "lucide-react";

const OrderTracker = ({ status = "confirmed" }) => {
    const steps = ["confirmed", "processing", "shipped", "delivered"];
    const currentIndex = Math.max(0, steps.indexOf(status));

    return (
        <div className="w-full py-8">
            {/* Desktop Horizontal View */}
            <div className="hidden md:flex justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#1a1714]/10 -translate-y-1/2" />
                <div 
                    className="absolute top-1/2 left-0 h-[1px] bg-[#1a1714] -translate-y-1/2 transition-all duration-1000 ease-in-out"
                    style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                />
                
                {steps.map((step, idx) => {
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full border transition-colors duration-500 ${isDone ? "bg-[#1a1714] border-[#1a1714]" : "bg-[#f5f1ec] border-[#1a1714]/20"}`} />
                            <span className={`mt-4 text-[9px] uppercase tracking-[0.2em] font-medium transition-opacity duration-500 ${isDone ? "opacity-100" : "opacity-20"}`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Vertical View */}
            <div className="flex md:hidden flex-col gap-8 relative">
                <div className="absolute left-[5.5px] top-0 h-full w-[1px] bg-[#1a1714]/10" />
                <div 
                    className="absolute left-[5.5px] top-0 w-[1px] bg-[#1a1714] transition-all duration-1000"
                    style={{ height: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                    const isDone = idx <= currentIndex;
                    return (
                        <div key={step} className="flex items-center gap-6 relative z-10">
                            <div className={`w-3 h-3 rounded-full border ${isDone ? "bg-[#1a1714] border-[#1a1714]" : "bg-[#f5f1ec] border-[#1a1714]/20"}`} />
                            <span className={`text-[10px] uppercase tracking-widest ${isDone ? "opacity-100 font-bold" : "opacity-30"}`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTracker;