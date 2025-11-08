import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function RiskReturnQuadrant({ investments, dark }) {
  // Calculate risk and return for each investment
  const data = investments.map(inv => {
    const returns = inv.invested > 0 
      ? ((inv.currentValue - inv.invested) / inv.invested) * 100 
      : 0;
    
    // Simple risk calculation based on investment size and progress
    const risk = inv.progress < 50 ? 70 : inv.progress < 80 ? 40 : 20;
    
    return {
      name: inv.title,
      risk: risk,
      returns: returns,
      size: inv.invested / 1000, // Bubble size based on investment amount
      color: returns >= 0 ? "#10b981" : "#ef4444"
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
        }`}>
          <div className="font-medium">{data.name}</div>
          <div className="text-sm mt-1">
            <div>Risk: {data.risk.toFixed(0)}%</div>
            <div>Returns: {data.returns.toFixed(2)}%</div>
            <div>Investment: ₵{(data.size * 1000).toLocaleString()}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={dark ? "bg-slate-800 border-slate-700" : "bg-white"}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${dark ? "text-white" : ""}`}>
          <Target className="h-5 w-5 text-purple-500" />
          Risk vs Returns Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No investments to analyze
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis 
                  type="number" 
                  dataKey="risk" 
                  name="Risk" 
                  unit="%" 
                  stroke={dark ? "#94a3b8" : "#64748b"}
                  label={{ value: 'Risk Level', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="returns" 
                  name="Returns" 
                  unit="%" 
                  stroke={dark ? "#94a3b8" : "#64748b"}
                  label={{ value: 'Returns', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="size" range={[100, 1000]} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={data} fill="#8884d8">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={dark ? "text-slate-300" : "text-slate-600"}>Positive Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className={dark ? "text-slate-300" : "text-slate-600"}>Negative Returns</span>
          </div>
        </div>
        
        <div className={`mt-3 text-xs text-center ${dark ? "text-slate-400" : "text-slate-500"}`}>
          Bubble size represents investment amount
        </div>
      </CardContent>
    </Card>
  );
}
