import React, { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";


/*
  About.jsx
  - About page with hero, intro, founder, and testimonials.
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

export default function About() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-advance testimonials every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MainLayout>
      {/* HERO */}
      <section
        role="region"
        aria-label="About — Hero"
        className="relative isolate overflow-hidden min-h-[56vh] sm:min-h-[64vh] flex items-center"
      >
        <div className="absolute inset-0 -z-10">
          <picture>
            <source srcSet="/CB.png" type="image/webp" />
            <img
              src="/CB.png"
              alt="Construction site and skyline"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </picture>
        </div>
      </section>

      {/* Intro / Mission */}
      <section className="py-16 bg-slate-900 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          {/* Tech grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
          </div>
        </div>

        <div className="container w-full mx-50 px-6 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white inline-block px-3 py-1 rounded-md">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Making Property Investment Accessible To Everyone
            </span>
          </h2>
          <p className="mt-4 text-blue-200">
            <span className="text-blue-400 font-semibold">Crowd</span>
              <span className="text-yellow-400 font-semibold">Bricks</span> is Ghana's leading real estate crowdfunding and
            investment platform, built for individuals, professionals, and
            institutions who want to invest in high-potential property projects
            with confidence. We connect investors directly to trusted
            developers, making it easier to co-fund residential, commercial, and
            mixed-use developments across the country.
          </p>
          <p className="mt-4 text-blue-200">
            Our platform opens the doors of Ghana's real estate market to
            everyone. Through CrowdBricks, individuals, groups, and institutions
            can co-invest in property development projects — from residential
            estates and student hostels to commercial buildings and renovation
            ventures. Investors can start small, track project progress in real
            time, and earn sustainable returns while learning about real estate
            investment strategies through live, practical projects.
          </p>
          <p className="mt-4 text-blue-200">
            Developers, on the other hand, gain access to flexible funding
            beyond traditional banking systems, allowing them to launch, scale,
            and complete projects faster. This approach helps reduce Ghana’s
            housing deficit, stimulates local construction activity, and
            supports the growth of related industries such as materials supply,
            architecture, and labor.
          </p>
          <p className="mt-4 text-blue-200">
            By leveraging technology, transparency, and community trust,
            CrowdBricks opens the door to professional-level real estate
            investment for everyone. Whether you’re starting small or expanding
            your portfolio, our platform lets you track live projects, monitor
            returns, and learn from real-time insights, all in one secure,
            user-friendly space.
          </p>
          <p className="mt-4 text-blue-200">
            More than just a funding platform, CrowdBricks is driving inclusive
            economic growth. Every project backed through our platform supports
            local jobs, stimulates construction, and helps reduce Ghana’s
            housing deficit. Together, we’re not only building properties — we’re
            building wealth, opportunity, and a stronger national economy.
          </p>
        </div>
      </section>

      {/* Founder / Team Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-30 animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-20 animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Image column */}
            <div className="order-2 md:order-1">
              <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-500 rounded-xl opacity-30 group-hover:opacity-50 blur transition-opacity"></div>
                <div className="relative">
                  <img
                    src="/young.jpg"
                    alt="Founder portrait"
                    className="w-full h-[800px] object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Text column */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-blue-400 mt-2">
                Meet Our Founder
              </h2>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mt-2">
                Empowering a New Generation of Property Investors
              </h3>
              <p className="mt-4 text-blue-200">
                <span className="font-bold text-white">
                  Christopher Baah (Founder & CEO)
                </span>{" "}
                is the visionary behind <span className="text-blue-400 font-semibold">Crowd</span>
              <span className="text-yellow-400 font-semibold">Bricks</span>, a modern investment
                platform transforming how Ghanaians invest in real estate. With
                a deep passion for people, innovation, and economic growth,
                Christopher founded <span className="text-blue-400 font-semibold">Crowd</span>
              <span className="text-yellow-400 font-semibold">Bricks</span> to make property investment
                transparent, inclusive, and rewarding for everyone — from
                first-time investors to seasoned developers.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-yellow-500/30">
                    ✓
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      Experience that Builds Confidence
                    </div>
                    <div className="text-sm text-blue-200">
                      With a strong background in business, administration, and strategic leadership, Christopher has collaborated with developers, entrepreneurs, and investors to deliver impactful projects that drive real value and community growth.
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-yellow-500/30">
                    ✓
                  </div>
                  <div>
                    <div className="font-medium text-white">Integrity at the Core</div>
                    <div className="text-sm text-blue-200">
                      Every campaign on CrowdBricks is built on trust, due
                      diligence, and investor protection — ensuring investors
                      engage in credible, structured, and growth-focused
                      opportunities.
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-yellow-500/30">
                    ✓
                  </div>
                  <div>
                    <div className="font-medium text-white">Vision for Impact</div>
                    <div className="text-sm text-blue-200 mb-3">
                      Under his leadership, CrowdBricks is more than a platform
                      — it’s a movement to fuel Ghana’s real estate and
                      investment ecosystem, bridge financial inclusion gaps, and
                      empower citizens to be part of the country’s development
                      story.
                    </div>
                  </div>
                </li>
              </ul>

              <div className="mt-6">
                <Link to="/how-it-works">
                  <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-5 py-2 hover:from-yellow-500 hover:to-amber-600 font-bold shadow-lg shadow-yellow-500/30">
                    Learn about our process
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative isolate overflow-hidden bg-slate-900 px-6 py-24 sm:py-32 lg:px-6">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          {/* Tech grid */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          </div>
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-4xl text-center relative z-10">
          <img
            src="/CB1.png"
            alt="CrowdBricks logo"
            className="mx-auto h-40 w-auto mb-10"
          />

          <AnimatePresence mode="wait">
            <motion.figure
              key={currentTestimonial}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="text-center bg-slate-800/40 backdrop-blur-md border-2 border-white/10 rounded-2xl p-10 shadow-2xl relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-slate-900 text-3xl font-bold shadow-lg shadow-yellow-500/30">
                "
              </div>
              <blockquote className="text-xl sm:text-2xl font-semibold text-white mt-4">
                <p>"{testimonials[currentTestimonial].quote}"</p>
              </blockquote>
              <figcaption className="mt-10">
                <div className="relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-75"></div>
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="relative mx-auto h-16 w-16 rounded-full object-cover border-2 border-yellow-400"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                  <div className="font-semibold text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <svg
                    viewBox="0 0 2 2"
                    width="3"
                    height="3"
                    aria-hidden="true"
                    className="fill-blue-300"
                  >
                    <circle r="1" cx="1" cy="1" />
                  </svg>
                  <div className="text-blue-200">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-10 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Show testimonial ${index + 1}`}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentTestimonial === index
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 w-8 shadow-lg shadow-yellow-500/30"
                    : "bg-white/20 hover:bg-white/30 w-3"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Floating AI helper */}
      <AIChatToggle />
    </MainLayout>
  );
}
