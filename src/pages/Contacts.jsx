import React, { useState, useMemo } from "react";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

/*
  Contact.jsx

  - Contact Us page inspired by https://www.simplecrowdfunding.co.uk/contact-us
  - Structure:
    1) Hero with full-bleed background image + overlay + short intro + CTA
    2) Two-column section:
       - LEFT: Featured announcement (slug) with image, date, excerpt and "Read more" button linking to /news/:slug
       - RIGHT: List of news slugs as links to /news/:slug (clicking also highlights the featured)
    3) Contact form and contact details section below
    4) AIChatToggle floating helper included at the bottom

  - Replace sample data and images with real assets.
  - The contact form posts to /api/contact (adjust api endpoint as needed).
*/

const sampleNews = [
  {
    id: "1",
    slug: "platform-launch-accra",
    title: "CrowdBricks Launches in Accra — Opening Access to Property Investment",
    date: "2024-08-12",
    excerpt:
      "We’re excited to announce the public launch of CrowdBricks in Accra. Our platform allows investors to start from ₵500 and invest in vetted real estate projects across Ghana.",
    image: "/images/news/due-diligence.jpg",
  },
  {
    id: "2",
    slug: "estate-masters-partnership",
    title: "Estate Masters Partnership: Zero Carbon Ready Homes",
    date: "2024-09-05",
    excerpt:
      "We’ve partnered with Estate Masters to deliver energy efficient homes. Developers will list projects that prioritise long-term value and sustainability.",
    image: "/images/news/fundraiser-benefit.jpg",
  },
  {
    id: "3",
    slug: "investor-education-series",
    title: "Investor Education Series — Webinars & Guides",
    date: "2024-10-02",
    excerpt:
      "Sign up for our free 'Learn Whilst Investing' webinars — topics include due diligence, tax considerations and portfolio diversification.",
    image: "/images/news/investor-benefit.jpg",
  },
  {
    id: "4",
    slug: "quarterly-report",
    title: "Quarterly Report: Platform Performance & Returns",
    date: "2024-12-01",
    excerpt:
      "Read our Q4 report covering platform performance, returns paid, and a selection of highlighted projects.",
    image: "/images/news/property-market.jpg",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState(sampleNews[0].id);
  const selectedArticle = useMemo(
    () => sampleNews.find((n) => n.id === selectedId) || sampleNews[0],
    [selectedId]
  );

  // Contact form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((s) => ({ ...s, [field]: e.target.value }));

  const submitContact = async (e) => {
    e?.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({
        title: "Missing fields",
        description: "Please provide your name, email and a message.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      await api.post("/contact", form, { headers: { "Content-Type": "application/json" } });
      toast({
        title: "Message sent",
        description: "Thanks — our support team will get back to you shortly.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Send failed",
        description: err?.response?.data?.message || "There was an error sending your message. Try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <MainLayout>
      {/* HERO */}
      <section
        aria-label="Contact hero"
        className="relative isolate overflow-hidden min-h-[44vh] flex items-center"
      >
        <div className="absolute inset-0 -z-10">
          <picture>
            <source srcSet="/hero2.png" type="image/webp" />
            <img
              src="/hero2.png"
              alt="Contact hero background"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-800/55 via-transparent to-black/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl text-center mx-auto text-white">
            <span className="inline-block rounded-full bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-semibold mb-4">
              Get in touch
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
              Contact CrowdBricks
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/90">
              We’re here to answer questions about investing, raising, partnerships and media.
              Use the form below or reach us via email and phone. For news and updates see the announcements on this page.
            </p>

            <div className="mt-6">
              <a href="#contact-form" className="inline-flex items-center px-6 py-3 rounded-md bg-yellow-400 text-slate-900 font-semibold shadow hover:bg-yellow-500 transition">
                Send a message
              </a>
            </div>
          </div>
        </div>
      </section>

      


      {/* CONTACT FORM + CONTACT DETAILS */}
      <section id="contact-form" className="py-12 bg-blue-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardContent>
                  <h3 className="text-2xl font-semibold mb-2">Send us a message</h3>
                  <p className="text-sm text-slate-900 font-semibold mb-4">
                   We constantly strive to improve how we serve our members and what we do. If you have any queries, suggestions or just want to talk something through, then get in touch.
                  </p>

                  <form onSubmit={submitContact} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Full name" value={form.name} onChange={handleChange("name")} required />
                      <Input type="email" placeholder="Email address" value={form.email} onChange={handleChange("email")} required />
                    </div>

                    <Input placeholder="Subject (optional)" value={form.subject} onChange={handleChange("subject")} />

                    <Textarea placeholder="How can we help?" rows={6} value={form.message} onChange={handleChange("message")} required />

                    <div className="flex items-center gap-3">
                      <Button type="submit" className="bg-yellow-400 text-black" disabled={sending}>
                        {sending ? "Sending…" : "Send a message"}
                      </Button>

                      <div className="text-sm text-slate-600">
                        Or email us at{" "}
                        <a href="mailto:contact@crowdbricks.io" className="text-primary-900 hover:underline">
                          contact@crowdbricks.io
                        </a>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact details */}
            <aside>
              <Card>
                <CardContent>
                  <h4 className="text-lg font-semibold">Contact details</h4>
                  <div className="mt-3 text-sm text-slate-700 space-y-3">
                    <div>
                      <div className="font-medium">Email</div>
                      <div><a href="mailto:contact@crowdbricks.io" className="text-primary-600 hover:underline">contact@crowdbricks.io</a></div>
                    </div>

                    <div>
                      <div className="font-medium">Phone</div>
                      <div>+233 24 000 0000</div>
                    </div>

                    <div>
                      <div className="font-medium">Office</div>
                      <div>Accra, Ghana — by appointment</div>
                    </div>

                    <div>
                      <div className="font-medium">Support hours</div>
                      <div>Mon–Fri, 09:00 — 17:00 (GMT)</div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <AIChatToggle />
    </MainLayout>
  );
}