import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import AIChatToggle from "@/components/AIChatToggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Loader2,
  Newspaper,
  Clock
} from "lucide-react";
import api from "@/lib/api";

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    fetchArticle();
    fetchRelatedNews();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/news/${slug}`);
      setArticle(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching article:", err);
      setError("Article not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
    try {
      const response = await api.get("/news");
      const allNews = Array.isArray(response.data) ? response.data : [];
      // Get 3 random related articles (excluding current)
      const related = allNews
        .filter(n => n.slug !== slug)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setRelatedNews(related);
    } catch (err) {
      console.error("Error fetching related news:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const shareArticle = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-slate-600 text-lg">Loading article...</p>
          </div>
        </div>
        <AIChatToggle />
      </MainLayout>
    );
  }

  if (error || !article) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="text-center">
            <Newspaper className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Article Not Found</h2>
            <p className="text-slate-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Button
              onClick={() => navigate('/news')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
        </div>
        <AIChatToggle />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{article.meta_title || article.title} | CrowdBricks News</title>
        <meta name="title" content={article.meta_title || article.title} />
        <meta name="description" content={article.meta_description || article.excerpt} />
        {article.meta_keywords && <meta name="keywords" content={article.meta_keywords} />}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={article.meta_title || article.title} />
        <meta property="og:description" content={article.meta_description || article.excerpt} />
        <meta property="og:image" content={article.og_image_url || article.image} />
        <meta property="article:published_time" content={article.published_at || article.created_at} />
        <meta property="article:author" content={article.author?.name || `${article.author?.first_name} ${article.author?.last_name}`} />
        <meta property="article:section" content={article.category} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={article.meta_title || article.title} />
        <meta property="twitter:description" content={article.meta_description || article.excerpt} />
        <meta property="twitter:image" content={article.og_image_url || article.image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Back Button */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/news')}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <article className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Article Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">
                      {formatDate(article.published_at || article.created_at)}
                    </span>
                  </div>
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">
                        {article.author.name || `${article.author.first_name} ${article.author.last_name}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <p className="text-xl text-slate-700 leading-relaxed font-medium">
                  {article.excerpt}
                </p>
              </motion.div>

              {/* Featured Image */}
              {article.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              )}

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="prose prose-lg max-w-none mb-10"
              >
                <div className="text-slate-800 leading-relaxed whitespace-pre-line">
                  {article.content || article.excerpt}
                </div>
              </motion.div>

              {/* Share Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="border-t-2 border-slate-200 pt-8 mb-12"
              >
                <div className="flex items-center gap-4">
                  <Share2 className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-900 font-bold">Share this article:</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => shareArticle('facebook')}
                      className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => shareArticle('twitter')}
                      className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => shareArticle('linkedin')}
                      className="w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Related Articles */}
              {relatedNews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="border-t-2 border-slate-200 pt-12"
                >
                  <h2 className="text-3xl font-black text-slate-900 mb-6">Related Articles</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedNews.map((related) => (
                      <Link
                        key={related.id}
                        to={`/news/${related.slug}`}
                        className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-slate-100 hover:border-blue-200"
                      >
                        {related.image && (
                          <div className="relative overflow-hidden h-40">
                            <img
                              src={related.image}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                            <Clock className="w-3 h-3" />
                            {formatDate(related.published_at || related.created_at)}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {related.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </article>
      </div>

      <AIChatToggle />
    </MainLayout>
  );
}
