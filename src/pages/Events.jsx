import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, MapPin, Users, Video, FileText, Award,
  Clock, ArrowRight, Zap, Target, CheckCircle2, PlayCircle,
  TrendingUp, Sparkles, ExternalLink
} from "lucide-react";

const sampleEvents = [
  {
    id: "e1",
    slug: "investor-webinar-intro-to-crowdfunding",
    title: "Investor Webinar — Intro to Property Crowdfunding",
    date: "2025-11-12T18:00:00.000Z",
    location: "Accra — Hybrid (Online & In-person)",
    excerpt:
      "A 60-minute webinar introducing property crowdfunding, due diligence basics and the CrowdBricks platform. Ideal for first-time investors.",
    image: "/images/events/webinar-1.jpg",
    seats: 150,
    registered: 48,
    ticketUrl: "/events/register/investor-webinar",
  },
  {
    id: "e2",
    slug: "developer-masterclass-funding-structuring",
    title: "Developer Masterclass — Funding & Structuring Projects",
    date: "2025-12-03T10:00:00.000Z",
    location: "Kumasi — In-person",
    excerpt:
      "Practical sessions for developers: preparing an investor pack, modelling returns and structuring tranches for crowdfunding.",
    image: "/images/events/masterclass-1.jpg",
    seats: 60,
    registered: 12,
    ticketUrl: "/events/register/developer-masterclass",
  },
  {
    id: "e3",
    slug: "learn-while-investing-workshop",
    title: "Learn-Whilst-Investing Workshop — Site Visit & Q&A",
    date: "2026-01-15T09:00:00.000Z",
    location: "Accra — Site Visit",
    excerpt:
      "Join a guided site visit to a live project and a panel Q&A with the developer and CrowdBricks investment team.",
    image: "/images/events/site-visit.jpg",
    seats: 40,
    registered: 5,
    ticketUrl: "/events/register/site-visit",
  },
  {
    id: "e4",
    slug: "tax-and-compliance-for-investors",
    title: "Tax & Compliance for Investors",
    date: "2026-02-10T16:00:00.000Z",
    location: "Online",
    excerpt:
      "Understand tax implications and reporting for Ghanaian real estate investments. Practical examples and FAQs.",
    image: "/images/events/tax-webinar.jpg",
    seats: 200,
    registered: 0,
    ticketUrl: "/events/register/tax-webinar",
  },
];

const resourcesCards = [
  {
    id: "r1",
    title: "Due Diligence Checklist",
    description: "Step-by-step checklist used by our investment team to assess projects.",
    image: "/equity.jpg",
    href: "https://robertsonwilliams.com/wp-content/uploads/2020/01/Due-Dilligence-Checklist.pdf",
  },
  {
    id: "r2",
    title: "How to Prepare an Investor Pack",
    description: "Template and notes for developers preparing a pack for investors.",
    image: "/pack.jpg",
    href: "https://www.asc.ca/-/media/ASC-Documents-part-1/Regulatory-Instruments/2023/09/6102902-45-108-F1-Consolidation-Eff-June-9-2023.pdf",
  },
  {
    id: "r3",
    title: "Crowdfunding Basics Video",
    description: "Short overview video covering the crowdfunding process on CrowdBricks.",
    image: "/t2.jpg",
    href: "https://www.youtube.com/watch?v=Z4jwHGwTbtM",
  },
];

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function Events() {
  const [selectedId, setSelectedId] = useState(sampleEvents[0].id);
  const selectedEvent = useMemo(() => {
    return sampleEvents.find((e) => e.id === selectedId) || sampleEvents[0];
  }, [selectedId]);

  const videoUrl = "https://www.youtube.com/embed/Z4jwHGwTbtM";

  return (
    <MainLayout>
      <AIChatToggle />
      <div className="min-h-screen bg-slate-950 overflow-hidden">
        {/* ANIMATED HERO - Orange/Amber Energy Theme */}
        <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Solid gradient background for better mobile performance */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-orange-800 to-amber-900" />
          
          {/* Animated orbs - smaller and less intense on mobile */}
          <motion.div 
            className="absolute top-10 sm:top-20 left-10 sm:left-20 w-40 h-40 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-orange-500/20 sm:bg-orange-500/30 rounded-full blur-2xl sm:blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 h-48 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] bg-amber-500/20 sm:bg-amber-500/30 rounded-full blur-2xl sm:blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-64 sm:h-64 md:w-[400px] md:h-[400px] bg-yellow-500/10 sm:bg-yellow-500/20 rounded-full blur-2xl sm:blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          />

          {/* Tech grid pattern - hidden on mobile */}
          <div className="hidden sm:block absolute inset-0 opacity-10 sm:opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.2) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(251, 146, 60, 0.2) 1px, transparent 1px)`,
              backgroundSize: '14px 24px'
            }} />
          </div>

          {/* Floating shapes - hidden on mobile */}
          <motion.div
            className="hidden sm:block absolute top-32 right-1/4 w-2 h-2 bg-orange-400"
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="hidden sm:block absolute bottom-40 left-1/4 w-3 h-3 bg-amber-400 rotate-45"
            animate={{
              y: [0, 20, 0],
              rotate: [45, 90, 45],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Content */}
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto py-12 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 sm:mb-6 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white border-none shadow-2xl text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 inline" />
                EVENTS & TRAINING
              </Badge>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 text-white">
                Learn, Network, Grow
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-orange-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                Join our community events, training sessions, and workshops to master real estate crowdfunding
              </p>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-8 py-6 text-lg hover:from-orange-700 hover:to-amber-700">
                  <Calendar className="w-5 h-5 mr-2" />
                  View All Events
                </Button>
                <Button variant="outline" className="bg-orange-900/50 border-orange-500/30 text-orange-200 font-bold px-8 py-6 text-lg hover:bg-orange-800/50">
                  <Video className="w-5 h-5 mr-2" />
                  Watch Training
                </Button>
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

        {/* Main Events Section */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-orange-500/20 text-orange-300 border border-orange-500/30">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                UPCOMING EVENTS
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-200">
                Don't Miss Out
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured Event - 2 columns */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                  
                  <Card className="relative bg-gradient-to-br from-slate-900/90 to-orange-900/50 backdrop-blur-sm border-orange-500/20 rounded-3xl overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                      
                      {/* Floating badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                          <Award className="w-4 h-4 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-8">
                      <h3 className="text-3xl font-black text-white mb-4">
                        {selectedEvent.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-orange-300">
                          <Calendar className="w-5 h-5" />
                          <span>{formatDate(selectedEvent.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-300">
                          <MapPin className="w-5 h-5" />
                          <span>{selectedEvent.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-300">
                          <Users className="w-5 h-5" />
                          <span>{selectedEvent.registered} / {selectedEvent.seats} Registered</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-300">
                          <Clock className="w-5 h-5" />
                          <span>
                            {selectedEvent.seats - selectedEvent.registered > 0 
                              ? `${selectedEvent.seats - selectedEvent.registered} seats left`
                              : 'Fully Booked'}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-6">
                        <div className="w-full bg-slate-800 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(selectedEvent.registered / selectedEvent.seats) * 100}%` }}
                          />
                        </div>
                        <p className="text-sm text-orange-400 mt-2">
                          {Math.round((selectedEvent.registered / selectedEvent.seats) * 100)}% Full
                        </p>
                      </div>

                      <p className="text-orange-100 text-lg mb-6 leading-relaxed">
                        {selectedEvent.excerpt}
                      </p>

                      <div className="flex gap-3">
                        <Button className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold hover:from-orange-700 hover:to-amber-700">
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Register Now
                        </Button>
                        <Button variant="outline" className="bg-orange-900/50 border-orange-500/30 text-orange-200 hover:bg-orange-800/50">
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Sidebar List - 1 column */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-slate-900/90 to-orange-900/30 backdrop-blur-sm border-orange-500/20 rounded-2xl">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-400" />
                      All Events
                    </h3>

                    <div className="space-y-3">
                      {sampleEvents.map((evt) => (
                        <button
                          key={evt.id}
                          onClick={() => setSelectedId(evt.id)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                            evt.id === selectedId
                              ? 'bg-gradient-to-r from-orange-600/30 to-amber-600/30 border-2 border-orange-500/50'
                              : 'bg-slate-800/50 border-2 border-transparent hover:border-orange-500/30 hover:bg-slate-800'
                          }`}
                        >
                          <div className="text-sm font-bold text-white mb-1 line-clamp-2">
                            {evt.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-orange-300">
                            <Clock className="w-3 h-3" />
                            {new Date(evt.date).toLocaleDateString("en-GB", {
                              month: "short",
                              day: "numeric"
                            })}
                          </div>
                        </button>
                      ))}
                    </div>

                    <Link to="/events/all">
                      <Button className="w-full mt-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700">
                        View All Events
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Training & Resources */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-orange-500/20 text-orange-300 border border-orange-500/30">
                <Video className="w-4 h-4 mr-2 inline" />
                TRAINING RESOURCES
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-200">
                Learn At Your Pace
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Master Real Estate Investment
                  </h3>
                  <p className="text-orange-100 text-lg leading-relaxed mb-4">
                    Access our comprehensive training library covering everything from crowdfunding basics to advanced investment strategies.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-orange-200">
                      <CheckCircle2 className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Video tutorials and webinar recordings</span>
                    </li>
                    <li className="flex items-start gap-3 text-orange-200">
                      <CheckCircle2 className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Downloadable guides and checklists</span>
                    </li>
                    <li className="flex items-start gap-3 text-orange-200">
                      <CheckCircle2 className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Live Q&A sessions with experts</span>
                    </li>
                    <li className="flex items-start gap-3 text-orange-200">
                      <CheckCircle2 className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Case studies from successful projects</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                  
                  <Card className="relative bg-gradient-to-br from-slate-900/90 to-orange-900/30 backdrop-blur-sm border-orange-500/20 rounded-2xl overflow-hidden">
                    <div className="relative aspect-video">
                      <iframe
                        src={videoUrl}
                        title="Training Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Getting Started with CrowdBricks
                      </h4>
                      <p className="text-orange-300 text-sm">
                        Watch this comprehensive introduction to our platform and learn how to start your investment journey.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Resource Cards */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-orange-500/20 text-orange-300 border border-orange-500/30">
                <FileText className="w-4 h-4 mr-2 inline" />
                HELPFUL RESOURCES
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-200">
                Downloads & Guides
              </h2>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {resourcesCards.map((resource, idx) => (
                <motion.a
                  key={resource.id}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                  
                  <Card className="relative bg-gradient-to-br from-slate-900/90 to-orange-900/30 backdrop-blur-sm border-orange-500/20 rounded-2xl overflow-hidden h-full hover:scale-105 transition-transform duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={resource.image}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                      
                      {/* Icon badge */}
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-orange-200 text-sm mb-4 leading-relaxed">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-2 text-orange-400 font-medium">
                        <span>Learn More</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-orange-500/20 text-orange-300 border border-orange-500/30">
                <Target className="w-4 h-4 mr-2 inline" />
                FREQUENTLY ASKED
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-200">
                Event Questions
              </h2>
            </motion.div>

            <motion.div 
              className="max-w-3xl mx-auto space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                {
                  q: "Do I need to be an investor or developer to attend events?",
                  a: "No, our events are open to everyone interested in real estate crowdfunding. Whether you're considering becoming an investor, a developer seeking funding, or just curious about the model, you're welcome to join."
                },
                {
                  q: "Are events free?",
                  a: "Most webinars and online sessions are free. Some in-person masterclasses or site visits may have a nominal fee to cover materials and refreshments. Check the specific event page for details."
                },
                {
                  q: "Will I receive a certificate for training sessions?",
                  a: "Yes, participants who complete our full training programmes receive a certificate of completion. This demonstrates your understanding of property crowdfunding and due diligence best practices."
                }
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gradient-to-br from-slate-900/90 to-orange-900/30 backdrop-blur-sm border-orange-500/20 rounded-xl hover:border-orange-500/40 transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm font-black">{idx + 1}</span>
                        </div>
                        {faq.q}
                      </h3>
                      <p className="text-orange-200 leading-relaxed ml-9">
                        {faq.a}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Host Event CTA */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="relative max-w-5xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-3xl blur-3xl opacity-20" />
              
              <Card className="relative bg-gradient-to-br from-orange-900/50 to-amber-900/30 backdrop-blur-sm border-orange-500/30 rounded-3xl overflow-hidden">
                <CardContent className="p-12 text-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Zap className="w-10 h-10 text-white" />
                  </motion.div>

                  <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-200 mb-4">
                    Want to Host an Event?
                  </h2>
                  <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Partner with CrowdBricks to organize training sessions, workshops, or networking events in your area.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-8 py-6 text-lg hover:from-orange-700 hover:to-amber-700">
                      <Users className="w-5 h-5 mr-2" />
                      Contact Us
                    </Button>
                    <Button variant="outline" className="bg-orange-900/50 border-orange-500/30 text-orange-200 font-bold px-8 py-6 text-lg hover:bg-orange-800/50">
                      <FileText className="w-5 h-5 mr-2" />
                      Event Guidelines
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
