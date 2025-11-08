import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Star, Users, MessageSquare, Award, TrendingUp, 
  ChevronLeft, ChevronRight, Quote, Send, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/*
  Testimonials page
  - Inspired by https://www.simplecrowdfunding.co.uk/testimonials
  - Sections:
    1) Hero with full-bleed background image + overlay + headline
    2) Metrics / social proof strip (cards)
    3) Rotating featured testimonial (large)
    4) Grid of testimonials (cards) with filters
    5) CTA + submit-a-testimonial form (local, client-only)
    6) Floating AIChatToggle (already used across site)
  - Replace image paths (/images/testimonials/...) with your real assets in /public
*/

const sampleTestimonials = [
  {
    id: "t1",
    name: "Akua Mensah",
    role: "Investor",
    location: "Accra, Ghana",
    rating: 5,
    quote:
      "I started with ₵500 and now receive quarterly returns. CrowdBricks made investing straightforward and transparent.",
    avatar: "/images/testimonials/akua.jpg",
    date: "2024-11-02",
  },
  {
    id: "t2",
    name: "Kwame Asare",
    role: "Developer",
    location: "Kumasi, Ghana",
    rating: 5,
    quote:
      "Our campaign reached target quickly. The platform supported us with investor communications and reporting.",
    avatar: "/images/testimonials/kwame.jpg",
    date: "2025-02-14",
  },
  {
    id: "t3",
    name: "Nana Yaa",
    role: "Investor",
    location: "Takoradi, Ghana",
    rating: 4,
    quote:
      "Fast onboarding and clear project information. I like the small-ticket entry for diversifying my portfolio.",
    avatar: "/images/testimonials/nana.jpg",
    date: "2024-09-21",
  },
  {
    id: "t4",
    name: "Francis Opey",
    role: "Developer",
    location: "Accra, Ghana",
    rating: 5,
    quote:
      "CrowdBricks made the fundraising process professional. Their due diligence helped build investor confidence.",
    avatar: "/images/testimonials/francis.jpg",
    date: "2024-12-12",
  },
];

export default function Testimonials() {
  const { toast } = useToast();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [filterRole, setFilterRole] = useState("all");
  const [testimonials, setTestimonials] = useState(sampleTestimonials);
  const [form, setForm] = useState({
    name: "",
    role: "",
    location: "",
    quote: "",
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  // auto-advance featured testimonial every 6s
  useEffect(() => {
    const t = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const visibleTestimonials = useMemo(() => {
    if (filterRole === "all") return testimonials;
    return testimonials.filter((t) => t.role.toLowerCase() === filterRole);
  }, [testimonials, filterRole]);

  const metrics = [
    { label: "Total Raised", value: "₵12.4M" },
    { label: "Investors", value: "3,200+" },
    { label: "Projects Listed", value: "48" },
  ];

  const handleInput = (field) => (e) =>
    setForm((s) => ({ ...s, [field]: e.target.value }));

  const submitTestimonial = (e) => {
    e?.preventDefault();
    if (!form.name || !form.quote) {
      toast({
        title: "Missing information",
        description: "Please provide your name and testimonial text.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    // client-side mock submit — in a real app, POST to /api/testimonials
    setTimeout(() => {
      const newT = {
        id: `t-${Date.now()}`,
        name: form.name,
        role: form.role || "Investor",
        location: form.location || "Unknown",
        rating: Number(form.rating) || 5,
        quote: form.quote,
        avatar: "/images/testimonials/default.jpg",
        date: new Date().toISOString().slice(0, 10),
      };
      setTestimonials((s) => [newT, ...s]);
      setForm({ name: "", role: "", location: "", quote: "", rating: 5 });
      setSubmitting(false);
      toast({
        title: "Thanks for your testimonial",
        description: "We've added your testimonial (pending moderation).",
      });
    }, 900);
  };

  return (
    <MainLayout>
      {/* ANIMATED HERO - Purple/Pink Social Proof Theme */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 animate-gradient" />
        
        {/* Animated orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-fuchsia-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />

        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.2) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(168, 85, 247, 0.2) 1px, transparent 1px)`,
            backgroundSize: '14px 24px'
          }} />
        </div>

        {/* Floating shapes */}
        <motion.div
          className="absolute top-32 right-1/4 w-2 h-2 bg-purple-400"
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-3 h-3 bg-pink-400 rotate-45"
          animate={{
            y: [0, 20, 0],
            rotate: [45, 90, 45],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-2xl">
              <MessageSquare className="w-4 h-4 mr-2 inline" />
              COMMUNITY VOICES
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-fuchsia-200">
              Real Stories, Real Success
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover how CrowdBricks is transforming dreams into reality for developers and investors across Ghana
            </p>
            
            {/* Trust indicators */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-purple-200">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <Users className="w-5 h-5" />
                <span className="font-semibold">3,200+ Happy Members</span>
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <Award className="w-5 h-5" />
                <span className="font-semibold">500+ Success Stories</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="rgb(2 6 23)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </svg>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {metrics.map((m, idx) => (
              <motion.div
                key={m.label}
                className="group relative bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    {idx === 0 && <TrendingUp className="w-7 h-7 text-white" />}
                    {idx === 1 && <Users className="w-7 h-7 text-white" />}
                    {idx === 2 && <Award className="w-7 h-7 text-white" />}
                  </div>
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-2">
                  {m.value}
                </div>
                <div className="text-purple-300 font-medium">{m.label}</div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 transition-all duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured rotating testimonial */}
      <section className="py-12 bg-gradient-to-br from-white via-blue-70 to-yellow-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Card className="p-6">
              <CardContent>
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={testimonials[featuredIndex]?.avatar || "/images/testimonials/default.jpg"}
                      alt={testimonials[featuredIndex]?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">
                          {testimonials[featuredIndex]?.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {testimonials[featuredIndex]?.role} • {testimonials[featuredIndex]?.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonials[featuredIndex]?.rating || 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <blockquote className="mt-4 text-slate-700 text-lg">
                      “{testimonials[featuredIndex]?.quote}”
                    </blockquote>

                    <div className="mt-4 flex gap-2">
                      <Button onClick={() => setFeaturedIndex((i) => (i - 1 + testimonials.length) % testimonials.length)} variant="outline">
                        Prev
                      </Button>
                      <Button onClick={() => setFeaturedIndex((i) => (i + 1) % testimonials.length)}>
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Grid + filters */}
      <section className="py-12 bg-gradient-to-br from-white via-blue-70 to-yellow-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All testimonials</h2>

            <div className="flex items-center gap-3">
              <label htmlFor="role" className="text-sm text-slate-600">Filter</label>
              <select id="role" value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-3 py-2 border rounded">
                <option value="all">All</option>
                <option value="investor">Investor</option>
                <option value="developer">Developer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTestimonials.map((t) => (
              <Card key={t.id} className="p-4">
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img src={t.avatar || "/images/testimonials/default.jpg"} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role} • {t.location}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-slate-700">“{t.quote}”</div>
                  <div className="mt-3 text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Submit testimonial form */}
      <section className="py-12 bg-gradient-to-br from-white via-blue-70 to-yellow-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-2xl font-bold">Share your story</h3>
              <p className="mt-3 text-slate-700">
                Help other investors and developers by sharing your experience with CrowdBricks. Your testimonial may be featured on our site.
              </p>
              <div className="mt-6">
                <Button className="bg-primary-700 text-white">Read our content guidelines</Button>
              </div>
            </div>

            <form onSubmit={submitTestimonial} className="space-y-3 bg-white rounded-xl p-6 border shadow-sm">
              <div>
                <label className="text-sm text-slate-600 block mb-1">Name</label>
                <Input value={form.name} onChange={(e) => handleChangeWrapper(e, setForm, "name")} placeholder="Your name" />
              </div>

              <div>
                <label className="text-sm text-slate-600 block mb-1">Role</label>
                <Input value={form.role} onChange={(e) => handleChangeWrapper(e, setForm, "role")} placeholder="Investor / Developer" />
              </div>

              <div>
                <label className="text-sm text-slate-600 block mb-1">Location</label>
                <Input value={form.location} onChange={(e) => handleChangeWrapper(e, setForm, "location")} placeholder="City, Country" />
              </div>

              <div>
                <label className="text-sm text-slate-600 block mb-1">Testimonial</label>
                <Textarea value={form.quote} onChange={(e) => handleChangeWrapper(e, setForm, "quote")} rows={4} placeholder="Write your experience..." />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">Rating</label>
                  <select value={form.rating} onChange={(e) => handleChangeWrapper(e, setForm, "rating")} className="px-3 py-2 border rounded">
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </div>

                <div>
                  <Button type="submit" className="bg-yellow-400 text-slate-900" disabled={submitting}>
                    {submitting ? "Sending…" : "Submit testimonial"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <AIChatToggle />
    </MainLayout>
  );

  // small helper for controlled inputs inside JSX return (keeps file self-contained)
  function handleChangeWrapper(e, setter, key) {
    const value = e?.target?.value;
    setter((s) => ({ ...s, [key]: value }));
  }
}