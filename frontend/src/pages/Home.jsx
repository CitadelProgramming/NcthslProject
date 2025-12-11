// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Award, ShieldCheck, Flame, Image, Newspaper, Target, Telescope } from "lucide-react";

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

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [aboutRes, newsRes, galleryRes] = await Promise.all([
          axios.get(ABOUT_API),
          axios.get(NEWS_API),
          axios.get(GALLERY_API)
        ]);

        const about = aboutRes.data?.[0] || {};
        setAboutData(about);

        const latestNews = (newsRes.data || []).slice(0, 3).map(item => ({
          ...item,
          imageSrc: getImageUrl(item.imageUrl)
        }));
        setNews(latestNews);

        const allImages = (galleryRes.data || [])
          .filter(g => g.galleryImage)
          .map(g => getImageUrl(g.galleryImage));
        const shuffled = allImages.sort(() => 0.5 - Math.random());
        setGalleryPreview(shuffled.slice(0, 4));

      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // Elegant scroll fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-3xl font-light tracking-widest">NCTHSL</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50">

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
            <img src={selectedImage} alt="Full view" className="w-full max-h-[90vh] object-contain rounded-2xl shadow-3xl" />
          </div>
        </motion.div>
      )}

      {/* HERO — PARALLAX + DEPTH */}
      <section className="relative h-screen parallax-bg" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          className="relative h-full flex items-center justify-center text-center px-6 z-10"
        >
          <div className="max-w-6xl">
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
              Nigeria Customs<br/>Technical & Hangar<br/>Services Limited
            </h1>
            <p className="text-xl md:text-3xl text-gray-100 font-light max-w-4xl mx-auto leading-relaxed">
              {aboutData?.overview || "Excellence in Aviation Maintenance, Safety, and Technical Innovation"}
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link to="/about" className="bg-white text-emerald-800 font-bold px-12 py-5 rounded-xl shadow-2xl hover:shadow-3xl hover:bg-gray-100 transition text-xl">
                Discover Our Legacy
              </Link>
              <Link to="/services" className="border-2 border-white text-white px-12 py-5 rounded-xl hover:bg-white/10 transition text-xl font-medium backdrop-blur-sm">
                Explore Services
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ABOUT PREVIEW — ELEGANT GLASS */}
      <section ref={(el) => sectionRefs.current.push(el)} className="py-32 px-6 bg-gradient-to-br from-slate-900 to-slate-800 fade-in-up">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-10">About NCTHSL</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              {aboutData?.overview || "A premier aviation service provider committed to technical excellence, safety, and operational reliability."}
            </p>
            <div className="space-y-6">
              <Link to="/about" className="block glass-panel p-8 text-center text-white font-semibold text-xl hover:bg-white/10 transition">
                Meet Our Leadership
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <motion.img
              whileHover={{ scale: 1.03 }}
              src={aboutImg}
              alt="NCTHSL"
              className="rounded-3xl shadow-3xl border-8 border-white/10 max-w-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* LATEST NEWS — CLEAN & MINIMAL */}
      <section ref={(el) => sectionRefs.current.push(el)} className="py-32 px-6 bg-gray-50 fade-in-up">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-gray-900 mb-20">Latest Updates</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {news.length === 0 ? (
              <p className="col-span-3 text-center text-gray-600 text-xl">No recent updates</p>
            ) : (
              news.map((item, i) => (
                <motion.article
                  key={item.id}
                  whileHover={{ y: -12 }}
                  className="glass-panel depth-card overflow-hidden"
                >
                  {item.imageSrc && (
                    <img src={item.imageSrc} alt={item.title} className="w-full h-64 object-cover" />
                  )}
                  <div className="p-8">
                    <p className="text-sm text-gray-500 mb-4 font-medium">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {item.preview || item.content?.substring(0, 140) + "..."}
                    </p>
                    <Link to="/news" className="inline-block mt-6 text-emerald-600 font-bold hover:text-emerald-700 transition">
                      Read More →
                    </Link>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* GALLERY — SUBTLE 3D HOVER */}
      <section ref={(el) => sectionRefs.current.push(el)} className="py-32 px-6 bg-gradient-to-br from-slate-900 to-slate-800 fade-in-up">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-white mb-20">Gallery Highlights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {galleryPreview.map((src, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -16, rotateY: 5 }}
                className="depth-card cursor-pointer overflow-hidden rounded-3xl shadow-2xl"
                onClick={() => setSelectedImage(src)}
              >
                <img src={src} alt={`Gallery ${i+1}`} className="w-full h-72 object-cover transition-transform duration-700 hover:scale-110" />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link to="/gallery" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-14 py-6 rounded-xl text-xl font-bold shadow-2xl transition transform hover:scale-105">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION & VISION — REFINED */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-gray-900 mb-20">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="glass-panel p-16 text-center">
              <Target className="w-24 h-24 mx-auto mb-10 text-emerald-600" />
              <h3 className="text-4xl font-bold mb-8 text-gray-900">Our Mission</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                {aboutData?.mission}
              </p>
            </div>
            <div className="glass-panel p-16 text-center">
              <Telescope className="w-24 h-24 mx-auto mb-10 text-blue-600" />
              <h3 className="text-4xl font-bold mb-8 text-gray-900">Our Vision</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                {aboutData?.vision}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}