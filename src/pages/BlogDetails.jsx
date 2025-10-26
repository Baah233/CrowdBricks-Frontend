import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";

export default function BlogDetails() {
  const { slug } = useParams();

  const article = {
    title: "5 Real Estate Investment Trends in Africa for 2025",
    date: "October 20, 2025",
    author: "CrowdBricks Insights",
    image: "/images/blog1.jpg",
    content: `
      The African real estate market continues to show resilience...
      (You’ll later fetch this dynamically from your backend)
    `,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <Helmet>
        <title>{article.title} | CrowdBricks Blog</title>
        <meta name="description" content={article.content.slice(0, 150)} />
        <meta name="keywords" content="CrowdBricks, real estate, Africa, investment, trends" />
        <meta property="og:title" content={article.title} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-64 object-cover rounded-xl mb-8"
        />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {article.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {article.date} · {article.author}
        </p>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
          {article.content}
        </p>

        <div className="mt-10">
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            ← Back to blog
          </Link>
        </div>
      </div>
    </div>
  );
}
