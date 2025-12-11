// src/pages/NewsPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import headerImg from "../assets/Images/news/news-header.jpg";

const PUBLIC_API = "https://enchanting-expression-production.up.railway.app/api/v1/news/all-news";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyNTZweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjRweCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return PLACEHOLDER;
    return `${BASE_URL}${imageUrl}`;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(PUBLIC_API);
        const list = res.data || [];
        const processed = list.map((item) => ({
          ...item,
          imageSrc: item.imageUrl ? getImageUrl(item.imageUrl) : null,
        }));
        setNews(processed);
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a3a0a] to-[#052a05] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-t-cyan-400 border-r-purple-500 border-b-pink-500 border-l-green-500 rounded-full"
        />
        <p className="text-white text-2xl ml-6 font-bold neon-text">Loading Latest News...</p>
      </div>
    );
  }

  return (
    <>
      {/* HERO WITH EPIC GLOW */}
      <motion.header
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${headerImg})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20" />
        
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 drop-shadow-2xl neon-text">
            NEWS & UPDATES
          </h1>
          <p className="text-xl md:text-3xl text-gray-200 font-light tracking-wider">
            The Pulse of NCTHSL Excellence
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-10 w-32 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mx-auto rounded-full"
          />
        </motion.div>
      </motion.header>

      {/* NEWS SECTION — ULTRA PREMIUM */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#0a1a1a] to-[#0a2a0a] relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-20 neon-text"
          >
            Latest News
          </motion.h1>

          {news.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-3xl text-gray-400 font-light">No news available at the moment.</p>
              <p className="text-lg text-gray-500 mt-4">Check back soon for updates!</p>
            </div>
          ) : (
            <motion.div className="space-y-16">
              {news.map((item, index) => {
                const isExpanded = expandedId === item.id;

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="glow-border floating-card group"
                  >
                    {item.imageSrc && (
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <img
                          src={item.imageSrc}
                          alt={item.title}
                          className="w-full h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => (e.target.src = PLACEHOLDER)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                          <p className="text-sm font-medium opacity-90">
                            {item.createdAt?.slice(0, 10) || "Recently"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-10 md:p-12 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h2>

                      <p className="text-gray-300 leading-relaxed text-lg mb-8">
                        {isExpanded
                          ? item.content
                          : item.preview || item.content?.slice(0, 320) + "..."}
                      </p>

                      {(item.content?.length > 320 || item.preview) && (
                        <motion.button
                          onClick={() => toggleExpand(item.id)}
                          className="inline-flex items-center gap-3 text-cyan-400 font-bold text-xl hover:text-cyan-300 transition-all hover:gap-5"
                          whileHover={{ scale: 1.1 }}
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.4 }}
                          >
                          </motion.span>
                        </motion.button>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}