import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  TrendingUp,
  Users,
  Building2,
  Shield,
  ArrowRight,
  CheckCircle2,
  Globe,
  ChevronRight,
  Sparkles,
  Target,
  Lock,
  BarChart3,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/ProjectCard";
import AIChatToggle from "@/components/AIChatToggle";
import { fetchProjects, platformStats } from "@/lib/data";

const testimonials = [
  {
    quote:
      "CrowdBricks made real estate investing simple and transparent. I started small, but now I own shares in 3 properties!",
    name: "Judith Black",
    role: "Investor",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=256&h=256&q=80",
  },
  {
    quote:
      "My development project was fully funded within weeks! The investor experience was seamless.",
    name: "Kwame Boateng",
    role: "Developer",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=facearea&w=256&h=256&q=80",
  },
  {
    quote:
      "The dashboards, impact reporting, and updates make me feel part of something bigger.",
    name: "Ama Serwaa",
    role: "Entrepreneur",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&h=256&q=80",
  },
];

const HERO_IMAGES = ["/hero1.png", "/hero2.png", "/hero3.png"];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Homepage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const featured = useMemo(() => projects.slice(0, 6), [projects]);

  // Fetch projects from API
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setLoading(false);
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setHeroIndex((i) => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIndex((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowCTA(window.scrollY > window.innerHeight * 0.4);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased relative overflow-hidden">
      {/* ===== MODERN HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Animated background pattern - lighter on mobile */}
        <div className="absolute inset-0 opacity-5 sm:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Hero image with overlay - reduced on mobile */}
        {HERO_IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
              i === heroIndex ? "opacity-10 sm:opacity-20" : "opacity-0"
            }`}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        
        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col justify-center min-h-[500px] sm:min-h-[600px] md:min-h-screen py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6"
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold border-0 shadow-lg">
              <Sparkles className="w-3 h-3 mr-1 inline" />
              Trusted Real Estate Platform
            </Badge>
            <Badge className="bg-white/10 backdrop-blur-sm text-white border-white/20 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
              🇬🇭 Ghana
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-white max-w-4xl mb-4 sm:mb-6"
          >
            Invest in{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-yellow-300 sm:via-yellow-400 sm:to-amber-500">
                Real Estate
              </span>
              <span className="hidden sm:block absolute -bottom-2 left-0 w-full h-3 bg-yellow-400/30 blur-lg"></span>
            </span>
            <br />
            Starting from{" "}
            <span className="text-yellow-400">₵500</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-xl md:text-2xl text-blue-100 max-w-2xl mb-6 sm:mb-8 leading-relaxed"
          >
            Join thousands of Ghanaians building wealth through fractional property ownership.
            <span className="block mt-2 text-yellow-300 font-semibold text-xs sm:text-base">
              Transparent • Regulated • Accessible
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12"
          >
            <Link to="/projects" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 px-6 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg font-bold shadow-2xl hover:shadow-yellow-500/50 transition-all hover:scale-105 rounded-xl group">
                Explore Investments
                <ArrowRight className="ml-2 w-3 h-3 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth/register" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 px-6 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg font-semibold rounded-xl transition-all hover:scale-105"
              >
                Create Free Account
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/80 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
              <span>SEC Regulated</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
              <span>{platformStats.totalInvestors.toLocaleString()}+ Investors</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-12 sm:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden"
      >
        {/* Animated background elements - smaller on mobile */}
        <div className="absolute inset-0 opacity-20 sm:opacity-30">
          <div className="absolute top-20 left-10 w-40 sm:w-72 h-40 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-40 sm:w-72 h-40 sm:h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-40 sm:w-72 h-40 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Grid pattern overlay - hidden on mobile */}
        <div className="hidden sm:block absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgb(0, 0, 0) 1px, transparent 1px), linear-gradient(to bottom, rgb(0, 0, 0) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Property Investment Made Simple</h2>
          <h4 className="text-base sm:text-lg md:text-xl text-slate-600 mb-4 sm:mb-6">
            Build Wealth Online |{" "}
            <span className="text-yellow-400">Capital Growth & Income</span> |{" "}
            <span className="text-blue-600">Global Investor Community</span>
          </h4>
          <p className="text-lg text-slate-700 mb-6 leading-relaxed">
            <span className="text-blue-600 font-bold">Crowd</span>
            <span className="text-yellow-400 font-bold">Bricks</span> makes online property
            investment accessible to everyone while empowering developers to deliver sustainable real
            estate projects across Ghana.
          </p>
          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
            Since launching in 2023, we've built expertise in property funding, sharing our insights
            with both investors and developers.{" "}
            <span className="font-semibold text-slate-800">
              Flexibility, transparency, and integrity
            </span>{" "}
            are at the heart of all we do.
          </p>
          <div className="mt-6 sm:mt-10">
            <Link to="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                Start Investing Today
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ===== STATS SECTION - REDESIGNED ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
      >
        {/* Dynamic mesh gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
        
        {/* Animated gradient orbs - smaller on mobile */}
        <div className="absolute top-0 right-0 w-40 sm:w-96 h-40 sm:h-96 bg-yellow-400/20 rounded-full blur-2xl sm:blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-40 sm:w-96 h-40 sm:h-96 bg-blue-400/20 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 sm:w-96 h-40 sm:h-96 bg-purple-400/20 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Tech grid overlay - hidden on mobile */}
        <div className="hidden sm:block absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-16"
          >
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 shadow-lg shadow-blue-500/50">
              <BarChart3 className="w-3 h-3 mr-1 inline" />
              Platform Performance
            </Badge>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4 bg-clip-text">
              Proven Track Record
            </h2>
            <p className="text-sm sm:text-xl text-blue-200 max-w-2xl mx-auto">
              Numbers that speak to our commitment to investor success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                label: "Total Capital Raised",
                value: platformStats.totalRaised / 1_000_000,
                prefix: "₵",
                suffix: "M+",
                sub: `${platformStats.totalProjects} projects successfully funded`,
                color: "from-green-500 to-emerald-600",
                bgColor: "bg-green-50",
              },
              {
                icon: Users,
                label: "Active Investors",
                value: platformStats.totalInvestors,
                suffix: "+",
                sub: "Growing community nationwide",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: BarChart3,
                label: "Average Returns",
                value: platformStats.averageReturn,
                suffix: "%",
                sub: "Consistent performance",
                color: "from-yellow-500 to-amber-600",
                bgColor: "bg-yellow-50",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.05, transition: { duration: 0.3 } }}
                className="relative group"
              >
                {/* Glowing border effect on hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${stat.color} rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition duration-500`}></div>
                
                <div className="relative bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all p-8 group-hover:border-white/40">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color} mb-6 shadow-lg`}>
                    <stat.icon className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div className={`text-5xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2 drop-shadow-lg`}>
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      prefix={stat.prefix || ""}
                      suffix={stat.suffix}
                      separator=","
                      decimals={stat.value < 100 ? 1 : 0}
                    />
                  </div>
                  <div className="text-lg font-bold text-white mb-2">{stat.label}</div>
                  <div className="text-sm text-blue-200">{stat.sub}</div>
                  
                  {/* Decorative element */}
                  <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full opacity-10 blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== FOR DEVELOPERS SECTION ===== */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 relative overflow-hidden"
      >
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-yellow-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 border-4 border-white/20 rounded-lg rotate-12 animate-float"></div>
        <div className="absolute bottom-40 right-40 w-16 h-16 border-4 border-yellow-400/30 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg rotate-45 animate-float animation-delay-4000"></div>
        
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            <img
              src="/an architect.webp"
              alt="Developer funding success"
              className="relative rounded-2xl shadow-2xl w-full object-cover border-4 border-white/20"
            />
          </motion.div>
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              For Developers — Raise Capital with Confidence
            </h2>
            <p className="text-blue-50 mb-6 leading-relaxed">
              <span className="text-yellow-400 font-bold">CrowdBricks</span> helps developers
              raise funds faster through a growing investor network. We handle compliance and
              investor relations — you focus on building.
            </p>
            {[
              {
                title: "Fast, transparent funding",
                desc: "Submit your project and get matched with thousands of investors in days.",
              },
              {
                title: "Retain full control",
                desc: "Keep ownership and autonomy while securing the capital you need.",
              },
              {
                title: "Expert support",
                desc: "Our team assists with campaign prep, due diligence, and investor outreach.",
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-blue-100 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
            <Link to="/raise">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 text-lg font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-yellow-500/50 transition-all hover:scale-105 group">
                Raise Capital Now
                <ChevronRight className="ml-2 w-5 h-5 inline group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
      >
        {/* Tech grid background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }} />
        </div>
        
        {/* Glowing accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-10">
            How <span className="text-yellow-400">CrowdBricks</span> Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                step: "01",
                title: "Browse Projects",
                desc: "Explore pre-vetted real estate opportunities with full transparency.",
              },
              {
                step: "02",
                title: "Invest Securely",
                desc: "Invest from as low as ₵500 via mobile money or card.",
              },
              {
                step: "03",
                title: "Earn Returns",
                desc: "Track progress, receive updates, and enjoy returns up to 15%.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 rounded-xl opacity-0 group-hover:opacity-75 blur transition duration-500"></div>
                
                <div className="relative bg-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/30 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 font-black text-lg mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold mt-2 mb-2 text-white">{item.title}</h4>
                  <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== TESTIMONIALS ===== */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white relative overflow-hidden"
      >
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-400/40 via-transparent to-transparent"></div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 border-2 border-white/10 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 border-2 border-white/5 rounded-full"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h3 className="text-3xl font-bold mb-8">What Investors Say</h3>
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={testimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-md"
              >
                <p className="text-lg italic mb-4">
                  “{testimonials[testimonialIndex].quote}”
                </p>
                <footer className="flex flex-col items-center">
                  <img
                    src={testimonials[testimonialIndex].image}
                    alt={testimonials[testimonialIndex].name}
                    className="h-14 w-14 rounded-full border-2 border-yellow-400 object-cover"
                  />
                  <div className="mt-3 font-semibold">
                    {testimonials[testimonialIndex].name}
                  </div>
                  <div className="text-sm text-blue-100">
                    {testimonials[testimonialIndex].role}
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
            <div className="flex justify-center mt-6 space-x-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === testimonialIndex
                      ? "bg-yellow-400 w-5"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== FINAL CTA ===== */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-slate-900 text-center relative overflow-hidden"
      >
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        
        {/* Animated sparkle elements */}
        <div className="absolute top-20 left-1/4 w-3 h-3 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-white rounded-full animate-pulse animation-delay-2000"></div>
        
        <div className="relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
          Ready to Build Wealth Through Real Estate?
        </h2>
        <p className="mb-6 text-slate-800 text-lg">
          Join thousands of investors shaping Ghana's property future.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/auth/register">
            <Button className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 text-lg font-semibold rounded-full">
              Create Free Account
            </Button>
          </Link>
          <Link to="/projects">
            <Button
              variant="outline"
              className="border-slate-900 text-slate-900 hover:bg-slate-200 px-6 py-3 text-lg font-semibold rounded-full"
            >
              Explore Projects
            </Button>
          </Link>
        </div>
        </div>
      </motion.section>

      {/* ===== FLOATING CTA (Mobile) ===== */}
      <AnimatePresence>
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[80%] md:hidden"
          >
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-full px-4 py-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800 ml-2">
                Start your first investment today 🚀
              </div>
              <div className="flex items-center gap-2">
                <Link to="/projects">
                  <Button
                    size="sm"
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-4 py-2 rounded-full"
                  >
                    Invest
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 rounded-full px-4 py-2"
                  >
                    Join
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIChatToggle />
    </div>
  );
}
