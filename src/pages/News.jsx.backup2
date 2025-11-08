import React, { useState, useMemo } from "react";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const sampleNews = [
  {
    id: "1",
    slug: "platform-launch-accra",
    title:
      "CrowdBricks Launches in Accra — Opening Access to Property Investment",
    date: "2024-08-12",
    excerpt:
      "We’re excited to announce the public launch of CrowdBricks in Accra. Our platform allows investors to start from ₵500 and invest in vetted real estate projects across Ghana.",
    image: "/Due deligence.jpg",
  },
  {
    id: "2",
    slug: "estate-masters-partnership",
    title: "Estate Masters Partnership: Zero Carbon Ready Homes",
    date: "2024-09-05",
    excerpt:
      "We’ve partnered with Estate Masters to deliver energy efficient homes. Developers will list projects that prioritise long-term value and sustainability.",
    image: "/Fundraiser benefit.jpg",
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

export default function News() {
  const [selectedId, setSelectedId] = useState(sampleNews[0].id);

  const selectedArticle = useMemo(
    () => sampleNews.find((n) => n.id === selectedId) || sampleNews[0],
    [selectedId]
  );

  // Pick another article (different from selected)
  const otherArticle = useMemo(
    () => sampleNews.find((n) => n.id !== selectedId),
    [selectedId]
  );

  return (
    <MainLayout>
      {/* HERO */}
      <section
        aria-label="News hero"
        className="relative isolate overflow-hidden min-h-[44vh] flex items-center"
      >
        <div className="absolute inset-0 -z-10">
          <picture>
            <source srcSet="/Crowdbricks_news.jpg" type="image/webp" />
            <img
              src="/Crowdbricks_news.jpg"
              alt="News hero background"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-800/50 via-transparent to-black/25" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl text-white text-center mx-auto">
            <span className="inline-block rounded-full bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-semibold mb-4">
              Latest News
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-white">
              <span className="text-blue-600">Crowd</span>
              <span className="text-yellow-400">Bricks</span> updates, press and
              insights
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/90">
              Stay up to date with platform announcements, developer news, and
              investment insights.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN: two-column layout */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Featured article */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured */}
              <article className="rounded-xl overflow-hidden bg-white shadow-soft-lg border border-slate-100">
                <div className="relative">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute left-4 bottom-4 bg-white/90 rounded-md px-3 py-1 shadow">
                    <div className="text-xs text-slate-700 font-medium">
                      {new Date(selectedArticle.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {selectedArticle.title}
                  </h2>
                  <p className="mt-4 text-slate-700">
                    {selectedArticle.excerpt}
                  </p>

                  <div className="mt-6">
                    <Link to={`/news/${selectedArticle.slug}`}>
                    
                      <Button
                      variant="outline"
                      className="text-blue-600 border-blue-400 hover:bg-yellow-400">
                        Read more
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>

              {/* ✅ Added another article section */}
              {otherArticle && (
                <article className="rounded-xl overflow-hidden bg-white shadow border border-slate-100">
                  <div className=" md:flex-row">
                    <img
                      src={otherArticle.image}
                      alt={otherArticle.title}
                      className="w-full  h-42 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4 flex flex-col justify-center">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {otherArticle.title}
                      </h3>
                      <p className="mt-2 text-slate-600 text-sm line-clamp-3">
                        {otherArticle.excerpt}
                      </p>
                      <div className="mt-4">
                        <Link to={`/news/${otherArticle.slug}`}>
                          <Button
                            variant="outline"
                            className="text-blue-600 border-blue-400 hover:bg-yellow-400"
                          >
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )}
            </div>

            {/* RIGHT: List of all news */}
            <aside>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  All news
                </h3>

                <ul className="space-y-3">
                  {sampleNews.map((n) => (
                    <li
                      key={n.id}
                      className={`p-3 rounded hover:bg-primary-50 transition-colors cursor-pointer ${
                        selectedId === n.id
                          ? "ring-2 ring-primary-200 bg-primary-50"
                          : ""
                      }`}
                      onClick={() => setSelectedId(n.id)}
                    >
                      <Link to={`/news/${n.slug}`} className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {n.title}
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          {new Date(n.date).toLocaleDateString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 text-center">
                  <Link
                    to="/news/archive"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View archive
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <AIChatToggle />
    </MainLayout>
  );
}
