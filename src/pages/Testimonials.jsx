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
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const filtered = useMemo(() => {
    if (filterRole === "all") return testimonials;
    return testimonials.filter((t) => t.role.toLowerCase() === filterRole.toLowerCase());
  }, [filterRole, testimonials]);

  const metrics = [
    { label: "Total Capital Raised", value: "₵12.4M" },
    { label: "Active Investors", value: "3,200+" },
    { label: "Funded Projects", value: "48" },
  ];

  const handleChangeWrapper = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.quote) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please provide at least name and quote.",
      });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newT = {
        id: `user-${Date.now()}`,
        ...form,
        avatar: "/images/testimonials/default.jpg",
        date: new Date().toISOString().split("T")[0],
      };
      setTestimonials((prev) => [newT, ...prev]);
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
      <AIChatToggle />
      <div className="min-h-screen bg-slate-950 overflow-hidden">
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
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                FEATURED STORY
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                Community Spotlight
              </h2>
            </motion.div>

            <motion.div 
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                
                <Card className="relative bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-sm border-purple-500/20 rounded-3xl overflow-hidden">
                  <CardContent className="p-8 md:p-12">
                    <Quote className="w-16 h-16 text-purple-400/30 mb-6" />

                    <div className="flex flex-col md:flex-row items-start gap-8">
                      <div className="flex-shrink-0 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-50" />
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-purple-500/50">
                          <img
                            src={testimonials[featuredIndex]?.avatar || "/images/testimonials/default.jpg"}
                            alt={testimonials[featuredIndex]?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {testimonials[featuredIndex]?.name}
                            </h3>
                            <div className="flex items-center gap-2 text-purple-300">
                              <span>{testimonials[featuredIndex]?.role}</span>
                              <span>•</span>
                              <span>{testimonials[featuredIndex]?.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: testimonials[featuredIndex]?.rating || 5 }).map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>

                        <blockquote className="text-xl md:text-2xl text-purple-100 leading-relaxed mb-8 font-light italic">
                          "{testimonials[featuredIndex]?.quote}"
                        </blockquote>

                        <div className="flex gap-3">
                          <Button 
                            onClick={() => setFeaturedIndex((i) => (i - 1 + testimonials.length) % testimonials.length)} 
                            variant="outline"
                            className="bg-purple-900/50 border-purple-500/30 text-purple-200 hover:bg-purple-800/50 hover:text-white"
                          >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                          </Button>
                          <Button 
                            onClick={() => setFeaturedIndex((i) => (i + 1) % testimonials.length)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                      {testimonials.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setFeaturedIndex(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === featuredIndex 
                              ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' 
                              : 'w-2 bg-purple-500/30 hover:bg-purple-500/50'
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Grid + filters */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div 
              className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-2">
                  All Testimonials
                </h2>
                <p className="text-purple-300">Hear from our community members</p>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <label htmlFor="role" className="text-purple-300 font-medium">Filter by:</label>
                <select 
                  id="role" 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)} 
                  className="px-4 py-2 bg-purple-900/50 border border-purple-500/30 rounded-lg text-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="investor">Investors</option>
                  <option value="developer">Developers</option>
                </select>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {filtered.map((t, idx) => (
                <motion.div
                  key={t.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                  
                  <Card className="relative bg-gradient-to-br from-slate-900/90 to-purple-900/30 backdrop-blur-sm border-purple-500/20 rounded-2xl h-full hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-30" />
                          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-purple-500/30">
                            <img
                              src={t.avatar}
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {t.name}
                          </h3>
                          <div className="text-sm text-purple-300 mb-2">
                            {t.role} • {t.location}
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: t.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>

                      <blockquote className="text-purple-100 text-sm leading-relaxed italic">
                        "{t.quote}"
                      </blockquote>

                      <div className="mt-4 text-xs text-purple-400">
                        {new Date(t.date).toLocaleDateString("en-GB", { 
                          day: "numeric", 
                          month: "short", 
                          year: "numeric" 
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filtered.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-purple-300 text-lg">No testimonials found for this filter.</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Submit testimonial form */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <Badge className="mb-4 px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Send className="w-4 h-4 mr-2 inline" />
                  SHARE YOUR STORY
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-4">
                  Submit Your Testimonial
                </h2>
                <p className="text-purple-300 text-lg">
                  Share your experience with CrowdBricks and inspire others
                </p>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 rounded-3xl blur-2xl opacity-20" />
                
                <Card className="relative bg-gradient-to-br from-slate-900/90 to-purple-900/30 backdrop-blur-sm border-purple-500/20 rounded-3xl">
                  <CardContent className="p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                            Your Name *
                          </label>
                          <Input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={handleChangeWrapper("name")}
                            placeholder="Enter your name"
                            className="bg-slate-900/50 border-purple-500/30 text-white placeholder:text-purple-400/50 focus:ring-purple-500 focus:border-purple-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-purple-200 mb-2">
                            Your Role
                          </label>
                          <Input
                            id="role"
                            type="text"
                            value={form.role}
                            onChange={handleChangeWrapper("role")}
                            placeholder="e.g., Investor, Developer"
                            className="bg-slate-900/50 border-purple-500/30 text-white placeholder:text-purple-400/50 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-purple-200 mb-2">
                          Location
                        </label>
                        <Input
                          id="location"
                          type="text"
                          value={form.location}
                          onChange={handleChangeWrapper("location")}
                          placeholder="e.g., Accra, Ghana"
                          className="bg-slate-900/50 border-purple-500/30 text-white placeholder:text-purple-400/50 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="quote" className="block text-sm font-medium text-purple-200 mb-2">
                          Your Testimonial *
                        </label>
                        <Textarea
                          id="quote"
                          value={form.quote}
                          onChange={handleChangeWrapper("quote")}
                          placeholder="Share your experience with CrowdBricks..."
                          rows={5}
                          className="bg-slate-900/50 border-purple-500/30 text-white placeholder:text-purple-400/50 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-purple-200 mb-2">
                          Rating
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, rating: val }))}
                              className="group"
                            >
                              <Star
                                className={`h-8 w-8 transition-all duration-200 ${
                                  val <= form.rating
                                    ? "text-yellow-400 fill-yellow-400 scale-110"
                                    : "text-purple-500/30 hover:text-yellow-400/50"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-3 text-purple-300 font-medium">
                            {form.rating} / 5
                          </span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <span className="animate-pulse">Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2 inline" />
                            Submit Testimonial
                          </>
                        )}
                      </Button>

                      <p className="text-center text-sm text-purple-400">
                        Your testimonial will be reviewed before being published
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
