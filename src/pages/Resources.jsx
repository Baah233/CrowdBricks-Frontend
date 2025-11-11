import React from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  BookOpen, FileText, Video, Download, CheckCircle2,
  Lightbulb, Target, Award, ArrowRight, PlayCircle,
  ExternalLink, Sparkles, GraduationCap, TrendingUp
} from "lucide-react";

const resourceCards = [
  {
    id: "r1",
    title: "Due Diligence Checklist",
    description:
      "Step-by-step checklist used by our investment team — ideal for developers and investors preparing documents.",
    image: "/equity.jpg",
    href: "https://robertsonwilliams.com/wp-content/uploads/2020/01/Due-Dilligence-Checklist.pdf",
  },
  {
    id: "r2",
    title: "Investor Pack Sample",
    description:
      "A sample investor pack showing the level of detail CrowdBricks expects for listed projects.",
    image: "/pack.jpg",
    href: "https://www.asc.ca/-/media/ASC-Documents-part-1/Regulatory-Instruments/2023/09/6102902-45-108-F1-Consolidation-Eff-June-9-2023.pdff",
  },
  {
    id: "r3",
    title: "Tax & Regulation Guide",
    description:
      "High-level guide on tax considerations when investing in Ghanaian real estate via crowdfunding.",
    image: "/tax.jpg",
    href: "https://sec.gov.gh/wp-content/uploads/Final-Regulatory-Laws/Guidelines/SEC_Crowdfunding_Guidelines_2024.pdf",
  },
];

export default function Resources() {
  const videoUrl = "https://www.youtube.com/watch?v=voF1plqqZJA";
  const secondVideoUrl = "https://www.youtube.com/watch?v=U1ZFl2N6_ek";

  return (
    <MainLayout>
      <AIChatToggle />
      <div className="min-h-screen bg-slate-950 overflow-hidden">
        {/* ANIMATED HERO - Green/Teal Education Theme */}
        <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Solid gradient background for better mobile performance */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />
          
          {/* Animated orbs - smaller and less intense on mobile */}
          <motion.div 
            className="absolute top-10 sm:top-20 left-10 sm:left-20 w-40 h-40 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-emerald-500/20 sm:bg-emerald-500/30 rounded-full blur-2xl sm:blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 h-48 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] bg-teal-500/20 sm:bg-teal-500/30 rounded-full blur-2xl sm:blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-64 sm:h-64 md:w-[400px] md:h-[400px] bg-green-500/10 sm:bg-green-500/20 rounded-full blur-2xl sm:blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          />

          {/* Tech grid pattern - hidden on mobile */}
          <div className="hidden sm:block absolute inset-0 opacity-10 sm:opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)`,
              backgroundSize: '14px 24px'
            }} />
          </div>

          {/* Floating shapes - hidden on mobile */}
          <motion.div
            className="hidden sm:block absolute top-32 right-1/4 w-2 h-2 bg-emerald-400"
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="hidden sm:block absolute bottom-40 left-1/4 w-3 h-3 bg-teal-400 rotate-45"
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
              <Badge className="mb-4 sm:mb-6 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-none shadow-2xl text-xs sm:text-sm">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 inline" />
                LEARNING CENTER
              </Badge>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 text-white">
                Knowledge is Power
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-emerald-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                Master real estate crowdfunding with our comprehensive guides, videos, and resources
              </p>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8 sm:mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Link to="/raise" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg hover:from-emerald-700 hover:to-teal-700">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Start Your Raise
                  </Button>
                </Link>
                <Button variant="outline" className="w-full sm:w-auto bg-emerald-900/50 border-emerald-500/30 text-emerald-200 font-bold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg hover:bg-emerald-800/50">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Browse Resources
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

        {/* What is Crowdfunding Section */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Lightbulb className="w-4 h-4 mr-2 inline" />
                GETTING STARTED
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">
                What is Crowdfunding?
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
                  <p className="text-emerald-100 text-lg leading-relaxed mb-4">
                    Crowdfunding is the practice of funding a project or business by raising money from the public. Simple Crowdfunding specialises in Property Crowdfunding and Peer to Peer Lending.
                  </p>
                  <p className="text-emerald-100 text-lg leading-relaxed mb-4">
                    We connect investors and property professionals through our platform, enabling companies to successfully grow and reach their property ambitions while investors build wealth portfolios online simply.
                  </p>
                  <ul className="space-y-3 mt-6">
                    <li className="flex items-start gap-3 text-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Direct access to vetted property projects</span>
                    </li>
                    <li className="flex items-start gap-3 text-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Lower investment minimums than traditional real estate</span>
                    </li>
                    <li className="flex items-start gap-3 text-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Diversify your portfolio across multiple projects</span>
                    </li>
                    <li className="flex items-start gap-3 text-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Transparent reporting and regular updates</span>
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                  
                  <Card className="relative bg-gradient-to-br from-slate-900/90 to-emerald-900/30 backdrop-blur-sm border-emerald-500/20 rounded-2xl overflow-hidden">
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative"
                    >
                      <div className="relative aspect-video">
                        <img
                          src="/achieve.jpg"
                          alt="Watch Introduction to Crowdfunding"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                        
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-2xl">
                            <PlayCircle className="w-10 h-10 text-white" />
                          </div>
                        </motion.div>
                      </div>
                    </a>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Video className="w-5 h-5 text-emerald-400" />
                        Introduction to Crowdfunding
                      </h4>
                      <p className="text-emerald-300 text-sm">
                        Watch this short video to understand how property crowdfunding works on CrowdBricks
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Crowdfunding vs P2P Section */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Target className="w-4 h-4 mr-2 inline" />
                UNDERSTAND THE DIFFERENCE
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">
                Crowdfunding vs P2P Lending
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                  
                  <Card className="relative bg-gradient-to-br from-slate-900/90 to-emerald-900/30 backdrop-blur-sm border-emerald-500/20 rounded-2xl overflow-hidden">
                    <a
                      href={secondVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative"
                    >
                      <div className="relative aspect-video">
                        <img
                          src="/growth.jpg"
                          alt="Watch Crowdfunding vs P2P Lending"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                        
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-2xl">
                            <PlayCircle className="w-10 h-10 text-white" />
                          </div>
                        </motion.div>
                      </div>
                    </a>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Video className="w-5 h-5 text-emerald-400" />
                        Equity vs P2P Lending
                      </h4>
                      <p className="text-emerald-300 text-sm">
                        Learn the key differences and choose the right funding model for your project
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              <motion.div
                className="order-1 lg:order-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-emerald-100 text-lg leading-relaxed mb-4">
                    We often get asked about the difference between Equity and Peer to Peer Lending when raising property finance. Understanding these models is crucial for both investors and developers.
                  </p>
                  <p className="text-emerald-100 text-lg leading-relaxed mb-4">
                    In this video, we explain the core differences between the two funding models and the nuances that you should be aware of when deciding which route to take.
                  </p>
                  <ul className="space-y-3 mt-6">
                    <li className="flex items-start gap-3 text-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Equity crowdfunding offers ownership stakes</span>
                    </li>
                    <li className="flex items-start gap-3 text-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>P2P lending provides fixed returns with less risk</span>
                    </li>
                    <li className="flex items-start gap-3 text-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Choose based on your risk appetite and goals</span>
                    </li>
                    <li className="flex items-start gap-3 text-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Both models have proven success on our platform</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Resource Cards Section */}
        <section id="cards" className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <FileText className="w-4 h-4 mr-2 inline" />
                DOWNLOADABLE RESOURCES
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200 mb-4">
                Guides & Templates
              </h2>
              <p className="text-emerald-300 text-lg max-w-2xl mx-auto">
                Professional templates and reference materials to streamline your investment or fundraising journey
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {resourceCards.map((resource, idx) => (
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
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                  
                  <Card className="relative bg-gradient-to-br from-slate-900/90 to-emerald-900/30 backdrop-blur-sm border-emerald-500/20 rounded-2xl overflow-hidden h-full hover:scale-105 transition-transform duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={resource.image}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                      
                      {/* Icon badge */}
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                          {idx === 0 && <FileText className="w-5 h-5 text-white" />}
                          {idx === 1 && <BookOpen className="w-5 h-5 text-white" />}
                          {idx === 2 && <Award className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-emerald-200 text-sm mb-4 leading-relaxed">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-medium">
                          <Download className="w-4 h-4" />
                          <span className="text-sm">Download</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <motion.div
              className="relative max-w-5xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl blur-3xl opacity-20" />
              
              <Card className="relative bg-gradient-to-br from-emerald-900/50 to-teal-900/30 backdrop-blur-sm border-emerald-500/30 rounded-3xl overflow-hidden">
                <CardContent className="p-12 text-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>

                  <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200 mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of investors and developers who are building their future with CrowdBricks
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/raise">
                      <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-8 py-6 text-lg hover:from-emerald-700 hover:to-teal-700">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Start Your Raise
                      </Button>
                    </Link>
                    <Link to="/projects">
                      <Button variant="outline" className="bg-emerald-900/50 border-emerald-500/30 text-emerald-200 font-bold px-8 py-6 text-lg hover:bg-emerald-800/50">
                        <Target className="w-5 h-5 mr-2" />
                        Browse Projects
                      </Button>
                    </Link>
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
