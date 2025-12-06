// src/pages/NewsPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

import headerImg from "../assets/Images/news/news-header.jpg";

export default function NewsPage() {
  const [expandedId, setExpandedId] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getAuthConfig = () => {
    const token = localStorage.getItem("adminToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    };
  };

  // Fetch secure images
  const fetchSecureImage = async (relativePath) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        `https://enchanting-expression-production.up.railway.app${relativePath}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      return URL.createObjectURL(res.data);
    } catch (err) {
      console.error("Image fetch failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        // FIX 1 — secure authenticated news fetch
        const response = await axios.get(
          "https://enchanting-expression-production.up.railway.app/api/v1/news/all-news",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const list = response.data || [];

        // FIX 2 — load secure images
        const processed = await Promise.all(
          list.map(async (item) => {
            let imageSrc = null;

            if (item.imageUrl) {
              imageSrc = await fetchSecureImage(item.imageUrl);
            }

            return {
              ...item,
              imageSrc,
            };
          })
        );

        setNews(processed);
      } catch (error) {
        console.error("News Fetch Error:", error);
        Swal.fire(
          "Error",
          "Unable to load news. Please try again later.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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

        <motion.div
          className="relative text-center text-white px-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
            News & Updates
          </h1>
          <p className="mt-3 text-gray-200 text-sm md:text-base max-w-xl mx-auto">
            Stay informed about operational updates, aviation technology,
            and key developments at NCTHSL.
          </p>
        </motion.div>
      </motion.header>

      <motion.section
        className="py-20 px-6 bg-gradient-to-br from-[#818589] to-[#525354] min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.h1
            className="text-4xl font-bold text-[#f7f7f7] mb-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Latest News
          </motion.h1>

          {loading && (
            <div className="text-center text-white text-lg">Loading news...</div>
          )}

          {!loading && news.length === 0 && (
            <div className="text-center text-white text-lg">
              No news available yet.
            </div>
          )}

          <motion.div
            className="space-y-10"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {news.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <motion.article
                  key={item.id}
                  className="bg-white p-8 rounded-2xl shadow-md"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6 },
                    },
                  }}
                >
                  {item.imageSrc && (
                    <motion.img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-full h-64 object-cover rounded-xl mb-6"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.7 }}
                    />
                  )}

                  <motion.div
                    className="text-xs text-gray-500 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {item.createdAt?.slice(0, 10) || ""}
                    {" • "}
                    {item.author || "Admin"}
                  </motion.div>

                  <motion.h2 className="text-2xl font-bold text-[#0A4D2D] mb-3">
                    {item.title}
                  </motion.h2>

                  <motion.p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {isExpanded
                      ? item.content
                      : item.preview ||
                        (item.content
                          ? item.content.slice(0, 200) + "..."
                          : "")}
                  </motion.p>

                  <AnimatePresence>
                    {isExpanded && <motion.div />}
                  </AnimatePresence>

                  <motion.button
                    onClick={() => toggleExpand(item.id)}
                    className="mt-4 text-[#0A4D2D] font-semibold hover:underline"
                    whileHover={{ x: 5 }}
                  >
                    {isExpanded ? "Show Less ←" : "Read More →"}
                  </motion.button>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
