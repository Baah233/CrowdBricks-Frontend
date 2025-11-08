import React, { useMemo, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

/*
  src/pages/Help.jsx

  Purpose
  - Original Help / Support page inspired by the structure of the reference URL.
  - Sections:
    1) Hero with full-bleed background image + overlay + short intro + CTA
    2) Searchable help topics (two-column layout: topics list + selected topic details)
    3) FAQ accordion with grouped questions
    4) Troubleshooting & quick fixes table
    5) Developer / Partner docs and downloads (table)
    6) Contact & support channels (phone, email, office hours)
    7) Link to submit a support ticket or request a developer call
    8) Floating AIChatToggle is included
  - Usage: drop this file at src/pages/Help.jsx and add route <Route path="/help" element={<Help />} /> to App.jsx
  - Replace image paths (/images/help/help-hero.jpg) with your asset files in /public or adjust paths to your CDN.
*/

const HELP_TOPICS = [
  {
    id: "t-accounts",
    title: "Accounts & Authentication",
    summary: "Sign-up, login, password resets, two-factor and account settings.",
    content:
      "Learn how to create an account, verify your email, reset your password and enable two-factor authentication. If you lose access to your account, contact support to start account recovery.",
  },
  {
    id: "t-investing",
    title: "Investing & Payments",
    summary: "How pledges, payments and payouts work (Momo, Bank, Card).",
    content:
      "Steps to pledge, payment capture, accepted payment methods, failed payment handling and how payouts are scheduled. See the Fees & Tax pages for financial details.",
  },
  {
    id: "t-raising",
    title: "Raising Capital (Developers)",
    summary: "Application process, due diligence and preparing an investor pack.",
    content:
      "Guidance for developers: how to submit a raise request, required documents (title, company registration, budgets), due diligence timeline and campaign setup.",
  },
  {
    id: "t-documents",
    title: "Documents & Reporting",
    summary: "Investor statements, project reports and where to download documents.",
    content:
      "Where to find investor statements, project packs and periodic reports. Instructions for uploading documents for your campaign and how our team verifies uploads.",
  },
  {
    id: "t-security",
    title: "Security & Privacy",
    summary: "How we protect user data and your funds.",
    content:
      "Summary of security controls, data handling, encryption and privacy practices. For legal enquiries, see our Privacy Policy and Terms of Service.",
  },
];

const FAQ_GROUPS = [
  {
    group: "General",
    faqs: [
      { q: "What is CrowdBricks?", a: "CrowdBricks is a property crowdfunding platform connecting investors with vetted real estate projects." },
      { q: "Who can invest?", a: "Anyone who meets the onboarding requirements and accepts the terms can invest; some projects may restrict by investor type." },
    ],
  },
  {
    group: "Investing",
    faqs: [
      { q: "How much can I invest?", a: "Minimum and maximum contributions are set per project — typical minimums start from ₵500." },
      { q: "How do I get my returns?", a: "Returns are distributed according to the campaign schedule; investors receive statements for tax filing." },
    ],
  },
  {
    group: "Raising",
    faqs: [
      { q: "How long does due diligence take?", a: "Initial checks often complete in 3–14 business days depending on document readiness." },
      { q: "What documents do you need?", a: "Company registration, director IDs, proof of land/title, project plan and a detailed pro forma are typical requirements." },
    ],
  },
];

const TROUBLESHOOTING = [
  { issue: "Forgot password", fix: "Use the 'Forgot password' flow on the login page. If that email doesn't arrive, check spam or contact support." },
  { issue: "Payment failed (Momo)", fix: "Confirm account balance and retry; if problem persists provide the error code to support." },
  { issue: "Unable to upload documents", fix: "Check file size/type and try again; preferred formats: PDF, JPG, PNG. Contact support if issue continues." },
  { issue: "Duplicate pledge", fix: "If you believe you made a duplicate pledge, contact support with transaction IDs and we'll investigate." },
];

const DOCS = [
  { name: "Due Diligence Checklist", type: "PDF", link: "/docs/due-diligence.pdf" },
  { name: "Investor Pack Template", type: "PDF", link: "/docs/investor-pack-sample.pdf" },
  { name: "Tax Guide (Overview)", type: "PDF", link: "/docs/tax-guide.pdf" },
];

export default function Help() {
  const [query, setQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState(HELP_TOPICS[0].id);
  const [openFaq, setOpenFaq] = useState({});

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HELP_TOPICS;
    return HELP_TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q)
    );
  }, [query]);

  const selectedTopic = useMemo(
    () => HELP_TOPICS.find((t) => t.id === selectedTopicId) || HELP_TOPICS[0],
    [selectedTopicId]
  );

  return (
    <MainLayout>
      {/* HERO - Fintech Style with Animated Background */}
      <section
        aria-label="Help hero"
        className="relative isolate overflow-hidden min-h-[60vh] flex items-center"
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          {/* Animated orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 -z-5 overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400/60 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-green-400/60 rounded-full animate-bounce delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-4xl text-center mx-auto">
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-4 py-2 mb-6 font-bold shadow-lg shadow-yellow-500/30 animate-pulse">
              Help & Support Center
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-yellow-200 leading-tight">
              How can we help you today?
            </h1>
            <p className="mt-4 text-lg md:text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
              Get instant answers, explore guides, or connect with our support team for personalized assistance on your investment journey.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a 
                href="#topics" 
                className="group inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300"
              >
                Browse Help Topics
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a 
                href="#contact" 
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border-2 border-white/20 hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300"
              >
                Contact Support
              </a>
            </div>

            {/* Quick stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black text-yellow-400">24/7</div>
                <div className="text-sm text-blue-200 mt-1">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-400">100+</div>
                <div className="text-sm text-blue-200 mt-1">Help Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-400">5min</div>
                <div className="text-sm text-blue-200 mt-1">Avg Response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Search + Topics (two-column) */}
      <section id="topics" className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-yellow-50 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Topics list */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <div>
                  <label htmlFor="help-search" className="sr-only">Search help</label>
                  <Input
                    id="help-search"
                    placeholder="🔍 Search help topics..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 shadow-lg"
                  />
                </div>

                <Card className="p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl">
                  <CardContent>
                    <h3 className="text-lg font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-600">Help Topics</h3>
                    <ul className="space-y-2">
                      {filteredTopics.map((t) => (
                        <li key={t.id}>
                          <button
                            onClick={() => setSelectedTopicId(t.id)}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                              selectedTopicId === t.id 
                                ? "bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30 scale-105" 
                                : "bg-slate-50/50 hover:bg-white hover:shadow-md"
                            }`}
                          >
                            <div className={`font-bold ${selectedTopicId === t.id ? "text-slate-900" : "text-slate-900"}`}>
                              {t.title}
                            </div>
                            <div className={`text-xs mt-1 ${selectedTopicId === t.id ? "text-slate-700" : "text-slate-500"}`}>
                              {t.summary}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                    {filteredTopics.length === 0 && (
                      <div className="text-sm text-slate-500 mt-3">No topics match your search — try different keywords or contact support.</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-slate-900 to-blue-950 text-white border-2 border-yellow-400/30 shadow-xl">
                  <CardContent>
                    <h4 className="font-bold text-yellow-400 mb-3">⚡ Quick Links</h4>
                    <ul className="mt-2 space-y-3 text-sm">
                      <li>
                        <Link to="/faq" className="flex items-center gap-2 text-blue-200 hover:text-yellow-400 transition-colors">
                          <span className="text-yellow-400">→</span> Full FAQ
                        </Link>
                      </li>
                      <li>
                        <a href="/docs/due-diligence.pdf" className="flex items-center gap-2 text-blue-200 hover:text-yellow-400 transition-colors">
                          <span className="text-yellow-400">→</span> Download Guides
                        </a>
                      </li>
                      <li>
                        <a href="/raise" className="flex items-center gap-2 text-blue-200 hover:text-yellow-400 transition-colors">
                          <span className="text-yellow-400">→</span> Start a Raise
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Topic detail */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"></div>
                <CardContent className="p-6">
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-600">
                    {selectedTopic.title}
                  </h2>
                  <p className="mt-4 text-slate-700 leading-relaxed text-lg">{selectedTopic.content}</p>

                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Related resources</h4>
                      <ul className="mt-2 text-sm text-slate-600 space-y-2">
                        <li><a href="/docs/due-diligence.pdf" className="text-primary-600 hover:underline">Due Diligence checklist (PDF)</a></li>
                        <li><a href="/docs/investor-pack-sample.pdf" className="text-primary-600 hover:underline">Investor pack sample (PDF)</a></li>
                        <li><a href="/docs/tax-guide.pdf" className="text-primary-600 hover:underline">Tax overview (PDF)</a></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium">Need help with this topic?</h4>
                      <p className="mt-2 text-sm text-slate-600">If the guides don't solve your issue, submit a support ticket or schedule a call with our raise team.</p>
                      <div className="mt-4 flex gap-3">
                        <a href="/support/ticket" className="inline-block"><Button className="bg-primary-600 text-white">Submit a ticket</Button></a>
                        <a href="/support/schedule" className="inline-block"><Button variant="outline">Schedule a call</Button></a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ groups */}
              <div className="space-y-4">
                {FAQ_GROUPS.map((g) => (
                  <Card key={g.group} className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{g.group}</h3>
                      <div className="mt-4 space-y-3">
                        {g.faqs.map((f, i) => (
                          <details key={i} className="group p-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl hover:border-yellow-400/50 hover:bg-white transition-all">
                            <summary className="font-semibold cursor-pointer text-slate-900 flex items-center gap-2">
                              <span className="text-yellow-400 group-open:rotate-90 transition-transform">▶</span>
                              {f.q}
                            </summary>
                            <div className="mt-3 text-sm text-slate-600 pl-6 leading-relaxed">{f.a}</div>
                          </details>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Troubleshooting table */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">🔧 Troubleshooting & Quick Fixes</h3>
                  <div className="mt-4 overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2">Issue</th>
                          <th className="py-2">Quick fix</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TROUBLESHOOTING.map((t) => (
                          <tr key={t.issue} className="border-b">
                            <td className="py-2 align-top font-medium">{t.issue}</td>
                            <td className="py-2 text-slate-600">{t.fix}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Docs & downloads */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">📚 Documentation & Downloads</h3>
                  <div className="mt-4 overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2">Document</th>
                          <th className="py-2">Type</th>
                          <th className="py-2">Download</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DOCS.map((d) => (
                          <tr key={d.name} className="border-b">
                            <td className="py-2">{d.name}</td>
                            <td className="py-2 text-slate-600">{d.type}</td>
                            <td className="py-2"><a href={d.link} className="text-primary-600 hover:underline">Open</a></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Contact & support channels */}
              <Card id="contact" className="bg-gradient-to-br from-slate-900 to-blue-950 text-white border-2 border-yellow-400/30 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">📞 Contact Support</h3>
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <p className="text-sm text-blue-200 mb-4">🕒 Support hours: Mon–Fri, 09:00 — 17:00 (GMT)</p>
                      <dl className="space-y-4 text-sm">
                        <div>
                          <dt className="font-semibold text-yellow-400 mb-1">📧 Email</dt>
                          <dd className="text-blue-100">
                            <a href="mailto:support@crowdbricks.io" className="hover:text-yellow-400 transition-colors">
                              support@crowdbricks.io
                            </a>
                          </dd>
                        </div>

                        <div>
                          <dt className="font-semibold text-yellow-400 mb-1">📞 Phone</dt>
                          <dd className="text-blue-100">+233 24 000 0000</dd>
                        </div>

                        <div>
                          <dt className="font-semibold text-yellow-400 mb-1">🏢 Office</dt>
                          <dd className="text-blue-100">Accra, Ghana — by appointment</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <h4 className="font-bold text-yellow-400 mb-3">⚡ Get Faster Support</h4>
                      <ul className="space-y-2 text-sm text-blue-100">
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">✓</span>
                          <span>Include your transaction ID for payment issues</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">✓</span>
                          <span>Attach screenshot(s) if you experience an error</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">✓</span>
                          <span>Use the "Submit a ticket" flow to track progress</span>
                        </li>
                      </ul>

                      <div className="mt-5">
                        <a href="/support/ticket" className="inline-block w-full">
                          <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold shadow-lg shadow-yellow-500/30">
                            Submit a Ticket →
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <AIChatToggle />
    </MainLayout>
  );
}