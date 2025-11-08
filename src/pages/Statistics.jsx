import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, Users, Building2, BarChart3, PieChart, DollarSign,
  MapPin, Award, Zap, Activity, Target, ArrowUpRight
} from "lucide-react";

/*
  Statistics.jsx

  - Original implementation inspired by the reference (simplecrowdfunding.co.uk/statistics).
  - Sections included:
    1) Hero with background image and short intro
    2) Top-line KPI cards (Total raised, Investors, Projects, Avg return)
    3) Charts:
       - Bar chart: Funds raised per quarter
       - Line chart: Cumulative funds raised over time
       - Donut chart: Investor type breakdown
    4) Tables:
       - Top projects by amount raised
       - Regional distribution of funds
    5) Notes & CTA
    6) Floating AIChatToggle included at the end
  - No external chart libraries required — uses small inline SVGs for charts.
  - Replace static sample data with your backend/API when available.
*/

const sampleKPIs = {
  totalRaised: 12400000,
  totalInvestors: 3200,
  totalProjects: 48,
  averageReturn: 12.4,
};

const fundsByQuarter = [
  { label: "Q1 2024", value: 800000 },
  { label: "Q2 2024", value: 1500000 },
  { label: "Q3 2024", value: 2400000 },
  { label: "Q4 2024", value: 3000000 },
  { label: "Q1 2025", value: 3500000 },
];

const investorBreakdown = [
  { label: "Retail", value: 78, color: "#0ea5e9" },
  { label: "Accredited", value: 15, color: "#6366f1" },
  { label: "Institutional", value: 7, color: "#f59e0b" },
];

const topProjects = [
  { id: "p1", title: "Ridgeview Residences", raised: 2000000, status: "Funding" },
  { id: "p2", title: "Seaside Apartments", raised: 1500000, status: "Funded" },
  { id: "p3", title: "Central Plaza", raised: 1200000, status: "Funding" },
  { id: "p4", title: "Green Estates", raised: 900000, status: "Completed" },
];

const regionalDistribution = [
  { region: "Greater Accra", amount: 7000000 },
  { region: "Ashanti", amount: 2500000 },
  { region: "Western", amount: 1200000 },
  { region: "Eastern", amount: 1700000 },
];

// Utilities
const formatCurrency = (n) =>
  `₵${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const formatNumber = (n) => Number(n).toLocaleString();

// Simple horizontal bar chart component (SVG)
function HorizontalBarChart({ items, height = 36, labelWidth = 110 }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const width = 680;
  return (
    <svg viewBox={`0 0 ${width} ${height * items.length}`} className="w-full">
      {items.map((it, idx) => {
        const barWidth = ((width - labelWidth - 40) * it.value) / max;
        const y = idx * height + 18;
        return (
          <g key={it.label} transform={`translate(0, ${y - 10})`}>
            <text x="8" y="12" fontSize="11" fill="#0f172a">
              {it.label}
            </text>
            <rect
              x={labelWidth}
              y="0"
              width={Math.max(barWidth, 2)}
              height="12"
              rx="6"
              fill={it.color || "#60a5fa"}
            />
            <text
              x={labelWidth + Math.max(barWidth, 2) + 8}
              y="10"
              fontSize="11"
              fill="#0f172a"
            >
              {formatCurrency(it.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Simple cumulative line chart
function CumulativeLineChart({ data, width = 680, height = 200 }) {
  // data: [{label,value}]
  const values = data.map((d) => d.value);
  const cumulative = values.reduce((acc, v) => {
    const prev = acc.length ? acc[acc.length - 1] : 0;
    acc.push(prev + v);
    return acc;
  }, []);
  const maxY = Math.max(...cumulative) * 1.05 || 1;

  const scaleX = (i) => (i / (data.length - 1 || 1)) * (width - 120) + 60;
  const scaleY = (v) => height - ((v / maxY) * (height - 40)) - 20;

  const polyPoints = cumulative.map((v, i) => `${scaleX(i)} ${scaleY(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* axes */}
      <line x1="60" y1={height - 20} x2={width - 20} y2={height - 20} stroke="#e6e7eb" />
      <line x1="60" y1="10" x2="60" y2={height - 20} stroke="#e6e7eb" />

      {/* polyline */}
      <polyline
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="3"
        points={polyPoints}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* points */}
      {cumulative.map((v, i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY(v)} r="3.5" fill="#0ea5e9" />
      ))}

      {/* labels under x-axis */}
      {data.map((d, i) => (
        <text key={i} x={scaleX(i)} y={height - 2} fontSize="11" fill="#475569" textAnchor="middle">
          {d.label}
        </text>
      ))}

      {/* right-side value label */}
      <text x={width - 16} y={scaleY(cumulative[cumulative.length - 1])} fontSize="11" fill="#0f172a" textAnchor="end">
        {formatCurrency(cumulative[cumulative.length - 1])}
      </text>
    </svg>
  );
}

// Donut chart using stroke-dasharray on a circle
function DonutChart({ data, size = 160, thickness = 18 }) {
  const total = data.reduce((s, i) => s + i.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {data.map((d, i) => {
          const portion = d.value / total;
          const dash = portion * circumference;
          const strokeDasharray = `${dash} ${circumference - dash}`;
          const rot = (offset / circumference) * 360;
          offset += dash;
          return (
            <circle
              key={d.label}
              r={radius}
              cx="0"
              cy="0"
              fill="transparent"
              stroke={d.color || "#60a5fa"}
              strokeWidth={thickness}
              strokeDasharray={strokeDasharray}
              strokeLinecap="butt"
              transform={`rotate(${-90 + rot})`}
            />
          );
        })}
        <circle r={radius - thickness - 2} fill="#fff" />
        <text x="0" y="4" fontSize="12" textAnchor="middle" fill="#0f172a" className="font-semibold">Investors</text>
      </g>
    </svg>
  );
}

export default function Statistics() {
  const [quarterRange] = useState(fundsByQuarter);
  const barItems = quarterRange.map((q) => ({ label: q.label, value: q.value, color: "#60a5fa" }));

  // cumulative data for line chart uses same quarters
  const cumulativeData = quarterRange.map((q) => ({ label: q.label, value: q.value }));

  const topTotal = topProjects.reduce((s, p) => s + p.raised, 0);

  return (
    <MainLayout>
      {/* HERO - Premium Fintech Design */}
      <section className="relative isolate overflow-hidden min-h-[75vh] flex items-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
          {/* Animated orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Tech grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
        </div>

        {/* Floating data points */}
        <div className="absolute inset-0 overflow-hidden -z-5">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-32 left-16 w-20 h-20 border-2 border-yellow-400/30 rounded-lg"
          />
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            className="absolute bottom-40 right-24 w-16 h-16 border-2 border-indigo-400/30 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            className="absolute top-1/3 right-1/3 w-12 h-12 border-2 border-purple-400/30"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-5 py-2 mb-6 font-bold shadow-2xl shadow-yellow-500/50 text-sm">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Platform Statistics & Insights
              </Badge>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200">
                Real-Time Platform Analytics
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto leading-relaxed"
            >
              A comprehensive snapshot of funds raised, investor engagement, and project performance across the CrowdBricks ecosystem.
            </motion.p>

            {/* Quick stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-indigo-200"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="font-semibold">Live Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">Real-Time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">Verified Metrics</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* KPI Cards - Modernized */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
              <Activity className="w-4 h-4 inline mr-2" />
              Key Performance Indicators
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Platform Overview</h2>
            <p className="text-xl text-slate-600">Real-time metrics that matter</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { 
                icon: DollarSign, 
                label: "Total Raised", 
                value: formatCurrency(sampleKPIs.totalRaised), 
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-50 to-emerald-50" 
              },
              { 
                icon: Users, 
                label: "Active Investors", 
                value: formatNumber(sampleKPIs.totalInvestors), 
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50" 
              },
              { 
                icon: Building2, 
                label: "Projects Listed", 
                value: sampleKPIs.totalProjects, 
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-50 to-pink-50" 
              },
              { 
                icon: TrendingUp, 
                label: "Avg. Return (p.a.)", 
                value: `${sampleKPIs.averageReturn}%`, 
                gradient: "from-yellow-500 to-amber-500",
                bgGradient: "from-yellow-50 to-amber-50" 
              },
            ].map((kpi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 bg-gradient-to-br ${kpi.bgGradient} h-full`}>
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <kpi.icon className="w-7 h-7 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">{kpi.label}</div>
                    <div className="text-3xl font-black text-slate-900">{kpi.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section - Modernized */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics Dashboard
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Performance Metrics</h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-blue-100 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Quarterly Growth</h3>
                      <p className="text-sm text-slate-600">Funds raised by quarter</p>
                    </div>
                  </div>
                  <HorizontalBarChart items={barItems} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="h-full shadow-2xl border-2 border-purple-100 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Cumulative Performance</h3>
                      <p className="text-sm text-slate-600">Total funds raised over time</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <CumulativeLineChart data={cumulativeData} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-yellow-100 hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Investor Distribution</h3>
                      <p className="text-sm text-slate-600">Type breakdown</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-48 shrink-0">
                      <DonutChart data={investorBreakdown} />
                    </div>
                    <div className="space-y-3 flex-1">
                      {investorBreakdown.map((b, idx) => (
                        <div key={b.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div style={{ width: 16, height: 16, background: b.color }} className="rounded-lg shadow-md" />
                            <div>
                              <div className="text-sm font-bold text-slate-900">{b.label}</div>
                              <div className="text-xs text-slate-500">{b.value}% of investors</div>
                            </div>
                          </div>
                          <Award className="w-5 h-5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-green-100 hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Top Projects</h3>
                      <p className="text-sm text-slate-600">By amount raised</p>
                    </div>
                  </div>
                  <div className="overflow-auto rounded-xl border-2 border-slate-100">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-900 to-slate-800">
                        <tr>
                          <th className="py-4 px-4 text-left text-white font-bold text-sm">Project</th>
                          <th className="py-4 px-4 text-left text-white font-bold text-sm">Amount</th>
                          <th className="py-4 px-4 text-left text-white font-bold text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {topProjects.map((p, idx) => (
                          <tr key={p.id} className={`border-b hover:bg-green-50 transition-colors ${idx % 2 === 0 ? 'bg-slate-50' : ''}`}>
                            <td className="py-4 px-4 font-semibold text-slate-900">{p.title}</td>
                            <td className="py-4 px-4 font-bold text-green-700">{formatCurrency(p.raised)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                p.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                p.status === 'Funded' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gradient-to-r from-green-100 to-emerald-100">
                          <td className="py-4 px-4 font-black text-slate-900">Top 4 Total</td>
                          <td className="py-4 px-4 font-black text-green-700 text-lg">{formatCurrency(topTotal)}</td>
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Regional Distribution & Notes - Modernized */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
              <MapPin className="w-4 h-4 inline mr-2" />
              Geographic Insights
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Regional Analysis</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-indigo-100 hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Regional Distribution</h3>
                      <p className="text-sm text-slate-600">Investment allocation by region</p>
                    </div>
                  </div>
                  <div className="overflow-auto rounded-xl border-2 border-slate-100">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-900 to-slate-800">
                        <tr>
                          <th className="py-4 px-4 text-left text-white font-bold">Region</th>
                          <th className="py-4 px-4 text-left text-white font-bold">Amount</th>
                          <th className="py-4 px-4 text-left text-white font-bold">Share</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {regionalDistribution.map((r, idx) => {
                          const share = (r.amount / sampleKPIs.totalRaised) * 100;
                          return (
                            <tr key={r.region} className={`border-b hover:bg-indigo-50 transition-colors ${idx % 2 === 0 ? 'bg-slate-50' : ''}`}>
                              <td className="py-4 px-4 font-semibold text-slate-900">{r.region}</td>
                              <td className="py-4 px-4 font-bold text-indigo-700">{formatCurrency(r.amount)}</td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style={{ width: `${share}%` }}></div>
                                  </div>
                                  <span className="font-bold text-slate-700 text-sm">{share.toFixed(1)}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-amber-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Notes & Methodology</h3>
                      <p className="text-sm text-slate-600">How we calculate these metrics</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border-2 border-slate-100">
                      <p className="text-slate-700 leading-relaxed">
                        The statistics shown are illustrative and based on sample data. When connected to your backend, these charts
                        should load live platform metrics. Metrics include pledged sums (gross), registered investors and project counts.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: Activity, text: "Data refreshed daily from platform reporting" },
                        { icon: MapPin, text: "Regional allocation based on project location" },
                        { icon: Users, text: "Investor classification determined at onboarding (retail / accredited / institutional)" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-yellow-400 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shrink-0">
                            <item.icon className="w-4 h-4 text-slate-900" />
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t-2 border-slate-200">
                      <a href="/contact">
                        <Button className="w-full group bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold py-6 text-lg shadow-xl hover:scale-105 transition-all duration-300">
                          Request Full Dataset
                          <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <AIChatToggle />
    </MainLayout>
  );
}