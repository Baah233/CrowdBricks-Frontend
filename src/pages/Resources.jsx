import React from "react";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

/*
  Resources.jsx

  Purpose
  - Functionally equivalent, original implementation inspired by the Resources section layout.
  - Sections:
    1) Hero with full-bleed background image + overlay + CTA
    2) Two-column section: left = explanatory text + download CTA, right = featured video link (opens YouTube)
    3) Resource cards section (three cards: image, h2, p, inline link)
    4) Duplicate of the resource cards section (as requested)
  - Uses CrowdBricks brand cues: primary blue + yellow accent + neutral backgrounds.
  - Replace image/video URLs in /images/resources/ and videoUrl with your actual assets.
  - Add route in App.jsx: <Route path="/resources" element={<Resources />} />
*/

const resourceCards = [
  {
    id: "r1",
    title: "Due Diligence Checklist",
    description:
      "Step-by-step checklist used by our investment team — ideal for developers and investors preparing documents.",
    image: "/images/resources/due-diligence-card.jpg",
    href: "/docs/due-diligence.pdf",
  },
  {
    id: "r2",
    title: "Investor Pack Sample",
    description:
      "A sample investor pack showing the level of detail CrowdBricks expects for listed projects.",
    image: "/images/resources/investor-pack-card.jpg",
    href: "/docs/investor-pack-sample.pdf",
  },
  {
    id: "r3",
    title: "Tax & Regulation Guide",
    description:
      "High-level guide on tax considerations when investing in Ghanaian real estate via crowdfunding.",
    image: "/images/resources/tax-guide-card.jpg",
    href: "/docs/tax-guide.pdf",
  },
];

export default function Resources() {
  const videoUrl = "https://www.youtube.com/watch?v=voF1plqqZJA"; // replace with your video

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
            <source srcSet="/images/resources/resources-hero.webp" type="image/webp" />
            <img
              src="/images/resources/resources-hero.jpg"
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
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: text */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Learn whilst investing</h2>
              <p className="mt-4 text-slate-700">
                CrowdBricks provides practical resources for both investors and developers.
                Our materials cover how to prepare a project pack, what documents investors expect,
                and how returns are modelled. Use these resources to reduce friction during due diligence.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Clear checklists so you don’t miss required documents</li>
                <li>• Sample investor packs you can reuse</li>
                <li>• Short explanatory videos covering the pledge flow and payout schedules</li>
              </ul>

              <div className="mt-6 flex gap-3">
                <a href="/docs/due-diligence.pdf" className="inline-block">
                  <Button className="bg-primary-600 text-white hover:bg-primary-700">Download checklist</Button>
                </a>
                <a href="/docs/investor-pack-sample.pdf" className="inline-block">
                  <Button variant="outline">Download sample pack</Button>
                </a>
              </div>
            </div>

            {/* Right: video */}
            <div className="flex justify-center">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-lg group"
                aria-label="Watch our resources video"
              >
                <img
                  src="/images/resources/video-thumb.jpg"
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

      {/* Resource cards section (first copy) */}
      <section id="cards" className="py-12 bg-primary-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Helpful downloads & guides</h2>
          <p className="text-center text-slate-600 mt-2 max-w-2xl mx-auto">Everything you need to prepare a campaign or evaluate a project, collected in one place.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {resourceCards.map((r) => (
              <Card key={r.id} className="overflow-hidden">
                <img src={r.image} alt={r.title} className="w-full h-40 object-cover" />
                <CardContent>
                  <h3 className="text-lg font-semibold text-slate-900">{r.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{r.description}</p>
                  <div className="mt-4">
                    <a href={r.href} className="text-primary-600 hover:underline inline-flex items-center">
                      Open resource →
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resource cards section (duplicate as requested) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">More guides & templates</h2>
          <p className="text-center text-slate-600 mt-2 max-w-2xl mx-auto">Templates and reference materials to streamline your raise.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {resourceCards.map((r) => (
              <Card key={`dup-${r.id}`} className="overflow-hidden">
                <img src={r.image} alt={r.title} className="w-full h-40 object-cover" />
                <CardContent>
                  <h3 className="text-lg font-semibold text-slate-900">{r.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{r.description}</p>
                  <div className="mt-4">
                    <a href={r.href} className="text-primary-600 hover:underline inline-flex items-center">
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