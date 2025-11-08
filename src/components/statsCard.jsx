import React from "react";

/**
 * StatsCard
 * small reusable statistic card with label and animated number
 */
export default function StatsCard({ label, value, foot, icon, dark }) {
  return (
    <div className={`p-4 rounded-xl shadow-soft-lg ${dark ? "bg-slate-800 text-slate-100" : "bg-white"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-sm ${dark ? "text-slate-300" : "text-slate-500"}`}>{label}</div>
          <div className="text-2xl font-bold mt-1">{typeof value === "number" ? `₵${value.toLocaleString()}` : value}</div>
        </div>
        <div className="text-blue-400">{icon}</div>
      </div>
      {foot && <div className={`text-xs mt-2 ${dark ? "text-slate-400" : "text-slate-500"}`}>{foot}</div>}
    </div>
  );
}