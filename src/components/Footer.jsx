import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Send,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { BRAND } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState(() => localStorage.getItem("cb_newsletter_email") || "");
  const [loading, setLoading] = useState(false);

  const brandPrimary = BRAND?.primary ?? "#0ea5e9";
  const brandAccent = BRAND?.accent ?? "#FBBF24";

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/newsletter/subscribe", { email: trimmed });
      localStorage.setItem("cb_newsletter_email", trimmed);
      toast({
        title: "Subscribed 🎉",
        description: "You're now part of the CrowdBricks community!",
      });
    } catch (err) {
      localStorage.setItem("cb_newsletter_email", trimmed);
      toast({
        title: "Saved locally",
        description: "We’ll sync your email when you’re online again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSubscription = () => {
    localStorage.removeItem("cb_newsletter_email");
    setEmail("");
    toast({ title: "Cleared", description: "Your email has been removed locally." });
  };

  const socialIcons = [
    { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { Icon: Github, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border-t border-blue-900 mt-16"
    >
      {/* Gradient top line */}
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${brandPrimary}, ${brandAccent}, ${brandPrimary})`,
        }}
      />

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Social */}
          <div>
            <Link
              to="/"
              aria-label="CrowdBricks home"
              className="flex items-center gap-3 group"
            >
              <motion.img
                src="/CB.png"
                alt="CrowdBricks logo"
                className="h-10 w-auto object-contain"
                whileHover={{ scale: 1.05, rotate: 2 }}
              />
              <div>
                <div
                  className="font-extrabold text-2xl"
                  style={{ color: brandAccent }}
                >
                  Crowd<span style={{ color: brandPrimary }}>Bricks</span>
                </div>
                <div className="text-xs text-slate-400">
                  Empowering Ghana’s Real Estate Future
                </div>
              </div>
            </Link>

            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              Democratizing real estate investment — connecting investors and
              developers for transparent, impactful growth.
            </p>

            <div className="flex items-center space-x-4 mt-5">
              {socialIcons.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`CrowdBricks on ${label}`}
                  className="text-slate-400 hover:text-yellow-400"
                  whileHover={{ y: -3, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-lg mb-3 text-yellow-400">Explore</h4>
            <ul className="space-y-2 text-slate-400">
              {[
                { path: "/projects", name: "Browse Projects" },
                { path: "/how-it-works", name: "How It Works" },
                { path: "/news", name: "News & Updates" },
                { path: "/about", name: "About Us" },
                { path: "/help", name: "Help & FAQ" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Investors & Developers */}
          <div>
            <h4 className="font-semibold text-lg mb-3 text-yellow-400">For You</h4>
            <div className="grid grid-cols-2 gap-6 text-sm text-slate-400">
              <div>
                <div className="font-medium text-blue-400 mb-2">Investors</div>
                <ul className="space-y-2">
                  <li><Link to="/dashboard/investor" className="hover:text-yellow-400">Dashboard</Link></li>
                  <li><Link to="/returns" className="hover:text-yellow-400">Expected Returns</Link></li>
                  <li><Link to="/risk" className="hover:text-yellow-400">Risk Disclosure</Link></li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-blue-400 mb-2">Developers</div>
                <ul className="space-y-2">
                  <li><Link to="/dashboard/developer" className="hover:text-yellow-400">Dashboard</Link></li>
                  <li><Link to="/raise" className="hover:text-yellow-400">Start a Raise</Link></li>
                  <li><Link to="/resources" className="hover:text-yellow-400">Resources</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-3 text-yellow-400">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe for investment opportunities and news.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-slate-800 text-white border-slate-700"
              />
              <Button
                type="submit"
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                disabled={loading}
              >
                <Send className="h-4 w-4" />
                {loading ? "Saving…" : "Subscribe"}
              </Button>
            </form>
            <div className="mt-3 text-xs text-slate-500 flex justify-between">
              <span>We value your privacy.</span>
              <button
                onClick={clearSubscription}
                className="underline hover:text-yellow-400"
              >
                Clear
              </button>
            </div>

            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" /> Accra, Ghana
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:hello@crowdbricks.com" className="hover:text-yellow-400">
                  hello@crowdbricks.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <a href="tel:+233201234567" className="hover:text-yellow-400">
                  +233 20 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>
            © {new Date().getFullYear()}{" "}
            <span style={{ color: brandAccent }}>Crowd</span>
            <span style={{ color: brandPrimary }}>Bricks</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-yellow-400">Privacy</Link>
            <Link to="/terms" className="hover:text-yellow-400">Terms</Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-slate-400 hover:text-yellow-400 transition"
            >
              ↑ Back to top
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
