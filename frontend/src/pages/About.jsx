// src/pages/About.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Award, ShieldCheck, Flame, Target, Telescope, ChevronRight } from "lucide-react";

import aboutBg from "../assets/Images/about/about-bg.jpg";

// Public endpoints — NO TOKEN REQUIRED
const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gUGhvdG88L3RleHQ+PC9zdmc+";

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [partners, setPartners] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Carousel states for mobile flip
  const [activeIndex, setActiveIndex] = useState(0); // Mission/Vision
  const [activePillar, setActivePillar] = useState(0);
  const [activePartner, setActivePartner] = useState(0);

  // Auto-slide on mobile
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => setActiveIndex((prev) => (prev + 1) % 2), 7000);
    return () => clearInterval(timer);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !aboutData?.corePillars?.length) return;
    const timer = setInterval(() => setActivePillar((prev) => (prev + 1) % aboutData.corePillars.length), 7000);
    return () => clearInterval(timer);
  }, [isMobile, aboutData?.corePillars]);

  useEffect(() => {
    if (!isMobile || !partners.length) return;
    const timer = setInterval(() => setActivePartner((prev) => (prev + 1) % partners.length), 7000);
    return () => clearInterval(timer);
  }, [isMobile, partners.length]);

  const getImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    return `${BASE_URL}${path}`;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [aboutRes, partnersRes, leadersRes] = await Promise.all([
          axios.get(`${API_BASE}/about/all-about`),
          axios.get(`${API_BASE}/partners/all-partners`),
          axios.get(`${API_BASE}/leadership/leaders`),
        ]);

        const about = aboutRes.data?.[0] || {};
        setAboutData(about);

        setPartners(partnersRes.data || []);
        setLeaders(leadersRes.data || []);
      } catch (err) {
        console.error("Failed to load About page data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#818589] to-[#525354] flex items-center justify-center">
        <div className="text-white text-2xl">Loading About Us...</div>
      </div>
    );
  }

  const overview = aboutData?.overview || "Welcome to NCTHSL — Excellence in Aviation Services.";
  const mission = aboutData?.mission || "To deliver world-class aviation solutions with integrity and innovation.";
  const vision = aboutData?.vision || "To be the leading aviation service provider in Africa.";

  const pillars = Array.isArray(aboutData?.corePillars)
    ? aboutData.corePillars.map((p, i) => ({
        title: p.trim() || `Pillar ${i + 1}`,
        desc: "Committed to excellence, safety, and innovation.",
        icon: [Award, ShieldCheck, Flame][i % 3] || Award,
      }))
    : [];

  return (
    <div className="w-full text-gray-800 about-enhanced-section">

      {/* HERO SECTION */}
      <section
        className="relative text-white py-40 px-6 bg-center bg-cover bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-black"
        />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <motion.h1
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="text-5xl md:text-6xl font-extrabold tracking-wide drop-shadow-xl"
          >
            About Us
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="mt-16 bg-black/40 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/10"
          >
            <h2 className="text-3xl font-bold">Company Overview</h2>
            <p className="text-gray-200 leading-relaxed text-lg mt-4 whitespace-pre-line">
              {overview}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Our Mission & Vision
        </motion.h2>

        {isMobile ? (
          <div className="max-w-xl mx-auto" style={{ perspective: 1200 }}>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="p-10 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl shadow-xl text-center"
            >
              {activeIndex === 0 ? (
                <>
                  <Target className="w-16 h-16 mx-auto mb-6 text-red-600 drop-shadow-xl" />
                  <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-200">{mission}</p>
                </>
              ) : (
                <>
                  <Telescope className="w-16 h-16 mx-auto mb-6 text-red-600 drop-shadow-xl" />
                  <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                  <p className="text-gray-200">{vision}</p>
                </>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <motion.div
              whileHover={{ scale: 1.07, y: -8, boxShadow: "0 0 25px rgba(255,255,255,0.35)" }}
              transition={{ type: "spring", stiffness: 150 }}
              className="p-10 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl text-center"
            >
              <Target className="w-20 h-20 mx-auto mb-6 text-red-600 drop-shadow-xl" />
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-200">{mission}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.07, y: -8, boxShadow: "0 0 25px rgba(255,255,255,0.35)" }}
              transition={{ type: "spring", stiffness: 150 }}
              className="p-10 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl text-center"
            >
              <Telescope className="w-20 h-20 mx-auto mb-6 text-red-600 drop-shadow-xl" />
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-200">{vision}</p>
            </motion.div>
          </div>
        )}
      </section>

      {/* CORE PILLARS */}
      {pillars.length > 0 && (
        <section className="py-28 px-6 bg-gradient-to-br from-[#818589] to-[#525354] text-white">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Our Core Pillars</h2>

          {isMobile ? (
            <div className="max-w-sm mx-auto" style={{ perspective: 1200 }}>
              <motion.div
                key={activePillar}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 2.5 }}
                style={{ transformStyle: "preserve-3d" }}
                className="p-10 bg-white/10 backdrop-blur-xl rounded-2xl text-center shadow-xl border border-white/10"
              >
                {(() => {
                  const Icon = pillars[activePillar].icon;
                  return <Icon className="w-16 h-16 mx-auto mb-4 text-red-600" />;
                })()}
                <h3 className="text-2xl font-bold">{pillars[activePillar].title}</h3>
                <p className="text-gray-300 mt-3">{pillars[activePillar].desc}</p>
              </motion.div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.12, y: -12, boxShadow: "0 0 30px rgba(0,255,180,0.35)" }}
                    transition={{ duration: 0.35 }}
                    className="p-10 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 text-center shadow-xl"
                  >
                    <Icon className="w-16 h-16 mx-auto mb-4 text-red-600" />
                    <h3 className="font-bold text-2xl mb-2">{pillar.title}</h3>
                    <p className="text-gray-300">{pillar.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* PARTNERS */}
      {partners.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#f7f7f7]">Our Trusted Partners</h2>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            We collaborate with respected organizations across aviation and logistics.
          </p>

          {isMobile ? (
            <div className="max-w-sm mx-auto mt-10" style={{ perspective: 1200 }}>
              <motion.div
                key={activePartner}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 2.5 }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-white rounded-xl p-10 shadow-md border border-gray-200 flex flex-col items-center"
              >
                <img
                  src={getImageUrl(partners[activePartner].companyLogo)}
                  alt={partners[activePartner].companyName}
                  className="w-32 h-32 object-contain mb-4"
                  onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                />
                <h3 className="font-semibold text-xl text-[#0A4D2D]">
                  {partners[activePartner].companyName}
                </h3>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
              {partners.map((partner, i) => (
                <motion.div
                  key={partner.id || i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.12, y: -10, boxShadow: "0 0 20px rgba(10,77,45,0.45)" }}
                  className="bg-white rounded-xl p-10 shadow-md border border-gray-200 flex flex-col items-center hover:bg-gray-50 transition"
                >
                  <img
                    src={getImageUrl(partner.companyLogo)}
                    alt={partner.companyName}
                    className="w-32 h-32 object-contain mb-4"
                    onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                  />
                  <h3 className="font-semibold text-xl text-[#0A4D2D]">{partner.companyName}</h3>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* LEADERSHIP TEAM */}
      {leaders.length > 0 && (
        <section className="w-full">
          <div className="bg-gradient-to-br from-[#818589] to-[#525354] text-[#f7f7f7] py-16 px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Leadership Team</h1>
            <p className="mt-5 text-lg md:text-xl text-[#f7f7f7]/80 leading-relaxed">
              Meet the visionary executives driving aviation excellence, technical innovation, and operational leadership.
            </p>
          </div>

          <div className="py-12 bg-gradient-to-br from-[#818589] to-[#525354] px-6">
            <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {leaders.map((leader, i) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-[#B8860B] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] backdrop-blur-lg cursor-pointer flex-shrink-0 w-72 snap-center md:w-auto"
                >
                  <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-110">
                    <img
                      src={getImageUrl(leader.image)}
                      alt={leader.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-[#0A4D2D] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#0A4D2D] mb-1">{leader.fullName}</h3>
                  <p className="text-red-700 font-semibold mb-4 text-sm tracking-wide">{leader.position}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{leader.bio || "Dedicated leader in aviation excellence."}</p>

                  <div className="mt-6 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 text-red-700 font-semibold">
                    View Profile
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}