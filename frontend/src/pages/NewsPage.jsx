// src/pages/NewsPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import headerImg from "../assets/Images/news/news-header.jpg";

// THIS IS THE CORRECT PUBLIC ENDPOINT (already works without token!)
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

  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return "Recently";
    
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day); // month is 1-based in array
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return PLACEHOLDER;
    return `${BASE_URL}${imageUrl}`;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(PUBLIC_API); // ← NO TOKEN NEEDED!

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
      <div className="min-h-screen bg-gradient-to-br from-[#818589] to-[#525354] flex items-center justify-center">
        <div className="text-white text-2xl">Loading latest news...</div>
      </div>
    );
  }

  return (
    <>
      <motion.header
        className="w-full h-72 md:h-80 bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${headerImg})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div className="relative text-center text-white px-6 z-10">
          <h1 className="text-4xl md:text-6xl font-bold">News & Updates</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Stay informed about operational updates and key developments at NCTHSL.
          </p>
        </motion.div>
      </motion.header>

      <section className="py-20 px-6 bg-gradient-to-br from-[#818589] to-[#525354] min-h-screen">
        <div className="max-w-5xl mx-auto">
          <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
            Latest News
          </motion.h1>

          {news.length === 0 ? (
            <div className="text-center text-white text-xl py-20">
              No news available at the moment. Check back soon!
            </div>
          ) : (
            <motion.div className="space-y-12">
              {news.map((item) => {
                const isExpanded = expandedId === item.id;

                return (
                  <motion.article
                    key={item.id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                    whileHover={{ y: -8 }}
                  >
                    {item.imageSrc && (
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="w-full h-64 md:h-80 object-cover"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER;
                        }}
                      />
                    )}

                    <div className="p-8 md:p-10">
                      <div className="text-sm text-gray-500 mb-3 font-medium">
                        {(() => {
                          if (!item.createdAt || !Array.isArray(item.createdAt)) return "Recently";
                          const [year, month, day] = item.createdAt;
                          const date = new Date(year, month - 1, day);
                          return date.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          });
                        })()} • {item.author || "NCTHSL"}
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-[#0A4D2D] mb-4">
                        {item.title}
                      </h2>

                      <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line">
                        {isExpanded
                          ? item.content
                          : item.preview || item.content?.slice(0, 280) + "..."}
                      </p>

                      {(item.content?.length > 280 || item.preview) && (
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="mt-6 text-[#0A4D2D] font-bold text-lg hover:underline"
                        >
                          {isExpanded ? "Show Less ↑" : "Read More →"}
                        </button>
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