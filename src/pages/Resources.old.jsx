import React from "react";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";


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

  return (
    <MainLayout>
      {/* HERO */}
      <section
        role="region"
        aria-label="Resources hero"
        className="relative isolate overflow-hidden min-h-[44vh] flex items-center"
      >
        <div className="absolute inset-0 -z-10">
          <picture>
            <source srcSet="/learning.png" type="image/webp" />
            <img
              src="/learning.png"
              alt="People at a property development site"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/50 via-transparent to-black/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl text-white text-center mx-auto">
            <span className="inline-block rounded-full bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-semibold mb-4">
              Resources & Guides
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Practical resources to help you invest and raise with confidence
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/90">
              Download checklists, sample investor packs and watch our short videos to get started.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <Link to="/raise">
                <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500">Start a raise</Button>
              </Link>
              <a href="#cards" className="inline-flex items-center px-4 py-2 border border-white/20 text-white rounded-md hover:bg-white/5 transition">
                Browse resources
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Two-column: text + video */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 space-y-16">
          {/* First section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">WHAT IS CROWDFUNDING?</h2>
              <p className="mt-4 text-slate-700">
                Crowdfunding is the practice of funding a project or business by raising money from the public.
              </p>
              <p className="mt-4 text-slate-700">
                Simple Crowdfunding specialises in Property Crowdfunding and Peer to Peer Lending. We connect investors and property professionals through our platform.
              </p>
              <p className="mt-4 text-slate-700">
                We love to see companies successfully grow and reach their property ambitions and investors build wealth portfolios online simply.
              </p>
              <p className="mt-4 text-slate-700">
                To get you started, watch this short Introduction to Crowdfunding.
              </p>
            </div>

            <div className="flex justify-center">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-lg group"
              >
                <img
                  src="/achieve.jpg"
                  alt="Watch our Resources video"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 text-slate-900 text-xl font-bold shadow-lg">
                    ►
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Second section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">
                THE DIFFERENCE BETWEEN CROWDFUNDING AND PEER TO PEER LENDING (P2PL)
              </h2>
              <p className="mt-4 text-slate-700">
                We often get asked about the difference between Equity and Peer to Peer Lending when raising property finance.
              </p>
              <p className="mt-4 text-slate-700">
                In this video, we explain the core differences between the two and nuances that you should be aware of.
              </p>
            </div>

            <div className="flex justify-center">
              <a
                href="https://www.youtube.com/watch?v=U1ZFl2N6_ek"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-lg group"
              >
                <img
                  src="/growth.jpg"
                  alt="Watch our Resources video"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 text-slate-900 text-xl font-bold shadow-lg">
                    ►
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Resource cards section */}
      <section id="cards" className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">More guides & templates</h2>
          <p className="text-center text-slate-600 mt-2 max-w-2xl mx-auto">
            Templates and reference materials to streamline your raise.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {resourceCards.map((r) => (
              <Card key={`dup-${r.id}`} className="overflow-hidden">
                <img src={r.image} alt={r.title} className="w-full h-40 object-cover" />
                <CardContent>
                  <h3 className="text-lg font-semibold text-slate-900">{r.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{r.description}</p>
                  <div className="mt-4">
                    <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline inline-flex items-center"
                  >
                    Open resource →
                  </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <AIChatToggle />
    </MainLayout>
  );
}
