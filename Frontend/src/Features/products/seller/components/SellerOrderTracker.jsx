import React, { useState } from "react";
import { 
  CheckCircle2, ChevronDown, ChevronUp, 
  Clock, Package, Truck, Home, MapPin 
} from "lucide-react";

const orderStatuses = ["confirmed", "processing", "shipped", "delivered"];

const statusConfig = {
  confirmed: { label: "Received", icon: Clock },
  processing: { label: "Production", icon: Package },
  shipped: { label: "Transit", icon: Truck },
  delivered: { label: "Completed", icon: Home },
};

const SellerOrderTracker = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentStep = orderStatuses.indexOf(order?.status);

  return (
    <div className="w-full border-t border-neutral-100">
      {/* HEADER TOGGLE BAR */}
      <div 
        className="flex items-center justify-between px-4 md:px-8 py-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-12">
            {/* Dots Progress */}
            <div className="flex items-center gap-3">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</span>
                <div className="flex gap-1.5">
                    {orderStatuses.map((s, i) => (
                        <div 
                            key={s} 
                            className={`w-5 md:w-8 h-1 rounded-full transition-all duration-700 ${
                                i <= currentStep ? 'bg-black' : 'bg-neutral-100'
                            }`} 
                        />
                    ))}
                </div>
            </div>
            
            {/* Tracking Quick Info - Responsive Visibility */}
            <div className="flex items-center gap-4 md:gap-6">
                {order?.trackingNumber && (
                    <div className="flex items-center gap-1.5">
                        <Package size={10} className="text-neutral-400" />
                        <span className="text-[9px] md:text-[10px] font-mono text-neutral-500">{order.trackingNumber}</span>
                    </div>
                )}
                {order?.courierPartner && (
                    <div className="flex items-center gap-1.5">
                        <Truck size={10} className="text-neutral-400" />
                        <span className="text-[9px] md:text-[10px] font-bold uppercase text-neutral-500">{order.courierPartner}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2 text-neutral-400 shrink-0">
            <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-widest">
                {isOpen ? 'Close' : 'Details'}
            </span>
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={14} />
            </div>
        </div>
      </div>

      {/* EXPANDED HISTORY */}
      {isOpen && (
        <div className="px-6 md:px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* Grid for Tablet/Desktop, Vertical List for Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
                
                {/* Horizontal Line for Desktop (Logic) */}
                <div className="hidden lg:block absolute top-4 left-4 right-4 h-[1px] bg-neutral-100 -z-10" />

                {orderStatuses.map((status, index) => {
                    const isDone = index <= currentStep;
                    const Config = statusConfig[status];
                    const historyItem = order.trackingHistory?.find(h => h.status === status);

                    return (
                        <div key={status} className={`relative flex flex-row lg:flex-col items-start gap-4 lg:gap-0 ${isDone ? 'opacity-100' : 'opacity-30'}`}>
                            
                            {/* Step Indicator / Line for Mobile */}
                            <div className="flex flex-col items-center lg:mb-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                    isDone ? 'bg-black text-white shadow-md scale-105' : 'bg-neutral-100 text-neutral-400'
                                }`}>
                                    <Config.icon size={12} />
                                </div>
                                {/* Vertical line for mobile flow */}
                                {index < orderStatuses.length - 1 && (
                                    <div className={`w-[1.5px] h-10 lg:hidden mt-2 ${isDone ? 'bg-black/20' : 'bg-neutral-100'}`} />
                                )}
                            </div>
                            
                            <div className="flex-1 lg:mt-0">
                                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">{Config.label}</p>
                                
                                {historyItem ? (
                                    <div className="space-y-0.5 md:space-y-1">
                                        <p className="text-[9px] md:text-[10px] text-neutral-500 leading-none">
                                            {new Date(historyItem.updatedAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                        {historyItem.note && (
                                            <p className="text-[9px] md:text-[10px] italic text-neutral-400 line-clamp-2 mt-1">"{historyItem.note}"</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-[9px] md:text-[10px] text-neutral-300 italic">Expected...</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrderTracker;