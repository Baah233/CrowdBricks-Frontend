import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ProjectCard";
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

/*
  Updated Homepage:
  - Core color palette tightened to white / blue / yellow for a brighter look.
  - Added lightweight client-side search and subtle motion.
  - Added AIChatToggle component (floating AI assistant) for intelligent help.
  - All logic/data usage remains unchanged (featuredProjects still projects.slice(0,3)).
*/

const Homepage = () => {
  const [query, setQuery] = useState("");
  const [showTestimonial, setShowTestimonial] = useState(0);

  const featuredProjects = projects.slice(0, 3);

  // client-side search/filter for discoverability (purely UI)
  const filteredFeatured = useMemo(() => {
    if (!query.trim()) return featuredProjects;
    const term = query.toLowerCase();
    return featuredProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        (p.short_description || "").toLowerCase().includes(term)
    );
  }, [featuredProjects, query]);

  const testimonials = [
    {
      name: "Akua Mensah",
      quote:
        "I started with ₵500 and now receive quarterly returns. Crowdbricks made investing simple and safe.",
    },
    {
      name: "Kwame Asare",
      quote:
        "Transparent project details and clear timelines — the vetting gives me confidence.",
    },
    {
      name: "Nana Yaa",
      quote:
        "Fast onboarding and excellent support. I love the fractional ownership model.",
    },
  ];

  const formatCurrency = (amount) => `₵${(amount / 1000000).toFixed(1)}M`;
  const formatNumber = (num) => num.toLocaleString();

  // brighter blue-to-white hero with yellow CTA accents
  const heroGradient =
    "bg-gradient-to-br from-blue-600 via-blue-400 to-white";

  return (
    <div className="min-h-screen font-sans bg-white text-slate-900 selection:bg-yellow-200 antialiased">
      {/* Hero Section */}
      <section
        className={`${heroGradient} relative py-24 lg:py-36 overflow-hidden`}
        aria-label="Hero"
      >
        <svg
          className="pointer-events-none absolute right-0 top-0 -translate-y-8 translate-x-16 opacity-12 w-96"
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

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge
              variant="secondary"
              className="text-sm px-4 py-1 rounded-full bg-white/80 border border-white/30 text-blue-800"
            >
              Ghana's Premier Real Estate Crowdfunding Platform
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-slate-900">
              Invest in Real Estate,
              <br />
              <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                One Brick at a Time
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Start with as little as ₵500 and earn passive income from verified
              real estate projects across Ghana.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/projects" aria-label="Browse Projects">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-blue-700 border-blue-200 hover:scale-105 hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  Browse Projects
                </Button>
              </Link>
              <Link to="/auth/register" aria-label="Get Started">
                <Button
                  size="lg"
                  variant="default"
                  className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* quick CTA card */}
            <div className="mt-8 mx-auto max-w-3xl">
              <div className="mx-auto bg-white/90 backdrop-blur-md border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-yellow-100">
                    <DollarSign className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-800">Quick Invest</div>
                    <div className="text-sm text-slate-600">
                      Start with ₵500 — diversify across multiple projects
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex gap-3">
                  <Link to="/projects">
                    <Button size="sm" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                      Invest Now
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-4 py-2 text-blue-700"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-12">
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

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Featured Investment Opportunities
              </h2>
              <p className="text-bold text-slate-900 max-w-xl font-bold">
                Curated, high-return real estate projects vetted for transparency
                and impact.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <label htmlFor="search" className="sr-only">
                  Search featured projects
                </label>
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or description..."
                  className="w-full md:w-72 pl-10 pr-4 py-2 rounded-lg bg-white border border-blue-100 focus:ring-2 focus:ring-blue-300 outline-none"
                  aria-label="Search featured projects"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-300" />
              </div>

              <Link to="/projects">
                <Button
                  size="md"
                  variant="outline"
                  className="text-blue-700 hover:scale-105 transition-transform duration-200"
                >
                  View All
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredFeatured.map((project) => (
              <div
                key={project.id}
                className="transform hover:-translate-y-2 transition-transform duration-300"
              >
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
              <Button
                size="lg"
                variant="outline"
                className="hover:scale-105 transition-transform duration-300"
              >
                View All Projects
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white/95 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Crowdbricks Works
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              Invest in verified real estate projects in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "1. Browse & Research",
                text:
                  "Explore verified projects with transparent details and expected ROI.",
              },
              {
                icon: DollarSign,
                title: "2. Invest Securely",
                text:
                  "Choose your amount, pay via Momo or bank, and own fractional shares.",
              },
              {
                icon: TrendingUp,
                title: "3. Earn Returns",
                text:
                  "Track performance, receive dividends, and grow your portfolio.",
              },
            ].map((step, i) => (
              <Card
                key={i}
                className="text-center p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-100">
                    <step.icon className="h-8 w-8 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section + Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-blue-700" /> Why Choose Crowdbricks?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "SEC-Compliant Platform",
                    desc:
                      "Regulated under Ghana's Securities & Exchange Commission.",
                  },
                  {
                    icon: Users,
                    title: "Verified Developers",
                    desc:
                      "All developers undergo strict vetting and project checks.",
                  },
                  {
                    icon: Building2,
                    title: "Quality Projects",
                    desc: "We assess every project for profitability and risk.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Transparent Returns",
                    desc: "Clear data on ROI, timeline, and risk levels.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                      <item.icon className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-slate-600 text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-blue-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-600">
                      What investors say
                    </div>
                    <div className="text-lg font-semibold">Real stories</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setShowTestimonial(
                          (v) => (v - 1 + testimonials.length) % testimonials.length
                        )
                      }
                      aria-label="Previous testimonial"
                      className="px-2 py-1 rounded bg-blue-50"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setShowTestimonial((v) => (v + 1) % testimonials.length)
                      }
                      aria-label="Next testimonial"
                      className="px-2 py-1 rounded bg-blue-50"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <blockquote className="text-sm text-slate-600">
                  “{testimonials[showTestimonial].quote}”
                </blockquote>
                <div className="mt-4 text-sm font-medium">
                  — {testimonials[showTestimonial].name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Building Wealth?</h2>
          <p className="text-sm md:text-base text-blue-100/90">
            Join thousands of Ghanaians already earning from real estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90 hover:scale-105 transition-transform duration-300 px-8 py-4">
                Create Account
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:scale-105 px-8 py-4">
                Explore Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating AI Chat Toggle (assistant) */}
      <AIChatToggle />
    </div>
  );
};

export default Homepage;