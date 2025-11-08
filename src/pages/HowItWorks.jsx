import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, FileCheck, TrendingUp, Users, CheckCircle2, ArrowRight,
  DollarSign, Shield, Clock, BarChart3, Building2, Zap, Target, Award
} from "lucide-react";

/*
  HowItWorks.jsx

  - Original "How it works" page inspired by the reference URL.
  - Sections included:
    1) Hero with full-bleed background image + overlay + short intro + CTA
    2) At-a-glance steps (grid of step cards)
    3) Funding flow diagram (SVG) showing platform process from application -> raise -> payout
    4) Timeline & typical durations (bar-style SVG chart)
    5) Fees & example cost table
    6) Roles and responsibilities table
    7) Worked example (numeric table showing a sample raise)
    8) FAQs accordion
    9) CTA / Contact
    10) Floating AIChatToggle included
  - All text is original but follows the structure and UX of the reference site.
  - Replace image paths (hero) and wire up real data/APIs later if needed.
*/

const STEPS = [
  {
    id: 1,
    title: "Apply & onboard",
    body:
      "Submit your raise request, developer KYC and basic project documents. We perform initial checks and confirm eligibility.",
  },
  {
    id: 2,
    title: "Due diligence",
    body:
      "Our investment team reviews costs, timeline, exit strategy and legal documentation. We prepare the investor pack.",
  },
  {
    id: 3,
    title: "Campaign setup",
    body:
      "We help structure the offer (tranches, minimum tickets, expected yield), create marketing assets and set the live date.",
  },
  {
    id: 4,
    title: "Launch & raise",
    body:
      "The campaign goes live to our investor community. Pledges are captured; payments are processed once thresholds or milestones are met.",
  },
  {
    id: 5,
    title: "Delivery & reporting",
    body:
      "Developers report progress and upload evidence. Investors receive periodic updates and performance reports from the platform.",
  },
  {
    id: 6,
    title: "Payout & close",
    body:
      "Payouts are released according to the agreed schedule after milestones are verified and any withholding applied.",
  },
];

const FEES = [
  { item: "Onboarding & setup (one-off)", amount: "₵500" },
  { item: "Platform fee", amount: "1.5% of amount raised" },
  { item: "Success fee", amount: "2–3% depending on campaign size" },
  { item: "Payment processing", amount: "Varies (Momo / Card / Bank)" },
];

const ROLES = [
  { role: "Developer", responsibility: "Provide project documents, run delivery, communicate with investors." },
  { role: "CrowdBricks", responsibility: "Perform diligence, host the campaign, provide investor onboarding and reporting." },
  { role: "Investors", responsibility: "Review investor pack, pledge funds and track project updates." },
  { role: "Payment provider", responsibility: "Collect payments, manage reconciliations and refunds." },
];

const EXAMPLE = {
  project: "Sample 12-month refurbishment",
  target: 500000,
  minimumInvestment: 500,
  expectedYieldPercent: 12,
  currentFunding: 320000,
  feesPercent: 1.5,
  successFeePercent: 2.5,
};

function HorizontalTimelineChart({ items = [] }) {
  // items: [{label, months}]
  const total = items.reduce((s, i) => s + i.months, 0) || 1;
  const width = 720;
  return (
    <svg viewBox={`0 0 ${width} 120`} className="w-full">
      {items.map((it, idx) => {
        const x = (items.slice(0, idx).reduce((s, i) => s + i.months, 0) / total) * (width - 80) + 40;
        const w = (it.months / total) * (width - 80);
        const y = 30;
        return (
          <g key={it.label}>
            <rect x={x} y={y} width={w} height={28} rx={6} fill={idx % 2 === 0 ? "#60a5fa" : "#f59e0b"} opacity="0.95" />
            <text x={x + w / 2} y={y + 18} fontSize="12" fill="#0f172a" textAnchor="middle">
              {it.label} ({it.months}m)
            </text>
          </g>
        );
      })}
      {/* axis line */}
      <line x1="40" y1="80" x2={width - 40} y2="80" stroke="#e6e7eb" strokeWidth="1" />
      <text x="40" y="100" fontSize="12" fill="#475569">Start</text>
      <text x={width - 40} y="100" fontSize="12" fill="#475569" textAnchor="end">Finish</text>
    </svg>
  );
}

function FlowDiagram() {
  // Simple linear flow SVG
  return (
    <svg viewBox="0 0 860 120" className="w-full">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
        </marker>
      </defs>

      {/* boxes */}
      {[
        { x: 20, label: "Apply & onboard" },
        { x: 200, label: "Due diligence" },
        { x: 380, label: "Campaign setup" },
        { x: 560, label: "Launch & raise" },
        { x: 740, label: "Delivery & payout" },
      ].map((b, i) => (
        <g key={b.label}>
          <rect x={b.x} y={20} width="160" height="48" rx="8" fill={i % 2 === 0 ? "#0ea5e9" : "#f59e0b"} opacity="0.95" />
          <text x={b.x + 80} y={50} fontSize="12" fill="#041125" textAnchor="middle" fontWeight="600">
            {b.label}
          </text>
        </g>
      ))}

      {/* connecting arrows */}
      <line x1="180" y1="44" x2="200" y2="44" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="360" y1="44" x2="380" y2="44" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="540" y1="44" x2="560" y2="44" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="720" y1="44" x2="740" y2="44" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
    </svg>
  );
}

function SimpleBarChart({ data = [] }) {
  // data: [{label, value}]
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 40;
  const gap = 18;
  const w = data.length * (barWidth + gap) + 40;
  return (
    <svg viewBox={`0 0 ${w} 200`} className="w-full">
      {data.map((d, i) => {
        const x = 20 + i * (barWidth + gap);
        const h = (d.value / max) * 120;
        return (
          <g key={d.label}>
            <rect x={x} y={150 - h} width={barWidth} height={h} fill="#0ea5e9" rx="6" />
            <text x={x + barWidth / 2} y="170" fontSize="11" fill="#475569" textAnchor="middle">{d.label}</text>
            <text x={x + barWidth / 2} y={140 - h} fontSize="11" fill="#0f172a" textAnchor="middle">{d.value}d</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function HowItWorks() {
  // Timeline data (months per step, illustrative)
  const timelineItems = useMemo(
    () => [
      { label: "Onboard", months: 1 },
      { label: "DD", months: 2 },
      { label: "Setup", months: 1 },
      { label: "Raise", months: 1 },
      { label: "Delivery", months: 6 },
    ],
    []
  );

  const milestoneDurations = useMemo(
    () => [
      { label: "Docs ready", value: 7 },
      { label: "Diligence days", value: 14 },
      { label: "Pack preparation", value: 7 },
      { label: "Campaign days", value: 21 },
      { label: "Verification", value: 10 },
    ],
    []
  );

  const [faqOpen, setFaqOpen] = useState({});
  const toggleFaq = (i) => setFaqOpen((s) => ({ ...s, [i]: !s[i] }));

  return (
    <MainLayout>
      {/* HERO - Premium Developer-Focused Fintech Design */}
      <section aria-label="How it works hero" className="relative isolate overflow-hidden min-h-[75vh] flex items-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
          {/* Animated mesh gradient orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Tech grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden -z-5">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 left-10 w-20 h-20 border-2 border-yellow-400/30 rounded-lg"
          />
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            className="absolute bottom-32 right-20 w-16 h-16 border-2 border-blue-400/30 rounded-full"
          />
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            className="absolute top-1/3 right-1/4 w-12 h-12 border-2 border-purple-400/30"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge with glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-5 py-2 mb-6 font-bold shadow-2xl shadow-yellow-500/50 animate-pulse text-sm">
                <Rocket className="w-4 h-4 inline mr-2" />
                Developer Crowdfunding Platform
              </Badge>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-yellow-200">
                Build. Fund. Deliver.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed"
            >
              The complete developer journey from application to payout. 
              <span className="text-yellow-400 font-semibold"> Transparent. Streamlined. Powerful.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4 justify-center"
            >
              <a href="#steps">
                <Button className="group bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold px-8 py-6 text-lg shadow-2xl shadow-yellow-500/40 hover:scale-105 transition-all duration-300">
                  Explore The Process
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="#example">
                <Button variant="outline" className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-yellow-400/50 px-8 py-6 text-lg font-semibold transition-all duration-300">
                  View Live Example
                </Button>
              </a>
            </motion.div>

            {/* Key metrics row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                { icon: Clock, label: "Avg. Setup Time", value: "7 Days", color: "text-blue-400" },
                { icon: Users, label: "Active Developers", value: "500+", color: "text-purple-400" },
                { icon: DollarSign, label: "Total Raised", value: "₵50M+", color: "text-yellow-400" },
                { icon: Award, label: "Success Rate", value: "94%", color: "text-green-400" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:border-yellow-400/30 transition-all duration-300">
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
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
     
      {/* INVESTOR JOURNEY - Redesigned */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
              <Users className="w-4 h-4 inline mr-2" />
              The Complete Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              The Investor and <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Fundraiser</span> Journey
            </h2>
          </motion.div>

          {/* Investor Journey Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-10 border-2 border-blue-100 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  The Investor Journey
                </h3>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                There are three simple steps in the investor journey. Firstly, provide some details to become an approved investor.
                Once approved, you can access project information, invest confidently, and grow your knowledge as you progress.
              </p>
              
              {/* Image */}
              <figure className="mb-8">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
                  <img
                    src="/chart.png"
                    alt="Investor reviewing real estate crowdfunding opportunities"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <figcaption className="mt-4 text-sm text-slate-500 italic text-center">
                  Empowering investors through transparent, accessible real estate opportunities.
                </figcaption>
              </figure>
            </div>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-black text-slate-900 mb-8 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Benefits</span> Investors Enjoy
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Building2, title: "Diverse Opportunities", desc: "Access a wide range of vetted real estate projects." },
                { icon: DollarSign, title: "Fractional Ownership", desc: "Invest in premium developments without full capital ownership." },
                { icon: TrendingUp, title: "Transparent Returns", desc: "Track real-time performance and payout reports." },
                { icon: Shield, title: "Secure Transactions", desc: "Funds and data protected by verified systems." },
                { icon: Zap, title: "Passive Income", desc: "Earn returns automatically as projects mature." },
                { icon: Award, title: "Professional Oversight", desc: "Projects managed by trusted developers." },
                { icon: Users, title: "Investor Community", desc: "Connect with like-minded investors and mentors." },
                { icon: BarChart3, title: "Educational Resources", desc: "Access webinars and insights to grow your skills." },
                { icon: Target, title: "Impact Investment", desc: "Support sustainable, community-driven projects." },
              ].map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400/50 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <benefit.icon className="w-6 h-6 text-slate-900" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors">{benefit.title}</h5>
                          <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 6 STEPS - Modernized Developer-Focused */}
      <section id="steps" className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-5 py-2 mb-4 font-bold shadow-lg">
              <Target className="w-4 h-4 inline mr-2" />
              Step-by-Step Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              How Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Real Estate Project</span> Gets Funded
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">We support developers from initial application through to investor payouts—every step transparent and trackable.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {STEPS.map((s, idx) => {
              const iconMap = [Rocket, FileCheck, BarChart3, DollarSign, Users, CheckCircle2];
              const Icon = iconMap[idx] || Rocket;
              const gradients = [
                "from-blue-500 to-cyan-500",
                "from-purple-500 to-pink-500",
                "from-yellow-500 to-orange-500",
                "from-green-500 to-emerald-500",
                "from-red-500 to-rose-500",
                "from-indigo-500 to-purple-500",
              ];
              
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400/50 bg-white/80 backdrop-blur-sm hover:scale-105 h-full">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[idx]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600 mb-1">STEP {s.id}</div>
                          <h3 className="font-black text-xl text-slate-900">{s.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 leading-relaxed mb-5">{s.body}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-slate-900 text-white border-0 font-semibold px-3 py-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {s.time || "Variable"}
                        </Badge>
                        <Badge className="bg-yellow-400 text-slate-900 border-0 font-semibold px-3 py-1">
                          {s.who || "Team Effort"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flow Diagram - Modernized */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Process Flow
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Funding Flow</h2>
              <p className="text-xl text-slate-600">High-level flow from application through to payouts and reporting.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 shadow-2xl border-2 border-blue-100">
              <FlowDiagram />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline / durations - Modernized */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
                <Clock className="w-4 h-4 inline mr-2" />
                Timeline & Milestones
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Typical Timeline</h2>
              <p className="text-xl text-slate-600">Illustrative durations for each stage of a standard campaign.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 mb-8 shadow-2xl border-2 border-purple-100">
              <HorizontalTimelineChart items={timelineItems} />
            </div>

            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-2 border-yellow-100">
              <CardContent className="p-8">
                <h3 className="text-2xl font-black text-slate-900 mb-6">Milestone Durations (Days)</h3>
                <SimpleBarChart data={milestoneDurations} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Fees & Roles - Modernized */}
      <section id="fees" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Fees & Responsibilities</h2>
            <p className="text-xl text-slate-600">Clear breakdown of costs and roles.</p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-green-100 bg-white/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Fees & Charges</h3>
                      <p className="text-sm text-slate-600">Transparent pricing structure</p>
                    </div>
                  </div>

                  <div className="overflow-auto rounded-xl border-2 border-slate-100">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-900 to-slate-800">
                        <tr>
                          <th className="py-4 px-4 text-left text-white font-bold">Item</th>
                          <th className="py-4 px-4 text-left text-white font-bold">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {FEES.map((f, idx) => (
                          <tr key={f.item} className={`border-b hover:bg-green-50 transition-colors ${idx % 2 === 0 ? 'bg-slate-50' : ''}`}>
                            <td className="py-4 px-4 text-slate-700 font-medium">{f.item}</td>
                            <td className="py-4 px-4 text-slate-900 font-bold">{f.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                    <p className="text-sm text-slate-700"><strong>Note:</strong> Fees shown are indicative. Final commercial terms may differ by campaign.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-2xl border-2 border-blue-100 bg-white/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Roles & Responsibilities</h3>
                      <p className="text-sm text-slate-600">Who does what during the raise</p>
                    </div>
                  </div>

                  <div className="overflow-auto rounded-xl border-2 border-slate-100">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-900 to-slate-800">
                        <tr>
                          <th className="py-4 px-4 text-left text-white font-bold">Role</th>
                          <th className="py-4 px-4 text-left text-white font-bold">Responsibility</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {ROLES.map((r, idx) => (
                          <tr key={r.role} className={`border-b hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-slate-50' : ''}`}>
                            <td className="py-4 px-4 text-slate-700 font-bold">{r.role}</td>
                            <td className="py-4 px-4 text-slate-600">{r.responsibility}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <p className="text-sm text-slate-700"><strong>Note:</strong> Legal responsibilities are set out in the campaign agreement and investor documents.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Worked Example - Modernized */}
      <section id="example" className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-5 py-2 mb-4 font-bold shadow-lg">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Real Example
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Worked Example</h2>
              <p className="text-xl text-slate-600">A simplified sample showing fees and net amounts for an illustrative campaign.</p>
            </div>

            <Card className="shadow-2xl border-2 border-yellow-100 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10">
                <div className="grid lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-slate-900" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">{EXAMPLE.project}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100">
                        <Target className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-slate-600 font-semibold">Funding Target</div>
                          <div className="text-xl font-black text-slate-900">₵{EXAMPLE.target.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-xs text-slate-600 font-semibold">Minimum Investment</div>
                          <div className="text-xl font-black text-slate-900">₵{EXAMPLE.minimumInvestment.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-xs text-slate-600 font-semibold">Expected Yield</div>
                          <div className="text-xl font-black text-slate-900">{EXAMPLE.expectedYieldPercent}% Returns</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-100">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="text-xs text-slate-600 font-semibold">Platform Fee</div>
                          <div className="text-xl font-black text-slate-900">{EXAMPLE.feesPercent}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900">Financial Breakdown</h4>
                    </div>
                    
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border-2 border-slate-200">
                      <table className="w-full">
                        <tbody className="space-y-3">
                          <tr className="border-b-2 border-slate-200">
                            <td className="py-4 text-slate-700 font-semibold">Target Raised</td>
                            <td className="py-4 text-right text-slate-900 font-bold text-lg">₵{EXAMPLE.target.toLocaleString()}</td>
                          </tr>
                          <tr className="border-b-2 border-slate-200">
                            <td className="py-4 text-slate-700 font-semibold">Platform Fee ({EXAMPLE.feesPercent}%)</td>
                            <td className="py-4 text-right text-red-600 font-bold text-lg">-₵{Math.round((EXAMPLE.feesPercent / 100) * EXAMPLE.target).toLocaleString()}</td>
                          </tr>
                          <tr className="border-b-2 border-slate-200">
                            <td className="py-4 text-slate-700 font-semibold">Success Fee ({EXAMPLE.successFeePercent}%)</td>
                            <td className="py-4 text-right text-red-600 font-bold text-lg">-₵{Math.round((EXAMPLE.successFeePercent / 100) * EXAMPLE.target).toLocaleString()}</td>
                          </tr>
                          <tr className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                            <td className="py-4 px-4 text-slate-900 font-black text-lg">Net to Developer</td>
                            <td className="py-4 px-4 text-right text-green-700 font-black text-2xl">₵{Math.round(EXAMPLE.target * (1 - (EXAMPLE.feesPercent + EXAMPLE.successFeePercent) / 100)).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700"><strong>Disclaimer:</strong> This example is simplified and excludes taxes, payment processing fees and other variable costs. Use it only as a starting point for your calculations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQs - Modernized */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 mb-4 font-semibold shadow-lg">
              <FileCheck className="w-4 h-4 inline mr-2" />
              Got Questions?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Everything you need to know about the crowdfunding process.</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "How long does onboarding take?",
                a: "Initial onboarding is typically 3–7 business days depending on the speed of document submission and verification.",
              },
              {
                q: "What documents are required?",
                a: "Company registration, director IDs, proof of title, project plan, budget and a sales strategy or exit plan are typical requirements.",
              },
              {
                q: "When do investors pay?",
                a: "Investors pledge during the campaign; payment is captured and cleared according to the payment provider and campaign rules (instant or at milestone).",
              },
              {
                q: "Can I change my campaign terms after launch?",
                a: "Major commercial terms (target, yield, minimum investment) cannot be changed after launch. Minor clarifications may be posted as updates with investor consent where required.",
              },
            ].map((f, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 border-2 border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm hover:border-yellow-400 hover:shadow-xl transition-all duration-300"
                open={!!faqOpen[i]}
              >
                <summary
                  onClick={() => toggleFaq(i)}
                  className="cursor-pointer font-bold text-lg text-slate-900 flex items-center justify-between group-hover:text-yellow-600 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-slate-900" />
                    </div>
                    {f.q}
                  </span>
                  <ArrowRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-11 text-slate-600 leading-relaxed">{f.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Premium Design */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-6">
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-6 py-3 text-lg font-black shadow-2xl shadow-yellow-500/50">
                <Rocket className="w-5 h-5 inline mr-2" />
                Ready to Launch?
              </Badge>
            </div>
            
            <h3 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-amber-400">
                Ready to Start Your Raise?
              </span>
            </h3>
            
            <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Submit a quick request and our raise team will get back to you with next steps and documentation guidance.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/raise">
                <Button className="group bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold px-10 py-7 text-lg shadow-2xl shadow-yellow-500/40 hover:scale-105 transition-all duration-300">
                  Start Your Raise
                  <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </a>
              <a href="/contact">
                <Button variant="outline" className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-yellow-400/50 px-10 py-7 text-lg font-semibold transition-all duration-300">
                  Contact Support
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="font-semibold">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">94% Success Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">500+ Developers</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AIChatToggle />
    </MainLayout>
  );
}