import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/ProjectCard";
import {
  TrendingUp,
  Users,
  Building2,
  Shield,
  Search,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { projects, platformStats } from "@/lib/data";
import AIChatToggle from "@/components/AIChatToggle";
import { motion, AnimatePresence } from "framer-motion";

/*
  Homepage.jsx - cleaned and fixed
  - Removed unused/duplicated testimonial declarations
  - Removed dead TestimonialSection component
  - Fixed missing/incorrect state variable references (use showTestimonial)
  - Fixed ProjectCard import to default
  - Kept original logic and layout, made the file renderable
*/

const testimonials = [
  {
    quote:
      "CrowdBricks made real estate investing so simple. I started small, but now I own shares in 3 different properties!",
    name: "Judith Black",
    role: "Investor",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    quote:
      "Thanks to CrowdBricks, my development project was fully funded within weeks — incredible platform!",
    name: "Kwame Boateng",
    role: "Real Estate Developer",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    quote:
      "I love how transparent and easy it is to track my investments in real-time. Highly recommend CrowdBricks.",
    name: "Ama Serwaa",
    role: "Entrepreneur",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [query, setQuery] = useState("");
  const [showTestimonial, setShowTestimonial] = useState(0);

  const featuredProjects = projects.slice(0, 3);

  const cardImages = ["/deligence.png", "/crowfunding.jpg", "/estatemaster.jpg"];

  // hero background images
  const heroImages = ["/hero1.png", "/hero2.png", "/hero3.png", "/hero4.png"];

  // auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // auto-advance testimonials every 6 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setShowTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  // client-side search/filter
  const filteredFeatured = useMemo(() => {
    if (!query.trim()) return featuredProjects;
    const term = query.toLowerCase();
    return featuredProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        (p.short_description || "").toLowerCase().includes(term)
    );
  }, [featuredProjects, query]);

  const formatCurrency = (amount) => `₵${(amount / 1000000).toFixed(1)}M`;
  const formatNumber = (num) => num.toLocaleString();

  const heroGradient = "bg-gradient-to-br from-blue-600 via-blue-400 to-white";

  return (
    <div className="min-h-screen font-sans bg-white text-slate-900 selection:bg-yellow-200 antialiased">
      {/* Hero Section */}
      <section
        className={`${heroGradient} relative py-24 lg:py-36 overflow-hidden`}
        aria-label="Hero"
      >
        {/* Background carousel */}
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Hero background ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
        </div>

        {/* Decorative SVG */}
        <svg
          className="pointer-events-none absolute right-0 top-0 -translate-y-8 translate-x-16 opacity-12 w-96 z-0"
          viewBox="0 0 600 400"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#FFD166" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <path
            fill="url(#g1)"
            d="M423.9,41.3C476.8,65,520.1,112.1,522.8,164.8c2.8,52.6-32.5,103.4-76.3,137.7C370.9,360,312.6,384.6,257,372.7
            c-55.6-11.9-118.9-58.2-148.5-99.9C67,198.4,63.7,152.3,83.4,110.6C103,68.9,156.3,40.6,212.1,33.7C267.9,26.9,371.1,17.7,423.9,41.3z"
          />
        </svg>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 text-white drop-shadow-lg">
            <Badge
              variant="secondary"
              className="text-sm px-4 py-1 rounded-full bg-white/80 border border-white/30 text-blue-800"
            >
              Ghana's Premier Real Estate Crowdfunding Platform
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Invest in Real Estate,
              <br />
              <span className="inline-block bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                One Brick at a Time
              </span>
            </h1>

            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-blue-100">
              Start with as little as ₵500 and earn passive income from verified
              real estate projects across Ghana.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/projects">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10 hover:scale-105 hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  Browse Investments
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button
                  size="lg"
                  variant="default"
                  className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-20 bg-gradient-to-br from-blue-70 via-white to-yellow-100">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Property Investment Made Simple
          </h2>

          <h4 className="text-xl text-slate-700 mb-6">
            Build Wealth Online | <span className="text-yellow-400">Capital Growth & Income </span> | Diversify Your Portfolio | National Investors Community | <span className="text-yellow-400">Build Ghana </span>
          </h4>

          <p className="text-slate-600 mb-6 leading-relaxed">
            <span className="text-blue-600 font-bold">Crowd</span>
            <span className="text-yellow-400 font-bold">Bricks</span> makes online property investment accessible to everyone, whilst helping property developers deliver more infrastructural projects and homes across Ghana. Our investment management platform allows individuals, companies and trusts to co-invest in Ghana property.
          </p>

          <p className="text-slate-600 mb-10 leading-relaxed">
            Since launching our peer to peer lending platform in 2023, we have built up vast experience and insight in this constantly evolving marketplace, which we freely share with investors and fundraisers. Flexibility, transparency and integrity are key to everything we do.
          </p>

          <Link to="/auth/login">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Login to Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-70 to-yellow-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                src="/deligence.png"
                alt="Invest Smart"
                className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
              />
              <div className="relative p-8 text-white h-full flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                <h3 className="text-2xl font-bold mb-2">Latest Blog</h3>
                <p className="text-blue-100 mb-4">
                  Learn the due diligence essentials for property crowdfunding and P2P lending investments so that you can make an informed decision.
                </p>
                <p className="text-blue-100 mb-4">
                  This article provides investors with information on how to evaluate property crowdfunding and peer to peer lending opportunities.
                </p>
                <Link
                  to="/projects"
                  className="inline-block bg-yellow-400 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all"
                >
                  Read Article
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                src="/estatemasters.jpg"
                alt="Build Together"
                className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
              />
              <div className="relative p-8 text-white h-full flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                <h3 className="text-2xl font-bold mb-2">Learn About Estate Masters</h3>
                <p className="text-blue-100 mb-4">
                  Meet the director of Estate Master, Francis Opey. He explains why it is important for them to build zero carbon ready homes.
                </p>
                <p className="text-blue-100 mb-4">
                  They are committed to providing excellent and honest services to clients. Estate Masters is an active member of GREDA.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=tW16HU7yL3Y"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-block bg-yellow-400 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                src="/crowdfunding.jpg"
                alt="Grow Wealth"
                className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
              />
              <div className="relative p-8 text-white h-full flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                <h3 className="text-2xl font-bold mb-2">What is Crowdfunding?</h3>
                <h2 className="text-2xl font-bold mb-2">Watch our introduction to Crowdfunding.</h2>
                <p className="text-blue-100 mb-4">
                  Here we talk about the concept of crowdfunding, how it works and how it can be used to raise funds for property.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=voF1plqqZJA"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-block bg-yellow-400 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all"
                >
                  Watch Video
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

  

      {/* Stats Section */}
      <section className="py-12 -mt-12 bg-blue-500">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Raised",
                value: formatCurrency(platformStats.totalRaised),
                color: "text-blue-700",
                icon: TrendingUp,
              },
              {
                label: "Active Investors",
                value: `${formatNumber(platformStats.totalInvestors)}+`,
                color: "text-blue-700",
                icon: Users,
              },
              {
                label: "Projects Funded",
                value: platformStats.totalProjects,
                color: "text-blue-700",
                icon: Building2,
              },
              {
                label: "Avg. Returns",
                value: `${platformStats.averageReturn}%`,
                color: "text-amber-500",
                icon: Shield,
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-blue-50 rounded-xl p-5 flex items-center gap-4 shadow-sm"
                >
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-70 via-white to-yellow-100">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Learn About Property Investment</h2>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Property Developers often share their knowledge and expertise with investors through the 'Learn Whilst Investing' program. Program details are shared as part of the investment pack.
          </p>
          <p className="text-slate-400 mb-10 leading-relaxed">
            So far, investors have learnt about new builds, renovations, HMOs, planning gain, commercial to residential conversions and title splits. And all through active investments.
          </p>

          <Link to="/auth/login">
            <Button
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              LOGIN TO ACCESS PROJECT INFORMATION
            </Button>
          </Link>
          <p className="text-slate-600 mt-6 leading-relaxed">Grow Your Investment Portfolio and Expand Your Property Knowledge</p>
        </div>
      </section>

      {/* Featured Projects */}
       <section className="py-20 bg-gradient-to-br from-white via-blue-70 to-yellow-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Investment Opportunities</h2>
              <p className="text-bold text-slate-900 max-w-xl font-bold">
                Curated, high-return real estate projects vetted for transparency and impact.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or description..."
                  className="w-full md:w-72 pl-10 pr-4 py-2 rounded-lg bg-white border border-blue-100 focus:ring-2 focus:ring-blue-300 outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-300" />
              </div>

              <Link to="/projects">
                <Button size="md" variant="outline" className="text-blue-700 hover:scale-105 transition-transform duration-200">
                  View All
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredFeatured.map((project) => (
              <div key={project.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                <ProjectCard project={project} featured />
              </div>
            ))}

            {filteredFeatured.length === 0 && (
              <div className="col-span-full text-center text-slate-500">
                No featured projects match your search.{" "}
                <Link to="/projects" className="text-blue-700 hover:underline">
                  Browse all projects
                </Link>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/projects">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform duration-300">
                View All Projects
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

          {/* Testimonials Section */}
      <section className="relative isolate overflow-hidden bg-blue-600 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
          <img src="/CB1.png" alt="CrowdBricks logo" className="mx-auto h-80 w-100 mb-10" />

          <AnimatePresence mode="wait">
            <motion.figure
              key={showTestimonial}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <blockquote className="text-xl sm:text-2xl font-semibold text-white">
                <p>“{testimonials[showTestimonial].quote}”</p>
              </blockquote>
              <figcaption className="mt-10">
                <img
                  src={testimonials[showTestimonial].image}
                  alt={testimonials[showTestimonial].name}
                  className="mx-auto h-12 w-12 rounded-full object-cover border-2 border-yellow-400"
                />
                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                  <div className="font-semibold text-white">
                    {testimonials[showTestimonial].name}
                  </div>
                  <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-white">
                    <circle r="1" cx="1" cy="1" />
                  </svg>
                  <div className="text-gray-400">{testimonials[showTestimonial].role}</div>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          {/* dots indicator */}
          <div className="flex justify-center mt-10 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setShowTestimonial(index)}
                aria-label={`Show testimonial ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  showTestimonial === index ? "bg-yellow-400 w-5" : "bg-gray-500 hover:bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Floating AI Chat Toggle */}
      <AIChatToggle />
    </div>
  );
};

export default Homepage;