import React, { useMemo, useState } from "react";
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
    <div className="w-full">
      {/* Visual Progress Bar */}
      <div 
        className="flex items-center justify-between px-8 py-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex items-center gap-12">
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status Flow</span>
                <div className="flex gap-2">
                    {orderStatuses.map((s, i) => (
                        <div 
                            key={s} 
                            className={`w-8 h-1 rounded-full transition-all duration-700 ${
                                i <= currentStep ? 'bg-black' : 'bg-neutral-100'
                            }`} 
                        />
                    ))}
                </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
                {order?.trackingNumber && (
                    <div className="flex items-center gap-2">
                        <Package size={12} className="text-neutral-400" />
                        <span className="text-[10px] font-mono text-neutral-500">{order.trackingNumber}</span>
                    </div>
                )}
                {order?.courierPartner && (
                    <div className="flex items-center gap-2">
                        <Truck size={12} className="text-neutral-400" />
                        <span className="text-[10px] font-bold uppercase text-neutral-500">{order.courierPartner}</span>
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-400">
            <span className="text-[9px] font-bold uppercase tracking-widest">{isOpen ? 'Hide History' : 'View History'}</span>
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {/* Expanded History */}
      {isOpen && (
        <div className="px-8 pb-8 pt-4 grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-2 duration-500">
            {orderStatuses.map((status, index) => {
                const isDone = index <= currentStep;
                const isCurrent = index === currentStep;
                const Config = statusConfig[status];
                const historyItem = order.trackingHistory?.find(h => h.status === status);

                return (
                    <div key={status} className={`relative flex flex-col ${isDone ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isDone ? 'bg-black text-white shadow-md scale-110' : 'bg-neutral-100 text-neutral-400'
                            }`}>
                                <Config.icon size={14} />
                            </div>
                            <div className="h-[1px] flex-1 bg-neutral-100" />
                        </div>
                        
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{Config.label}</p>
                        
                        {historyItem ? (
                            <div className="space-y-1">
                                <p className="text-[10px] text-neutral-500">
                                    {new Date(historyItem.updatedAt).toLocaleDateString('en-IN', {
                                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                                {historyItem.note && (
                                    <p className="text-[10px] italic text-neutral-400 line-clamp-2">"{historyItem.note}"</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-[10px] text-neutral-300 italic">Pending...</p>
                        )}
                    </div>
                );
            })}
        </div>
      )}
    </div>
  );
};

export default SellerOrderTracker;