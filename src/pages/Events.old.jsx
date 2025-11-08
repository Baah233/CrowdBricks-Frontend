import React, { useState, useMemo } from "react";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/*
  Events.jsx
  - Training & Events page inspired by https://www.simplecrowdfunding.co.uk/crowdevents
  - Sections:
    1) Hero with full-bleed background image + overlay + CTA
    2) Two-column main area:
       - LEFT: Featured/upcoming events (cards with image, date, location, seats, excerpt, register button)
       - RIGHT: Compact list of upcoming events as links (slug header -> /events/:slug)
    3) Training & resources section: two-column (text + video link)
    4) Repeated resources/cards section (three cards: image, h2, p, inline link) - duplicated as requested
    5) FAQs about events & training
    6) Contact / host an event CTA
  - Uses your project's UI components (Card, Button) and CrowdBricks brand cues (primary blue + yellow accents).
  - Replace image paths (/images/events/...) with your assets in /public or adjust paths to your static store.
*/

const sampleEvents = [
  {
    id: "e1",
    slug: "investor-webinar-intro-to-crowdfunding",
    title: "Investor Webinar — Intro to Property Crowdfunding",
    date: "2025-11-12T18:00:00.000Z",
    location: "Accra — Hybrid (Online & In-person)",
    excerpt:
      "A 60-minute webinar introducing property crowdfunding, due diligence basics and the CrowdBricks platform. Ideal for first-time investors.",
    image: "/images/events/webinar-1.jpg",
    seats: 150,
    registered: 48,
    ticketUrl: "/events/register/investor-webinar",
  },
  {
    id: "e2",
    slug: "developer-masterclass-funding-structuring",
    title: "Developer Masterclass — Funding & Structuring Projects",
    date: "2025-12-03T10:00:00.000Z",
    location: "Kumasi — In-person",
    excerpt:
      "Practical sessions for developers: preparing an investor pack, modelling returns and structuring tranches for crowdfunding.",
    image: "/images/events/masterclass-1.jpg",
    seats: 60,
    registered: 12,
    ticketUrl: "/events/register/developer-masterclass",
  },
  {
    id: "e3",
    slug: "learn-while-investing-workshop",
    title: "Learn-Whilst-Investing Workshop — Site Visit & Q&A",
    date: "2026-01-15T09:00:00.000Z",
    location: "Accra — Site Visit",
    excerpt:
      "Join a guided site visit to a live project and a panel Q&A with the developer and CrowdBricks investment team.",
    image: "/images/events/site-visit.jpg",
    seats: 40,
    registered: 5,
    ticketUrl: "/events/register/site-visit",
  },
  {
    id: "e4",
    slug: "tax-and-compliance-for-investors",
    title: "Tax & Compliance for Investors",
    date: "2026-02-10T16:00:00.000Z",
    location: "Online",
    excerpt:
      "Understand tax implications and reporting for Ghanaian real estate investments. Practical examples and FAQs.",
    image: "/images/events/tax-webinar.jpg",
    seats: 200,
    registered: 0,
    ticketUrl: "/events/register/tax-webinar",
  },
];

const resourcesCards = [
  {
    id: "r1",
    title: "Due Diligence Checklist",
    description: "Step-by-step checklist used by our investment team to assess projects.",
    image: "/equity.jpg",
    href: "https://robertsonwilliams.com/wp-content/uploads/2020/01/Due-Dilligence-Checklist.pdf",
  },
  {
    id: "r2",
    title: "How to Prepare an Investor Pack",
    description: "Template and notes for developers preparing a pack for investors.",
    image: "/pack.jpg",
    href: "https://www.asc.ca/-/media/ASC-Documents-part-1/Regulatory-Instruments/2023/09/6102902-45-108-F1-Consolidation-Eff-June-9-2023.pdf",
  },
  {
    id: "r3",
    title: "Crowdfunding Basics Video",
    description: "Short overview video covering the crowdfunding process on CrowdBricks.",
    image: "/t2.jpg",
    href: "https://www.youtube.com/watch?v=Z4jwHGwTbtM",
  },
];

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function Events() {
  const [selectedId, setSelectedId] = useState(sampleEvents[0].id);

  const selectedEvent = useMemo(
    () => sampleEvents.find((e) => e.id === selectedId) || sampleEvents[0],
    [selectedId]
  );

  return (
    <MainLayout>
      {/* HERO */}
      <section
        aria-label="Events hero"
        className="relative isolate overflow-hidden min-h-[44vh] flex items-center"
      >
        <div className="absolute inset-0 -z-10">
          <picture>
            <source srcSet="/training.png" type="image/webp" />
            <img
              src="/training.png"
              alt="CrowdBricks training and events hero"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-800/50 via-transparent to-black/25" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl text-white text-center mx-auto">
            <span className="inline-block rounded-full bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-semibold mb-4">
              Training & Events
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-white">
              Learn, network and grow with CrowdBricks events
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/90">
              Join webinars, in-person workshops and site visits designed for investors and developers.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <Link to="/events">
                <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500">View upcoming events</Button>
              </Link>
              <a href="#resources" className="inline-flex items-center px-4 py-2 border border-white/20 text-white rounded-md hover:bg-white/5 transition">
                Browse resources
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN: two-column events area */}
      <section className="py-12 bg-gradient-to-br from-white via-blue-70 to-yellow-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: featured/selected event (span two columns on large screens) */}
            <div className="lg:col-span-2">
              <article className="rounded-xl overflow-hidden bg-white shadow-md border border-slate-100">
                <div className="relative">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute left-4 bottom-4 bg-white/90 rounded-md px-3 py-1 shadow">
                    <div className="text-xs text-slate-700 font-medium">{formatDate(selectedEvent.date)}</div>
                    <div className="text-xs text-slate-500">{selectedEvent.location}</div>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-slate-900">{selectedEvent.title}</h2>
                  <p className="mt-4 text-slate-700">{selectedEvent.excerpt}</p>

                  <div className="mt-6 flex flex-wrap gap-3 items-center">
                    <div className="text-sm text-slate-600">
                      Seats: {selectedEvent.seats} • Registered: {selectedEvent.registered}
                    </div>
                    <a href={selectedEvent.ticketUrl}>
                      <Button className="bg-primary-600 hover:bg-primary-700 text-white">Register</Button>
                    </a>
                    <Link to={`/events/${selectedEvent.slug}`} className="ml-2 text-sm text-primary-600 hover:underline">
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            {/* RIGHT: compact list of events */}
            <aside>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Upcoming events</h3>

                <ul className="space-y-3">
                  {sampleEvents.map((e) => (
                    <li
                      key={e.id}
                      className={`p-3 rounded hover:bg-primary-50 transition-colors cursor-pointer ${
                        selectedId === e.id ? "ring-2 ring-primary-200 bg-primary-50" : ""
                      }`}
                      onClick={() => setSelectedId(e.id)}
                    >
                      <Link to={`/events/${e.slug}`} className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{e.title}</span>
                        <span className="text-xs text-slate-500 mt-1">{formatDate(e.date)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 text-center">
                  <Link to="/events/archive" className="text-sm text-primary-600 hover:underline">
                    View past events & archive
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Training & resources (two-column with video) */}
      <section id="resources" className="py-12 bg-gradient-to-br from-white via-blue-70 to-yellow-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Training & resources</h2>
              <p className="mt-4 text-slate-700">
                Our training resources include short videos, checklists, templates and case studies to help both investors and developers.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• On-demand videos explaining the pledge & payout flow</li>
                <li>• Downloadable checklists and investor pack templates</li>
                <li>• Live workshops and recorded webinar replays</li>
              </ul>

              <div className="mt-6">
                <a href="/docs/due-diligence.pdf" className="inline-block bg-yellow-400 rounded-md shadow">
                  <Button className="bg-primary-600 text-white">Download checklist</Button>
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <a
                href="https://www.youtube.com/watch?v=Z4jwHGwTbtM"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-lg group"
                aria-label="Watch training video"
              >
                <img src="/t2.jpg" alt="Training video thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 text-slate-900 text-xl font-bold shadow-lg">►</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      

      {/* Duplicate cards section (as requested) */}
      <section className="py-12 bg-gradient-to-br from-white via-blue-70 to-yellow-100">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">More templates & videos</h2>
          <p className="text-center text-slate-600 mt-2 max-w-2xl mx-auto">Additional materials for presenters and hosts.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {resourcesCards.map((r) => (
              <Card key={`dup-${r.id}`} className="overflow-hidden">
                <img src={r.image} alt={r.title} className="w-full h-40 object-cover" />
                <CardContent>
                  <h3 className="text-lg font-semibold text-slate-900">{r.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{r.description}</p>
                  <div className="mt-4">
                    <a href={r.href} className="text-primary-600 hover:underline inline-flex items-center">Open resource →</a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 bg-gradient-to-br from-white via-blue-70 to-yellow-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Frequently asked questions</h2>

          <div className="mt-6 space-y-4">
            <details className="p-4 border rounded-lg">
              <summary className="font-medium cursor-pointer">How do I register for an event?</summary>
              <div className="mt-2 text-sm text-slate-600">Click the register button on the event card and complete the short form. For paid events we'll redirect you to the payment flow.</div>
            </details>

            <details className="p-4 border rounded-lg">
              <summary className="font-medium cursor-pointer">Can I host a training on CrowdBricks?</summary>
              <div className="mt-2 text-sm text-slate-600">Yes — contact our partnerships team via raise@crowdbricks.io and we'll help set up a session and reach our investor community.</div>
            </details>

            <details className="p-4 border rounded-lg">
              <summary className="font-medium cursor-pointer">Are recordings available after the event?</summary>
              <div className="mt-2 text-sm text-slate-600">We typically publish recordings and slide decks for registered attendees on the resources page.</div>
            </details>
          </div>
        </div>
      </section>

      {/* Contact / host CTA */}
      <section className="py-12 bg-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold">Host an event with CrowdBricks</h3>
          <p className="mt-3 text-slate-100 max-w-2xl mx-auto">We partner with developers, advisors and industry experts to produce practical training sessions. Reach our investor community and get help promoting your session.</p>

          <div className="mt-6">
            <a href="mailto:events@crowdbricks.io" className="inline-block">
              <Button className="bg-yellow-400 text-slate-900">Contact our events team</Button>
            </a>
          </div>
        </div>
      </section>

      <AIChatToggle />
    </MainLayout>
  );
}