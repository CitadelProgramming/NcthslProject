// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Target, Telescope } from "lucide-react";

import heroImg from "../assets/Images/hero/hero.jpg";
import aboutImg from "../assets/Images/about/about.png";

const BASE_URL = "https://enchanting-expression-production.up.railway.app";
const ABOUT_API = `${BASE_URL}/api/v1/about/all-about`;
const NEWS_API = `${BASE_URL}/api/v1/news/all-news`;
const GALLERY_API = `${BASE_URL}/api/v1/gallery/galleries`;

export default function Home() {
  const [aboutData, setAboutData] = useState(null);
  const [news, setNews] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => path ? `${BASE_URL}${path}` : null;

  const formatNewsDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return "Recently";
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [aboutRes, newsRes, galleryRes] = await Promise.all([
          axios.get(ABOUT_API),
          axios.get(NEWS_API),
          axios.get(GALLERY_API)
        ]);

        setAboutData(aboutRes.data?.[0] || {});

        const latestNews = (newsRes.data || []).slice(0, 3).map(item => ({
          ...item,
          imageSrc: getImageUrl(item.imageUrl)
        }));
        setNews(latestNews);

        const images = (galleryRes.data || [])
          .filter(g => g.galleryImage)
          .map(g => getImageUrl(g.galleryImage));
        setGalleryPreview(images.sort(() => 0.5 - Math.random()).slice(0, 4));
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a3a0a] to-[#052a05] flex items-center justify-center">
        <div className="text-white text-3xl font-bold">Loading NCTHSL...</div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-2xl font-bold z-10 transition">
              ×
            </button>
            <img src={selectedImage} alt="Full view" className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-r from-[#0A4D2D] to-[#145C36] text-white py-32 px-6 overflow-hidden">
        <img src={heroImg} alt="NCTHSL Hero" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Nigeria Customs Technical &<br/>Hangar Services Limited
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-xl md:text-2xl text-gray-100 max-w-4xl mx-auto mb-10 leading-relaxed">
            {aboutData?.overview || "Premier provider of aviation services, renowned for its comprehensive range of offerings, technical expertise, and commitment to excellence in service delivery."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/about" className="bg-white text-[#0A4D2D] font-bold px-10 py-4 rounded-xl shadow-2xl hover:bg-gray-100 transition text-lg">
              Learn More
            </Link>
            <Link to="/services" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white/10 transition text-lg font-medium">
              Our Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">About NCTHSL</h2>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10">
              {aboutData?.overview || "Leading the future of aviation services in Nigeria with innovation, safety, and excellence."}
            </p>

            <div className="space-y-6">
              <Link to="/testimonials" className="block bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl hover:bg-white/20 transition text-lg font-medium text-center">
                Client Testimonials
              </Link>
              <Link to="/about" className="block bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl text-center font-bold text-lg transition">
                Meet Our Leadership
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex justify-center">
            <img src={aboutImg} alt="About NCTHSL" className="w-full max-w-lg rounded-3xl shadow-2xl border-8 border-white/10" />
          </motion.div>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#818589] to-[#525354]">
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-5xl font-bold text-center mb-16 text-white">
            Latest News
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {news.length === 0 ? (
              <p className="col-span-3 text-center text-white text-xl">No news available</p>
            ) : (
              news.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                >
                  {item.imageSrc && (
                    <img src={item.imageSrc} alt={item.title} className="w-full h-56 object-cover" />
                  )}
                  <div className="p-8">
                    <p className="text-sm text-gray-300 mb-3">
                      {formatNewsDate(item.createdAt)} • {item.author || "NCTHSL"}
                    </p>
                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                    <p className="text-gray-200 leading-relaxed">
                      {item.preview || item.content?.substring(0, 120) + "..."}
                    </p>
                    <Link to="/news" className="inline-block mt-6 text-red-400 font-bold hover:text-red-300 transition">
                      Read More →
                    </Link>
                  </div>
                </motion.article>
              ))
            )}
          </div>

          <div className="text-center mt-16">
            <Link to="/news" className="inline-block bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-xl text-xl font-bold shadow-2xl transition transform hover:scale-105">
              View All News
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05]">
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-5xl font-bold text-center mb-16 text-white">
            Gallery Highlights
          </motion.h2>

          {galleryPreview.length === 0 ? (
            <p className="text-center text-white text-xl">Gallery coming soon...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {galleryPreview.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="group relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer"
                  onClick={() => setSelectedImage(src)}
                >
                  <img src={src} alt={`Gallery ${i+1}`} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute bottom-6 left-6 text-white font-bold text-lg">
                      View Image
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/gallery" className="inline-block bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-xl text-xl font-bold shadow-2xl transition transform hover:scale-105">
              Explore Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION & VISION — DIFFERENT COLORS + MULTI-COLOR INFINITE GLOW */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#818589] to-[#525354] text-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-20"
          >
            Our Mission & Vision
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-16">
            {/* MISSION — GREEN THEME + GLOW */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="mv-glow"
            >
              <div className="mv-inner bg-gradient-to-br from-emerald-900/30 to-green-900/30">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-emerald-600/30 rounded-full flex items-center justify-center">
                    <Target className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h3 className="text-4xl font-bold">Our Mission</h3>
                </div>
                <p className="text-xl text-gray-100 leading-relaxed">
                  {aboutData?.mission || "To deliver world-class aviation services with integrity, innovation, and excellence."}
                </p>
              </div>
            </motion.div>

            {/* VISION — RED THEME + GLOW */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="mv-glow"
            >
              <div className="mv-inner bg-gradient-to-br from-red-900/30 to-rose-900/30">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-red-600/30 rounded-full flex items-center justify-center">
                    <Telescope className="w-12 h-12 text-red-400" />
                  </div>
                  <h3 className="text-4xl font-bold">Our Vision</h3>
                </div>
                <p className="text-xl text-gray-100 leading-relaxed">
                  {aboutData?.vision || "To be Africa's leading aviation services provider, setting global standards in safety and efficiency."}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-16">
            <Link 
              to="/about"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-xl text-xl font-bold shadow-2xl transition transform hover:scale-105"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}