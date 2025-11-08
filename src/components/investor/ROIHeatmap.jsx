import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export function ROIHeatmap({ investments, dark }) {
  // Calculate ROI for each investment
  const investmentsWithROI = investments.map(inv => {
    const roi = inv.invested > 0 
      ? ((inv.currentValue - inv.invested) / inv.invested) * 100 
      : 0;
    return { ...inv, roi };
  });

  // Sort by ROI
  const sorted = [...investmentsWithROI].sort((a, b) => b.roi - a.roi);

  // Get color based on ROI
  const getROIColor = (roi) => {
    if (roi >= 20) return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (roi >= 10) return "bg-gradient-to-r from-green-400 to-green-500";
    if (roi >= 5) return "bg-gradient-to-r from-blue-400 to-blue-500";
    if (roi >= 0) return "bg-gradient-to-r from-slate-400 to-slate-500";
    if (roi >= -5) return "bg-gradient-to-r from-orange-400 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-red-600";
  };

  const getTextColor = (roi) => {
    if (roi >= 0) return "text-green-600 dark:text-green-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className={dark ? "bg-slate-800 border-slate-700" : "bg-white"}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${dark ? "text-white" : ""}`}>
          <TrendingUp className="h-5 w-5 text-blue-500" />
          ROI Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No investments to display
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((inv, idx) => (
              <div
                key={inv.id}
                className={`p-3 rounded-lg border ${
                  dark ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm">{inv.title}</div>
                    <div className="text-xs text-slate-500">{inv.type}</div>
                  </div>
                  <div className={`flex items-center gap-1 font-bold ${getTextColor(inv.roi)}`}>
                    {inv.roi >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {inv.roi.toFixed(2)}%
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
                  <div
                    className={`h-full ${getROIColor(inv.roi)} transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.abs(inv.roi) * 5)}%` }}
                  />
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>Invested: ₵{inv.invested.toLocaleString()}</span>
                  <span>Current: ₵{inv.currentValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
