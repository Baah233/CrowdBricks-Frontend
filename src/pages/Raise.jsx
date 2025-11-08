import { Link } from "react-router-dom";
import React, { useState, useEffect, useMemo, useRef } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { MessageCircle, Info, Clock, FileText, CheckCircle, Globe, TrendingUp, Shield, Users, Zap, Target, ChevronRight, Sparkles, ArrowRight, Building2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Raise() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    expectedAmount: "",
    summary: "",
  });

  const handleChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const submitRaiseRequest = async (e) => {
    e?.preventDefault();
    if (!form.name || !form.email || !form.expectedAmount) {
      toast({
        title: "Missing fields",
        description: "Please provide your name, email and expected raise amount.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/raise-request", form);
      toast({
        title: "Request Sent!",
        description: "Our team will reach out to you shortly.",
      });
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        expectedAmount: "",
        summary: "",
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: error?.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testimonials = useMemo(
    () => [
      {
        quote:
          "CrowdBricks helped us raise 2M for our residential project in just 6 weeks. The investor community is engaged, and the platform is transparent.",
        name: "Ama Osei",
        title: "CEO, Osei Developments",
        image: "/placeholder.svg",
      },
      {
        quote:
          "Forget the bank. We raised half our capital here at flexible terms, and the team supported us every step of the way.",
        name: "Kwame Adu",
        title: "Director, Adu Real Estate",
        image: "/placeholder.svg",
      },
      {
        quote:
          "The best crowdfunding platform in Ghana. Fast, professional, compliant. 100% recommended!",
        name: "Efua Mensah",
        title: "Founder, Mensah Properties",
        image: "/placeholder.svg",
      },
    ],
    []
  );

  const [showTestimonial, setShowTestimonial] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowTestimonial((s) => (s + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        {/* Global fintech background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          {/* Tech grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
          </div>
        </div>

        {/* ===== MODERN HERO SECTION ===== */}
        <section
          role="banner"
          aria-label="Hero — Raise Property Finance with CrowdBricks"
          className="relative isolate overflow-hidden"
        >
          {/* Floating particles for developers */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-30 animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-20 animation-delay-4000"></div>
            <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-25 animation-delay-3000"></div>
          </div>

          <div className="absolute inset-0 -z-10 overflow-hidden">
            <picture>
              <source srcSet="/Hero5.jpg" type="image/webp" />
              <img
                src="/Hero5.jpg"
                alt="Aerial view of a real estate development project"
                className="w-full h-full object-cover object-center opacity-10"
                loading="lazy"
              />
            </picture>
          </div>

          <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <Sparkles className="w-3 h-3" />
                For Developers & Property Owners
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
            >
              Raise Property Finance
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                With CrowdBricks
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Connect with thousands of investors ready to fund your next property project.
              <span className="block mt-2 text-yellow-300 font-semibold">
                Fast • Transparent • Regulated
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/auth/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 px-10 py-6 text-lg font-bold shadow-2xl hover:shadow-yellow-500/50 transition-all hover:scale-105 rounded-xl group"
                >
                  Apply For Finance
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 px-10 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
                onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center items-center gap-8 mt-12 text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span>SEC Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-yellow-400" />
                <span>5,000+ Investors</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span>₵50M+ Raised</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== WHY RAISE WITH US SECTION ===== */}
        <section
          id="learn-more"
          className="container mx-auto px-6 py-20 relative z-10"
          aria-labelledby="why-raise-heading"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Why Raise With{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                  CrowdBricks
                </span>
              </h2>
              <p className="text-lg text-blue-200">
                Access funding faster with our innovative platform and engaged investor community
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Access to Capital",
                description: "Connect with thousands of investors ready to fund property projects.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "SEC Regulated",
                description: "Fully compliant with SEC Ghana 2024 Crowdfunding Guidelines.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Fast Onboarding",
                description: "Complete KYC and project setup within days, not weeks.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: Target,
                title: "Flexible Terms",
                description: "Structure deals that work for your project and timeline.",
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 p-8 hover:-translate-y-2 border-2 border-white/10 hover:border-yellow-400/50"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-blue-200 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== REQUIREMENTS SECTION ===== */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-2xl p-8 border-2 border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">
                  Platform Benefits
                </h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm">
                    <Shield className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-blue-200 leading-relaxed">
                    <strong className="text-white">Regulated by SEC Ghana:</strong> We follow SEC's 2024 Crowdfunding Guidelines.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                  </div>
                  <span className="text-blue-200 leading-relaxed">
                    <strong className="text-white">Bank of Ghana compliance:</strong> Fully compliant with BoG payment regulations.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm">
                    <Zap className="w-4 h-4 text-yellow-300" />
                  </div>
                  <span className="text-blue-200 leading-relaxed">
                    <strong className="text-white">Fast onboarding:</strong> Complete your KYC and project setup within days.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm">
                    <Users className="w-4 h-4 text-purple-300" />
                  </div>
                  <span className="text-blue-200 leading-relaxed">
                    <strong className="text-white">Investor reach:</strong> Access thousands of verified investors.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm">
                    <Target className="w-4 h-4 text-cyan-300" />
                  </div>
                  <span className="text-blue-200 leading-relaxed">
                    <strong className="text-white">Transparent process:</strong> Track everything from listing to payout.
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-2xl p-8 border-2 border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <CheckCircle className="w-6 h-6 text-slate-900" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  What You'll Need
                </h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm">
                    <ChevronRight className="w-5 h-5 text-yellow-400" />
                  </div>
                  <span className="text-blue-200 leading-relaxed">Company registration & director IDs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm">
                    <ChevronRight className="w-5 h-5 text-yellow-400" />
                  </div>
                  <span className="text-blue-200 leading-relaxed">Proof of property ownership or land title</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm">
                    <ChevronRight className="w-5 h-5 text-yellow-400" />
                  </div>
                  <span className="text-blue-200 leading-relaxed">Project plan with timeline & cost breakdown</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm">
                    <ChevronRight className="w-5 h-5 text-yellow-400" />
                  </div>
                  <span className="text-blue-200 leading-relaxed">Financial statements or prior project reports</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t-2 border-white/10">
                <p className="text-sm text-blue-200 italic">
                  <strong className="text-yellow-400">💡 Pro tip:</strong> Having these ready speeds up your approval process
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== TESTIMONIALS SECTION ===== */}
        <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8 z-10">
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-30 animation-delay-2000"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-2xl lg:max-w-4xl text-center">
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              src="/CB1.png" 
              alt="CrowdBricks logo" 
              className="mx-auto h-20 mb-10 filter drop-shadow-lg" 
            />

            <AnimatePresence mode="wait">
              <motion.figure
                key={showTestimonial}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <blockquote className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
                  <p className="relative">
                    <span className="text-yellow-400 text-6xl absolute -top-6 -left-4">"</span>
                    {testimonials[showTestimonial].quote}
                    <span className="text-yellow-400 text-6xl absolute -bottom-12 -right-4">"</span>
                  </p>
                </blockquote>
                <figcaption className="mt-14">
                  <img
                    src={testimonials[showTestimonial].image}
                    alt={testimonials[showTestimonial].name}
                    className="mx-auto h-14 w-14 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
                  />
                  <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                    <div className="font-bold text-white text-lg">
                      {testimonials[showTestimonial].name}
                    </div>
                    <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-yellow-400">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <div className="text-blue-200">{testimonials[showTestimonial].title}</div>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {/* Pagination dots */}
            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setShowTestimonial(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === showTestimonial
                      ? 'w-8 bg-yellow-400'
                      : 'w-2.5 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Show testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="container mx-auto px-6 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl p-12 relative overflow-hidden border-2 border-white/10"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-500 rounded-3xl opacity-20 blur"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/30">
                <Sparkles className="w-8 h-8 text-slate-900" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Raise Capital?
              </h2>
              <p className="text-xl text-blue-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                Join the leading property crowdfunding platform in Ghana. Submit your project today and get funded faster.
              </p>
              <Link to="/auth/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 px-12 py-7 text-xl font-bold shadow-2xl hover:shadow-yellow-500/50 transition-all hover:scale-105 rounded-xl group"
                >
                  Start Your Application
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
}
