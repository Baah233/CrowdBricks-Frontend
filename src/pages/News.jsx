import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Calendar, ArrowRight, Sparkles, TrendingUp, Users, Award, Clock, X, Mail, CheckCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";

const sampleNews = [
  {
    id: "1",
    slug: "platform-launch-accra",
    title:
      "CrowdBricks Launches in Accra — Opening Access to Property Investment",
    date: "2024-08-12",
    category: "Platform News",
    excerpt:
      "We’re excited to announce the public launch of CrowdBricks in Accra. Our platform allows investors to start from ₵500 and invest in vetted real estate projects across Ghana.",
    image: "/Due deligence.jpg",
  },
  {
    id: "2",
    slug: "estate-masters-partnership",
    title: "Estate Masters Partnership: Zero Carbon Ready Homes",
    date: "2024-09-05",
    category: "Partnerships",
    excerpt:
      "We’ve partnered with Estate Masters to deliver energy efficient homes. Developers will list projects that prioritise long-term value and sustainability.",
    image: "/Fundraiser benefit.jpg",
  },
  {
    id: "3",
    slug: "investor-education-series",
    title: "Investor Education Series — Webinars & Guides",
    date: "2024-10-02",
    category: "Education",
    excerpt:
      "Sign up for our free 'Learn Whilst Investing' webinars — topics include due diligence, tax considerations and portfolio diversification.",
    image: "/images/news/investor-benefit.jpg",
  },
  {
    id: "4",
    slug: "quarterly-report",
    title: "Quarterly Report: Platform Performance & Returns",
    date: "2024-12-01",
    category: "Reports",
    excerpt:
      "Read our Q4 report covering platform performance, returns paid, and a selection of highlighted projects.",
    image: "/images/news/property-market.jpg",
  },
];

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(() => {
    // Check localStorage for subscription status
    return localStorage.getItem('newsletter_subscribed') === 'true';
  });
  const [subscribedEmail, setSubscribedEmail] = useState(() => {
    return localStorage.getItem('newsletter_email') || '';
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get("/news");
      const newsData = Array.isArray(response.data) ? response.data : [];
      setNews(newsData);
      if (newsData.length > 0 && !selectedId) {
        setSelectedId(newsData[0].id);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedArticle = useMemo(
    () => news.find((n) => n.id === selectedId) || news[0],
    [selectedId, news]
  );

  // Pick other articles (different from selected)
  const otherArticles = useMemo(
    () => news.filter((n) => n.id !== selectedId),
    [selectedId, news]
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await api.post("/newsletter/subscribe", { email });
      setSubmitStatus("success");
      setSuccessMessage(response.data.message || "Successfully subscribed!");
      
      // Save subscription status to localStorage
      localStorage.setItem('newsletter_subscribed', 'true');
      localStorage.setItem('newsletter_email', email);
      setIsSubscribed(true);
      setSubscribedEmail(email);
      
      setEmail("");
      setTimeout(() => {
        setShowNewsletterModal(false);
        setSubmitStatus(null);
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterUnsubscribe = async () => {
    if (!subscribedEmail) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await api.post("/newsletter/unsubscribe", { email: subscribedEmail });
      setSubmitStatus("success");
      setSuccessMessage(response.data.message || "Successfully unsubscribed!");
      
      // Remove subscription status from localStorage
      localStorage.removeItem('newsletter_subscribed');
      localStorage.removeItem('newsletter_email');
      setIsSubscribed(false);
      setSubscribedEmail("");
      
      setTimeout(() => {
        setShowNewsletterModal(false);
        setSubmitStatus(null);
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error("Newsletter unsubscription error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>News & Updates | CrowdBricks - Real Estate Investment Platform</title>
        <meta name="description" content="Stay up to date with CrowdBricks platform announcements, developer news, partnership updates, and real estate investment insights across Ghana." />
        <meta name="keywords" content="CrowdBricks news, real estate news Ghana, property investment updates, platform announcements, developer news" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="News & Updates | CrowdBricks" />
        <meta property="og:description" content="Stay up to date with platform announcements, developer news, and investment insights" />
        <meta property="og:image" content={`${window.location.origin}/Due deligence.jpg`} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content="News & Updates | CrowdBricks" />
        <meta property="twitter:description" content="Stay up to date with platform announcements, developer news, and investment insights" />
        <meta property="twitter:image" content={`${window.location.origin}/Due deligence.jpg`} />
      </Helmet>

      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        {/* Global fintech background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          {/* Tech grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
          </div>
        </div>

        {/* ===== MODERN HERO SECTION ===== */}
        <section
          aria-label="News hero"
          className="relative isolate overflow-hidden"
        >
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-30 animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20 animation-delay-4000"></div>
          </div>

          <div className="absolute inset-0 -z-10 overflow-hidden">
            <picture>
              <source srcSet="/Crowdbricks_news.jpg" type="image/webp" />
              <img
                src="/Crowdbricks_news.jpg"
                alt="News hero background"
                className="w-full h-full object-cover object-center opacity-10"
                loading="lazy"
              />
            </picture>
          </div>

          <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  <Newspaper className="w-3 h-3" />
                  Latest News & Updates
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                  CrowdBricks
                </span>{" "}
                Newsroom
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
              >
                Stay up to date with platform announcements, developer news, and investment insights
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center items-center gap-8 mt-12 text-white/80 text-sm"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                  <span>Weekly Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-yellow-400" />
                  <span>Industry Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>Platform Milestones</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      {/* ===== MAIN CONTENT SECTION ===== */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-yellow-400 mb-4" />
              <p className="text-blue-200 text-lg">Loading news articles...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/40 backdrop-blur-md rounded-2xl p-12 border-2 border-white/10">
              <Newspaper className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No News Yet</h3>
              <p className="text-blue-200">Check back soon for updates and announcements!</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Featured article */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Article */}
              {selectedArticle && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={selectedArticle.image || "/placeholder-news.jpg"}
                    alt={selectedArticle.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-yellow-500/30">
                      Featured Story
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/20">
                    <div className="flex items-center gap-2 text-sm text-white font-semibold">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      {formatDate(selectedArticle.published_at || selectedArticle.created_at)}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="inline-block bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm font-semibold mb-4 border border-blue-400/30 backdrop-blur-sm">
                    {selectedArticle.category || "News"}
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight group-hover:text-yellow-400 transition-colors">
                    {selectedArticle.title}
                  </h2>
                  
                  <p className="text-lg text-blue-200 leading-relaxed mb-6">
                    {selectedArticle.excerpt}
                  </p>

                  <Link to={`/news/${selectedArticle.slug}`}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 px-8 py-6 text-lg font-bold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all hover:scale-105 rounded-xl group/btn"
                    >
                      Read Full Article
                      <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.article>
              )}

              {/* Other Articles Grid */}
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-yellow-400" />
                  More News
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {otherArticles.slice(0, 4).map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/10 hover:border-yellow-400/50"
                    >
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={article.image || "/placeholder-news.jpg"}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                        <div className="absolute top-3 left-3">
                          <span className="inline-block bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md text-blue-300 border border-blue-400/30 px-3 py-1 rounded-lg text-xs font-bold shadow">
                            {article.category || "News"}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-blue-200 mb-3">
                          <Clock className="w-3 h-3 text-yellow-400" />
                          {formatDate(article.published_at || article.created_at)}
                        </div>

                        <h4 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                          {article.title}
                        </h4>

                        <p className="text-sm text-blue-200 line-clamp-3 mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>

                        <Link to={`/news/${article.slug}`}>
                          <Button
                            variant="outline"
                            className="w-full border-2 border-white/10 text-white hover:bg-gradient-to-r hover:from-yellow-400 hover:to-amber-500 hover:text-slate-900 hover:border-transparent font-semibold rounded-xl transition-all group/btn shadow-lg"
                          >
                            Read More
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Sidebar */}
            <aside className="space-y-6">
              {/* All News List */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-800/40 backdrop-blur-md rounded-2xl border-2 border-white/10 shadow-2xl p-6 sticky top-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <Newspaper className="w-5 h-5 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-black text-white">
                    All Articles
                  </h3>
                </div>

                <ul className="space-y-3">
                  {news.map((n) => (
                    <li
                      key={n.id}
                      className={`rounded-xl transition-all cursor-pointer ${
                        selectedId === n.id
                          ? "bg-gradient-to-r from-yellow-400/20 to-amber-500/20 ring-2 ring-yellow-400/50 shadow-md border border-yellow-400/30"
                          : "hover:bg-white/5 border border-white/5"
                      }`}
                      onClick={() => setSelectedId(n.id)}
                    >
                      <Link to={`/news/${n.slug}`} className="flex flex-col p-4">
                        <span className={`text-sm font-bold mb-2 line-clamp-2 ${
                          selectedId === n.id ? "text-yellow-400" : "text-white"
                        }`}>
                          {n.title}
                        </span>
                        <div className={`flex items-center gap-2 text-xs ${
                          selectedId === n.id ? "text-yellow-300" : "text-blue-200"
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {formatDate(n.published_at || n.created_at)}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t-2 border-white/10">
                  <Link
                    to="/news/archive"
                    className="flex items-center justify-center gap-2 text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors group"
                  >
                    View Archive
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>

              {/* Newsletter CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-slate-800/60 backdrop-blur-md rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden border-2 border-white/10"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '30px 30px'
                  }} />
                </div>

                <div className="relative z-10">
                  <Sparkles className="w-8 h-8 text-yellow-400 mb-4" />
                  <h4 className="text-xl font-black mb-3">
                    {isSubscribed ? 'Newsletter' : 'Stay Updated'}
                  </h4>
                  <p className="text-sm text-blue-200 mb-4 leading-relaxed">
                    {isSubscribed 
                      ? `Subscribed as ${subscribedEmail}` 
                      : 'Get the latest news and insights delivered to your inbox'
                    }
                  </p>
                  <Button
                    onClick={() => setShowNewsletterModal(true)}
                    className={`w-full font-bold rounded-xl shadow-lg transition-all hover:scale-105 ${
                      isSubscribed 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-red-500/50'
                        : 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 hover:shadow-yellow-500/50'
                    }`}
                  >
                    {isSubscribed ? 'Unsubscribe' : 'Subscribe Now'}
                  </Button>
                </div>
              </motion.div>
            </aside>
          </div>
          )}
        </div>
      </section>

      {/* ===== NEWSLETTER MODAL ===== */}
      <AnimatePresence>
        {showNewsletterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewsletterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-slate-900 border-2 border-white/20 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-br from-slate-800/80 via-blue-900/60 to-slate-800/80 p-6 text-white relative overflow-hidden border-b-2 border-white/10">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '30px 30px'
                  }} />
                </div>
                
                <button
                  onClick={() => setShowNewsletterModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
                    <Mail className="w-6 h-6 text-slate-900" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">
                    {isSubscribed ? 'Manage Subscription' : 'Stay in the Loop'}
                  </h3>
                  <p className="text-sm text-blue-200">
                    {isSubscribed 
                      ? 'You are currently subscribed to our newsletter. You can unsubscribe anytime.'
                      : 'Get exclusive insights, market updates, and new investment opportunities delivered straight to your inbox.'
                    }
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-slate-900/50 backdrop-blur-sm">
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
                      isSubscribed ? 'bg-green-500/20 border-green-400/50' : 'bg-blue-500/20 border-blue-400/50'
                    }`}>
                      <CheckCircle className={`w-8 h-8 ${isSubscribed ? 'text-green-400' : 'text-blue-400'}`} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {isSubscribed ? 'You\'re Subscribed!' : 'Unsubscribed Successfully!'}
                    </h4>
                    <p className="text-sm text-blue-200">
                      {successMessage}
                    </p>
                  </motion.div>
                ) : isSubscribed ? (
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 border-2 border-blue-400/30 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm font-semibold text-white mb-1">Current subscription:</p>
                      <p className="text-sm text-blue-300 font-mono">{subscribedEmail}</p>
                    </div>

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border-2 border-red-400/30 rounded-xl p-3 text-sm text-red-300 backdrop-blur-sm"
                      >
                        Something went wrong. Please try again.
                      </motion.div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowNewsletterModal(false)}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-white/20 text-white font-bold hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleNewsletterUnsubscribe}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-red-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isSubmitting ? "Unsubscribing..." : "Unsubscribe"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="newsletter-email" className="block text-sm font-bold text-white mb-2">
                        Email Address
                      </label>
                      <input
                        id="newsletter-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10 transition-all outline-none text-white placeholder:text-blue-300"
                      />
                    </div>

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border-2 border-red-400/30 rounded-xl p-3 text-sm text-red-300 backdrop-blur-sm"
                      >
                        Something went wrong. Please try again.
                      </motion.div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => setShowNewsletterModal(false)}
                        className="flex-1 bg-white/5 hover:bg-white/10 border-2 border-white/20 text-white font-bold rounded-xl transition-all"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-yellow-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </div>

                    <p className="text-xs text-blue-200 text-center">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      <AIChatToggle />
    </MainLayout>
  );
}
