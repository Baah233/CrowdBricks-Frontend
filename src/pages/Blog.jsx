import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "5 Real Estate Investment Trends in Africa for 2025",
    excerpt:
      "Discover emerging real estate opportunities across Africa — from proptech growth to sustainable housing projects.",
    image: "/images/blog1.jpg",
    date: "October 20, 2025",
    author: "CrowdBricks Insights",
    slug: "real-estate-trends-africa-2025",
  },
  {
    id: 2,
    title: "How CrowdBricks Is Empowering Local Developers",
    excerpt:
      "Learn how our platform bridges investors and developers to fund impactful housing projects across Ghana and beyond.",
    image: "/images/blog2.jpg",
    date: "October 15, 2025",
    author: "Team CrowdBricks",
    slug: "empowering-local-developers",
  },
  {
    id: 3,
    title: "Why Diversifying Your Investment Portfolio Matters",
    excerpt:
      "Investors are turning to real estate crowdfunding to balance their risk. Here's why diversification works.",
    image: "/images/blog3.jpg",
    date: "October 10, 2025",
    author: "CrowdBricks Research",
    slug: "diversifying-investment-portfolio",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      {/* ✅ SEO Meta */}
      <Helmet>
        <title>Insights & Blog | CrowdBricks</title>
        <meta
          name="description"
          content="Explore insights, trends, and expert opinions on real estate investment, crowdfunding, and developer innovation in Africa."
        />
        <meta
          name="keywords"
          content="CrowdBricks blog, real estate insights, crowdfunding, property investment, Ghana, Africa"
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12"
        >
          Insights & Blog
        </motion.h1>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {post.excerpt}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {post.date} · {post.author}
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
