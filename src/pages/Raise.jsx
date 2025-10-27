import { Link } from "react-router-dom";
import React, { useState, useEffect, useMemo, useRef } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { MessageCircle, Info, Clock, FileText, CheckCircle, Globe } from "lucide-react";
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
      await axios.post(
        "/api/raise-requests",
        {
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          expected_amount: form.expectedAmount,
          summary: form.summary,
        },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      toast({
        title: "Request sent",
        description: "We've received your request — our raise team will follow up within 48 hours.",
      });

      setForm({ name: "", company: "", email: "", phone: "", expectedAmount: "", summary: "" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to submit",
        description:
          err?.response?.data?.message ||
          "There was an error submitting your request. If the problem persists, email raise@crowdbricks.io",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed: renamed and properly declared testimonials
  const testimonials = useMemo(
    () => [
      {
        quote:
          "We raised the final tranche in under 6 weeks — CrowdBricks guided us at every step.",
        name: "Francis O.",
        role: "Developer",
        image: "/avatar1.jpg",
      },
      {
        quote:
          "Great onboarding and investor reach — the platform is well structured.",
        name: "Esi A.",
        role: "Founder",
        image: "/avatar2.jpg",
      },
      {
        quote:
          "The process was seamless — they made raising capital simple and transparent.",
        name: "Kwame B.",
        role: "Real Estate Partner",
        image: "/avatar3.jpg",
      },
    ],
    []
  );

  // ✅ Added state for controlling which testimonial shows
  const [showTestimonial, setShowTestimonial] = useState(0);

  // ✅ Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setShowTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <MainLayout>
      <div className="container mx-auto w-full">
        {/* ✅ HERO SECTION */}
        <section
          role="banner"
          aria-label="Hero — Raise Property Finance with CrowdBricks"
          className="relative isolate overflow-hidden h-[60vh] flex items-end justify-center"
        >
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <picture>
              <source srcSet="/Hero5.jpg" type="image/webp" />
              <img
                src="/Hero5.jpg"
                alt="Aerial view of a real estate development project"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </picture>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            />
          </div>

          <div className="relative z-10 w-full text-center pb-16 px-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
              Raising Property Finance With{" "}
              <span className="text-blue-400">Crowd</span>
              <span className="text-yellow-400">Bricks</span>
            </h2>
          </div>
        </section>

        {/* ✅ INTRO SECTION */}
        <section className="py-16 text-center px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
            Helping Developers Raise Finance and Build an Investor Community
          </h2>
          <p className="text-slate-700 mt-4 max-w-3xl mx-auto">
            <span className="font-semibold text-blue-400">Crowd</span>
            <span className="text-yellow-400">Bricks</span> offers full-stack property funding — from land uplift to multi-unit builds. Our team helps you structure campaigns, connect with investors, and manage your raise transparently.
          </p>
          <Link to="/auth/login">
            <Button
              size="lg"
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Apply For Finance
            </Button>
          </Link>
        </section>

        {/* ✅ TWO-COLUMN SECTION */}
        <section className="py-16 bg-gradient-to-br from-white via-blue-50 to-yellow-50">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why Raise With{" "}
                <span className="text-blue-600">Crowd</span>
                <span className="text-yellow-500">Bricks</span>?
              </h2>
              <ul className="space-y-3 list-disc list-inside text-slate-700">
                <li>
                  <strong>Regulated by SEC Ghana:</strong> We follow SEC’s 2024 Crowdfunding Guidelines.
                </li>
                <li>
                  <strong>Bank of Ghana compliance:</strong> Fully compliant with BoG payment regulations.
                </li>
                <li>
                  <strong>Fast onboarding:</strong> Complete your KYC and project setup within days.
                </li>
                <li>
                  <strong>Investor reach:</strong> Access thousands of verified investors.
                </li>
                <li>
                  <strong>Transparent process:</strong> Track everything from listing to payout.
                </li>
                <li>
                  <strong>Expert support:</strong> Get guided by our dedicated property raise team.
                </li>
              </ul>
            </div>

            {/* Right Column */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What You’ll Need to Get Started
              </h2>
              <ul className="space-y-3 list-disc list-inside text-slate-700">
                <li>Company registration & director IDs</li>
                <li>Proof of property ownership or land title</li>
                <li>Project plan with timeline & cost breakdown</li>
                <li>Financial statements or prior project reports</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ✅ TESTIMONIALS SECTION */}
        <section className="relative isolate overflow-hidden bg-blue-600 px-6 py-24 sm:py-32 lg:px-8 h-[400px] flex items-center justify-center">
          <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
            <img src="/CB1.png" alt="CrowdBricks logo" className="mx-auto h-20 mb-10" />

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
                    <svg
                      viewBox="0 0 2 2"
                      width="3"
                      height="3"
                      aria-hidden="true"
                      className="fill-white"
                    >
                      <circle r="1" cx="1" cy="1" />
                    </svg>
                    <div className="text-gray-300">
                      {testimonials[showTestimonial].role}
                    </div>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {/* Dot navigation */}
            <div className="flex justify-center mt-10 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setShowTestimonial(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    showTestimonial === index
                      ? "bg-yellow-400 w-5"
                      : "bg-gray-500 hover:bg-gray-400"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ CTA */}
        <section className="my-10 text-center">
          <h3 className="text-xl font-semibold mb-3">Ready to raise?</h3>
          <p className="text-slate-600 mb-4">
            Submit your request above or contact our raise team for a walkthrough.
          </p>
          <Button className="bg-blue-600 text-white px-6 py-3">
            Start a Raise
          </Button>
        </section>
      </div>
    </MainLayout>
  );
}
