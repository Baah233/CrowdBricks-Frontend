import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Calculator, TrendingUp, DollarSign, Shield, 
  AlertCircle, CheckCircle2, BarChart3, PieChart, ArrowUpRight, Zap
} from "lucide-react";

/*
  TaxOverview.jsx

  - Original implementation inspired by reference (simplecrowdfunding.co.uk/tax-overview).
  - Sections included:
    1) Hero with full-bleed background image and short intro
    2) Quick summary cards (taxable items, typical rates)
    3) Interactive charts (SVG) showing tax impact on returns and net returns over time
    4) Tables: headline tax rates, withholding & reporting, worked examples
    5) Practical notes and CTA
    6) Floating AIChatToggle included at the end

  Notes:
  - This file is intentionally self-contained and uses simple SVG charts so there is
    no additional chart library dependency.
  - Replace image paths and adjust numeric examples to match your jurisdiction or backend data.
*/

const headlineRates = [
  { tax: "Personal Income Tax (Investor)", rate: "0% - 30%", note: "Progressive bands — applies to investor distributions where applicable" },
  { tax: "Corporate Tax (Developer)", rate: "25%", note: "Standard corporate tax rate (example)" },
  { tax: "Withholding Tax (Dividends / Interest)", rate: "8% - 15%", note: "Varies by instrument and residency" },
  { tax: "VAT / Service Tax", rate: "12.5%", note: "Applies to taxable fees and services in some cases" },
];

const withholdingGuidance = [
  { item: "Dividend distributions to local investors", rule: "Withholding may apply; platform reports distributions" },
  { item: "Interest-like returns (profit share)", rule: "May be treated as interest for withholding purposes" },
  { item: "Non-resident investors", rule: "Higher withholding — review double taxation treaties" },
  { item: "Platform fees charged to developers", rule: "VAT may be chargeable depending on service classification" },
];

// Simple sample projects for the worked example
const examples = [
  {
    id: "ex1",
    title: "Small residential refurbishment — 12 months",
    grossReturnPercent: 12, // gross % p.a. (or total for 12 months)
    investment: 100000,
    description: "Example shows tax on distributions for a 12 month project and a simplified withholding at 10%.",
    withholdingPct: 10,
  },
  {
    id: "ex2",
    title: "Medium build-to-rent — 36 months",
    grossReturnPercent: 36, // total over 3 years (for ease)
    investment: 250000,
    description: "Longer hold; demonstrate cumulative returns and tax impact (10% withholding assumed).",
    withholdingPct: 10,
  },
];

// Utility: compute after-tax amount given withholding and gross payout
function computeAfterTax(grossPct, investment, withholdingPct) {
  const grossPayout = (grossPct / 100) * investment;
  const withholding = (withholdingPct / 100) * grossPayout;
  const netPayout = grossPayout - withholding;
  const totalAfterTax = investment + netPayout;
  const effectiveTaxRate = grossPayout === 0 ? 0 : (withholding / grossPayout) * 100;
  return {
    grossPayout,
    withholding,
    netPayout,
    totalAfterTax,
    effectiveTaxRate,
  };
}

// Small reusable SVG bar chart (horizontal) for simple comparisons
function HorizontalBarChart({ items, width = 600, height = 40 }) {
  // items: [{label, value, color}]
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height * items.length}`} role="img" aria-label="Bar chart comparing values">
      {items.map((it, idx) => {
        const barWidth = (it.value / max) * (width - 140); // leave space for labels
        const y = idx * height + 8;
        return (
          <g key={it.label} transform={`translate(0, ${y})`}>
            <text x="0" y="12" fontSize="11" fill="#0f172a">{it.label}</text>
            <rect x="140" y="-8" width={barWidth} height="18" rx="4" fill={it.color || "#0ea5e9"} />
            <text x={140 + barWidth + 8} y="6" fontSize="11" fill="#0f172a">{it.value}%</text>
          </g>
        );
      })}
    </svg>
  );
}

// Line chart: net vs gross over years (simple polyline)
function NetVsGrossLineChart({ years = 5, grossAnnualRate = 0.08, withholdingPct = 10, width = 600, height = 220 }) {
  const pointsGross = [];
  const pointsNet = [];
  let investment = 100; // normalized 100
  for (let year = 1; year <= years; year++) {
    const gross = investment * Math.pow(1 + grossAnnualRate, year);
    // assume withholding applies to each year's distributed return portion, for simplification we apply to annual gain
    const totalGain = gross - investment;
    const withholding = (withholdingPct / 100) * totalGain;
    const net = investment + (totalGain - withholding);
    pointsGross.push(gross);
    pointsNet.push(net);
  }
  const maxY = Math.max(...pointsGross, ...pointsNet) * 1.05;

  const scaleX = (i) => (i / (years - 1)) * (width - 80) + 60;
  const scaleY = (v) => height - ((v / maxY) * (height - 40)) - 10;

  const polyline = (arr) => arr.map((v, i) => `${scaleX(i)} ${scaleY(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Net versus gross returns over time" className="w-full">
      {/* axes */}
      <line x1="60" y1={height - 10} x2={width - 10} y2={height - 10} stroke="#e6e7eb" />
      <line x1="60" y1="10" x2="60" y2={height - 10} stroke="#e6e7eb" />

      {/* gross polyline */}
      <polyline fill="none" stroke="#0ea5e9" strokeWidth="3" points={polyline(pointsGross)} strokeLinecap="round" strokeLinejoin="round" />
      {/* net polyline */}
      <polyline fill="none" stroke="#f59e0b" strokeWidth="3" points={polyline(pointsNet)} strokeLinecap="round" strokeLinejoin="round" />

      {/* year labels */}
      {Array.from({ length: years }).map((_, i) => (
        <text key={i} x={scaleX(i)} y={height - 0} fontSize="11" fill="#475569" textAnchor="middle">
          Year {i + 1}
        </text>
      ))}

      {/* legend */}
      <rect x={width - 180} y={14} width="12" height="8" fill="#0ea5e9" rx="2" />
      <text x={width - 160} y={20} fontSize="12" fill="#0f172a">Gross value</text>

      <rect x={width - 180} y={34} width="12" height="8" fill="#f59e0b" rx="2" />
      <text x={width - 160} y={40} fontSize="12" fill="#0f172a">Net after withholding</text>
    </svg>
  );
}

export default function TaxOverview() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [years, setYears] = useState(5);
  const example = useMemo(() => examples[exampleIndex], [exampleIndex]);

  const afterTax = computeAfterTax(example.grossReturnPercent, example.investment, example.withholdingPct);

  // For bar chart: effective tax rates for typical instruments
  const barItems = [
    { label: "Dividend withholding", value: 10, color: "#f59e0b" },
    { label: "Interest-like returns", value: 12, color: "#fb923c" },
    { label: "Capital gains (example)", value: 15, color: "#0ea5e9" },
    { label: "VAT on fees (where applicable)", value: 12.5, color: "#60a5fa" },
  ];

  return (
    <MainLayout>
      {/* HERO - Premium Fintech Design */}
      <section className="relative isolate overflow-hidden min-h-[75vh] flex items-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950">
          {/* Animated orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Tech grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden -z-5">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-32 left-16 w-20 h-20 border-2 border-emerald-400/30 rounded-lg"
          />
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            className="absolute bottom-40 right-24 w-16 h-16 border-2 border-teal-400/30 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            className="absolute top-1/3 right-1/3 w-12 h-12 border-2 border-yellow-400/30"
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
              <Badge className="bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 px-5 py-2 mb-6 font-bold shadow-2xl shadow-emerald-500/50 text-sm">
                <Calculator className="w-4 h-4 inline mr-2" />
                Tax Planning & Compliance
              </Badge>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-teal-200">
                Tax Made Simple
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-xl md:text-2xl text-emerald-200 max-w-3xl mx-auto leading-relaxed"
            >
              A practical guide to <span className="text-yellow-400 font-semibold">common taxes</span>, withholding rules, and worked examples to estimate after-tax returns on your CrowdBricks investments.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-emerald-200"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="font-semibold">Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">Transparent</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-teal-400" />
                <span className="font-semibold">Calculated</span>
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

      {/* Quick Summary Cards - Modernized */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Key Tax Rates
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">At a Glance</h2>
            <p className="text-xl text-slate-600">Essential tax information for investors and developers</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: Calculator,
                label: "Typical Withholding",
                value: "8% - 15%",
                desc: "Depends on instrument & residency",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50"
              },
              {
                icon: FileText,
                label: "VAT / Service Tax",
                value: "12.5%",
                desc: "Applies to some platform fees",
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-50 to-pink-50"
              },
              {
                icon: TrendingUp,
                label: "Corporate Tax",
                value: "25%",
                desc: "Developers should seek local advice",
                gradient: "from-orange-500 to-red-500",
                bgGradient: "from-orange-50 to-red-50"
              },
              {
                icon: Shield,
                label: "Reporting",
                value: "Automated",
                desc: "We provide investor statements for tax filing",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-50 to-emerald-50"
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 bg-gradient-to-br ${card.bgGradient} h-full`}>
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4`}>
                      <card.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">{card.label}</div>
                    <div className="text-3xl font-black text-slate-900 mb-2">{card.value}</div>
                    <div className="text-sm text-slate-600">{card.desc}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts - Modernized */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Tax Impact Analysis
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Visualize Your Returns</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-blue-100 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Effective Tax Rates</h3>
                      <p className="text-sm text-slate-600">By instrument type</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">Simple comparison to help you understand which instruments tend to attract higher withholding.</p>
                  <HorizontalBarChart items={barItems} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-purple-100 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Net vs Gross Returns</h3>
                      <p className="text-sm text-slate-600">Growth comparison over time</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Illustrative growth of a normalized investment (100) over {years} years — gross vs net after withholding.</p>

                  <div className="mb-6 flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-slate-100">
                    <label className="text-sm font-bold text-slate-700">Time Period:</label>
                    <select 
                      value={years} 
                      onChange={(e) => setYears(Number(e.target.value))} 
                      className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg font-semibold text-slate-900 bg-white hover:border-purple-400 focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value={3}>3 Years</option>
                      <option value={5}>5 Years</option>
                      <option value={7}>7 Years</option>
                      <option value={10}>10 Years</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto bg-white rounded-xl p-4 border-2 border-slate-100">
                    <NetVsGrossLineChart years={years} grossAnnualRate={0.10} withholdingPct={10} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tables: Headline Rates and Withholding - Modernized */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-5 py-2 mb-4 font-bold shadow-lg">
              <FileText className="w-4 h-4 inline mr-2" />
              Detailed Breakdown
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Rates & Guidelines</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-emerald-100 hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Headline Tax Rates</h3>
                      <p className="text-sm text-slate-600">Standard rates by category</p>
                    </div>
                  </div>
                  <div className="overflow-auto rounded-xl border-2 border-slate-100">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-900 to-slate-800">
                        <tr>
                          <th className="py-4 px-4 text-left text-white font-bold text-sm">Tax Type</th>
                          <th className="py-4 px-4 text-left text-white font-bold text-sm">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {headlineRates.map((r, idx) => (
                          <tr key={r.tax} className={`border-b hover:bg-emerald-50 transition-colors ${idx % 2 === 0 ? 'bg-slate-50' : ''}`}>
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900">{r.tax}</div>
                              <div className="text-xs text-slate-600 mt-1">{r.note}</div>
                            </td>
                            <td className="py-4 px-4 font-black text-emerald-700 text-lg">{r.rate}</td>
                          </tr>
                        ))}
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
              <Card className="h-full shadow-2xl border-2 border-blue-100 hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Withholding & Reporting</h3>
                      <p className="text-sm text-slate-600">Essential compliance guidelines</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {withholdingGuidance.map((g, idx) => (
                      <div key={g.item} className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100 hover:border-blue-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 mb-2">{g.item}</div>
                            <div className="text-sm text-slate-600 leading-relaxed">{g.rule}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Worked Examples - Modernized */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-5 py-2 mb-4 font-bold shadow-lg">
              <Calculator className="w-4 h-4 inline mr-2" />
              Real-World Scenarios
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Worked Examples</h2>
            <p className="text-xl text-slate-600">See how tax impacts your returns</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div className="space-y-6">
              {examples.map((ex, idx) => {
                const res = computeAfterTax(ex.grossReturnPercent, ex.investment, ex.withholdingPct);
                return (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    <Card className={`shadow-2xl border-2 transition-all duration-300 hover:scale-105 ${idx === exampleIndex ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50' : 'border-slate-200 bg-white/80 backdrop-blur-sm'}`}>
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-black text-xl text-slate-900 mb-2">{ex.title}</h4>
                            <p className="text-sm text-slate-600">{ex.description}</p>
                          </div>
                          <div className="ml-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl shadow-lg">
                            {ex.grossReturnPercent}%
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="p-4 bg-white rounded-xl border-2 border-slate-100">
                            <div className="text-xs font-bold text-slate-600 uppercase mb-1">Investment</div>
                            <div className="text-2xl font-black text-slate-900">₵{ex.investment.toLocaleString()}</div>
                          </div>
                          <div className="p-4 bg-white rounded-xl border-2 border-slate-100">
                            <div className="text-xs font-bold text-slate-600 uppercase mb-1">Withholding</div>
                            <div className="text-2xl font-black text-slate-900">{ex.withholdingPct}%</div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6 p-4 bg-white rounded-xl border-2 border-slate-100">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Gross Payout</span>
                            <span className="font-bold text-slate-900">₵{res.grossPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between items-center text-red-600">
                            <span className="text-sm">Withholding Tax</span>
                            <span className="font-bold">-₵{res.withholding.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Net Payout</span>
                            <span className="font-bold text-slate-900">₵{res.netPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-900">Total After-Tax Value</span>
                            <span className="text-2xl font-black text-green-700">₵{res.totalAfterTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            onClick={() => setExampleIndex(idx)} 
                            className={idx === exampleIndex ? "flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold" : "flex-1"}
                            variant={idx === exampleIndex ? "default" : "outline"}
                          >
                            {idx === exampleIndex ? "✓ Selected" : "Select Example"}
                          </Button>
                          <a href={`/docs/tax-sample-${ex.id}.pdf`}>
                            <Button variant="outline" className="border-2">
                              <FileText className="w-4 h-4 mr-2" />
                              PDF
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="sticky top-8 shadow-2xl border-2 border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900">Important Notes</h4>
                      <p className="text-sm text-slate-600">Before you proceed</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { icon: FileText, text: "This page provides illustrative guidance and simplified examples — not formal tax advice." },
                      { icon: Shield, text: "Tax treatment depends on investor residency, instrument structure and local law — consult a qualified adviser for definitive treatment." },
                      { icon: CheckCircle2, text: "CrowdBricks provides investor statements to help you file taxes; we recommend keeping all distribution records and investor packs." },
                      { icon: AlertCircle, text: "For non-resident investors, review double taxation treaties and withholding exemptions." },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-teal-300 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t-2 border-slate-200">
                    <a href="/contact">
                      <Button className="w-full group bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-6 text-lg shadow-xl hover:scale-105 transition-all duration-300">
                        Contact Support Team
                        <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </Button>
                    </a>
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