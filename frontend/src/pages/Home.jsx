// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
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

  const sectionRefs = useRef([]);

  const getImageUrl = (path) => path ? `${BASE_URL}${path}` : null;

  // Helper to format the weird date array
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: window.innerWidth < 768 ? 0.1 : 0.2 }
    );
    sectionRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a3a0a] to-[#052a05] flex items-center justify-center">
        <div className="text-white text-3xl md:text-4xl font-bold tracking-widest">NCTHSL</div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-3xl font-bold z-10"
            >
              ×
            </button>
            <img src={selectedImage} alt="Full view" className="w-full max-h-[90vh] object-contain rounded-3xl shadow-3xl" />
          </div>
        </motion.div>
      )}

      {/* HERO */}
      <section className="relative min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A4D2D]/95 via-[#0A4D2D]/70 to-[#0A4D2D]/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8 }}
          className="relative text-center px-6 md:px-12 z-10 max-w-7xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight">
            Nigeria Customs<br className="sm:hidden" /> Technical & Hangar<br className="hidden sm:inline" /> Services Limited
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-100 font-light max-w-5xl mx-auto leading-relaxed mb-12">
            {aboutData?.overview}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-10 justify-center">
            <Link to="/about" className="bg-white text-[#0A4D2D] font-bold px-12 py-5 md:px-16 md:py-7 rounded-xl shadow-2xl hover:shadow-3xl hover:bg-gray-50 transition text-lg md:text-xl depth-elevate">
              Our Legacy
            </Link>
            <Link to="/services" className="border-2 border-white text-white px-12 py-5 md:px-16 md:py-7 rounded-xl hover:bg-white/10 transition text-lg md:text-xl font-medium backdrop-blur-sm depth-elevate">
              Our Services
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ABOUT PREVIEW */}
      <section ref={el => sectionRefs.current.push(el)} className="py-20 md:py-32 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] elegant-entry">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1 text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-8">About NCTHSL</h2>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-12">
              {aboutData?.overview}
            </p>
            <Link to="/about" className="inline-block prestige-glow p-10 text-white font-bold text-xl md:text-2xl">
              Meet Our Leadership
            </Link>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <motion.img
              whileHover={{ scale: 1.03 }}
              src={aboutImg}
              alt="NCTHSL"
              className="rounded-3xl shadow-3xl border-8 border-white/10 w-full max-w-md md:max-w-xl prestige-glow"
            />
          </div>
        </div>
      </section>

      {/* LATEST NEWS — FIXED DATE + PREMIUM STYLE */}
      <section ref={el => sectionRefs.current.push(el)} className="py-20 md:py-32 px-6 bg-gradient-to-br from-[#818589] to-[#525354] elegant-entry">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-white mb-16 md:mb-20">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {news.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="prestige-glow depth-elevate overflow-hidden"
              >
                {item.imageSrc && (
                  <img src={item.imageSrc} alt={item.title} className="w-full h-56 md:h-64 object-cover" />
                )}
                <div className="p-8 md:p-10 institutional-glass">
                  <p className="text-sm text-gray-300 mb-4">
                    {formatNewsDate(item.createdAt)} • {item.author || "NCTHSL"}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                    {item.preview || item.content?.substring(0, 140) + "..."}
                  </p>
                  <Link to="/news" className="inline-block mt-6 text-red-400 font-bold hover:text-red-300 transition">
                    Read More →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="text-center mt-12 md:mt-20">
            <Link to="/news" className="inline-block prestige-glow p-8 md:p-10 text-white font-bold text-xl md:text-2xl">
              View All News
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-16 text-white"
          >
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
                  <img 
                    src={src} 
                    alt={`Gallery ${i+1}`}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
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
            <Link 
              to="/gallery"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-xl text-xl font-bold shadow-2xl transition transform hover:scale-105"
            >
              Explore Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
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
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#0a3a0a] to-[#052a05] p-12 rounded-3xl shadow-2xl border border-white/10"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center">
                  <Target className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-4xl font-bold">Our Mission</h3>
              </div>
              <p className="text-xl text-gray-200 leading-relaxed">
                {aboutData?.mission || "To deliver world-class aviation services with integrity, innovation, and excellence."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#0a3a0a] to-[#052a05] p-12 rounded-3xl shadow-2xl border border-white/10"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center">
                  <Telescope className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-4xl font-bold">Our Vision</h3>
              </div>
              <p className="text-xl text-gray-200 leading-relaxed">
                {aboutData?.vision || "To be Africa's leading aviation services provider, setting global standards in safety and efficiency."}
              </p>
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