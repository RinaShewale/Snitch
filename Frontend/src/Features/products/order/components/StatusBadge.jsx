import React from 'react';

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-[#ded7d0] text-[#1a1714]",
        confirmed: "bg-[#1a1714] text-[#f5f1ec]",
        processing: "border border-[#1a1714] text-[#1a1714]",
        shipped: "bg-[#e2e8f0] text-[#1a1714]",
        delivered: "bg-[#2d3a2d] text-[#f5f1ec]",
        cancelled: "bg-red-50 text-red-900 border border-red-100",
    };

    return (
        <span className={`px-4 py-1 text-[9px] uppercase tracking-[0.2em] font-bold inline-block ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
};

export default StatusBadge;