// src/pages/About.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Target, Telescope, ChevronRight, Award, Shield, Zap } from "lucide-react";
import aboutBg from "../assets/Images/about/about-bg.jpg";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [partners, setPartners] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return "/placeholder-avatar.jpg";
    return `${BASE_URL}${path}`;
  };

  useEffect(() => {
    const loadAboutData = async () => {
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

        const leaderList = leadersRes.data || [];
        setLeaders(
          leaderList.map((leader) => ({
            ...leader,
            name: leader.fullName || leader.name,
            role: leader.position || leader.role,
            photoUrl: getImageUrl(leader.photo || leader.image),
          }))
        );
      } catch (err) {
        console.error("Failed to load About page data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activePillar, setActivePillar] = useState(0);
  const [activePartner, setActivePartner] = useState(0);

  useEffect(() => {
    if (!isMobile || !aboutData) return;
    const timer = setInterval(() => setActiveIndex((prev) => (prev + 1) % 2), 7000);
    return () => clearInterval(timer);
  }, [isMobile, aboutData]);

  useEffect(() => {
    if (!isMobile || !aboutData?.corePillars?.length) return;
    const timer = setInterval(() => setActivePillar((prev) => (prev + 1) % aboutData.corePillars.length), 7000);
    return () => clearInterval(timer);
  }, [isMobile, aboutData]);

  useEffect(() => {
    if (!isMobile || !partners.length) return;
    const timer = setInterval(() => setActivePartner((prev) => (prev + 1) % partners.length), 7000);
    return () => clearInterval(timer);
  }, [isMobile, partners]);

  const flipTransition = { duration: 2.5, ease: [0.2, 0.8, 0.2, 1] };

  // CORE PILLARS: Titles from API, everything else custom
  const pillarConfig = [
    {
      icon: Award,
      color: "from-green-600 to-emerald-700",
      iconColor: "text-green-400",
      description: "Striving for the highest standards. Continuous improvement and meticulous attention to detail in every operation.",
    },
    {
      icon: Shield,
      color: "from-blue-600 to-indigo-700",
      iconColor: "text-blue-400",
      description: "Unwavering honesty and accountability. We prioritize safety and trust above all else.",
    },
    {
      icon: Zap,
      color: "from-red-600 to-rose-700",
      iconColor: "text-red-400",
      description: "Adapting quickly to turbulence and operational challenges. We possess the unwavering drive to overcome any obstacle and safely achieve our mission.",
    },
  ];

  const corePillars = (aboutData?.corePillars || []).map((title, i) => ({
    title: title.trim(),
    ...pillarConfig[i % pillarConfig.length],
  }));

  // LEADER COLORS — 6 premium rotating colors
  const leaderColors = [
    "from-amber-600 to-yellow-700",
    "from-emerald-600 to-teal-700",
    "from-indigo-600 to-purple-700",
    "from-rose-600 to-pink-700",
    "from-cyan-600 to-blue-700",
    "from-orange-600 to-red-700",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a3a0a] to-[#052a05] flex items-center justify-center">
        <div className="text-white text-3xl font-bold">Loading About Us...</div>
      </div>
    );
  }

  return (
    <div className="w-full text-gray-800 about-enhanced-section">

      {/* HERO SECTION */}
      <section id="overview" className="relative text-white py-40 px-6 bg-center bg-cover bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${aboutBg})` }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 1.5 }} className="absolute inset-0 bg-black" />

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

          <p className="text-lg md:text-xl mt-4 opacity-90">
            Nigeria Customs Technical & Hangar Services Limited (NCTHSL) was
            established in August 2016 as a private company limited by shares
            pursuant to the Companies and Allied Matters Act 1990 with the
            Nigeria Customs Service and the Ministry of Finance Incorporated
            (MOFI).
          </p>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="mt-16 bg-black/40 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/10"
          >
            <h2 className="text-3xl font-bold">Company Overview</h2>
            <p className="text-gray-200 leading-relaxed text-lg mt-4">
              {aboutData?.overview || "Premier provider of aviation services, renowned for comprehensive offerings, technical expertise, and commitment to excellence."}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* MISSION & VISION — DIFFERENT COLORS */}
      <section id="mission" className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Our Mission & Vision
        </motion.h2>

        {isMobile ? (
          <div className="max-w-xl mx-auto" style={{ perspective: 1200 }}>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, rotateY: 90, scale: 0.98 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.98 }}
              transition={flipTransition}
              style={{ transformStyle: "preserve-3d" }}
              className={`p-10 rounded-2xl border border-white/20 backdrop-blur-xl shadow-xl text-center ${
                activeIndex === 0 ? "bg-gradient-to-br from-green-600/30 to-emerald-700/30" : "bg-gradient-to-br from-red-600/30 to-rose-700/30"
              }`}
            >
              <div style={{ backfaceVisibility: "hidden" }}>
                {activeIndex === 0 ? (
                  <>
                    <Target className="w-16 h-16 mx-auto mb-6 text-green-400 drop-shadow-xl" />
                    <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                    <p className="text-gray-200">
                      {aboutData?.mission || "Delivering excellence in aviation services with integrity and innovation."}
                    </p>
                  </>
                ) : (
                  <>
                    <Telescope className="w-16 h-16 mx-auto mb-6 text-red-400 drop-shadow-xl" />
                    <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                    <p className="text-gray-200">
                      {aboutData?.vision || "To be Africa's leading aviation institution with world-class standards."}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* MISSION - GREEN */}
            <motion.div
              whileHover={{ scale: 1.07, y: -8 }}
              className="p-10 bg-gradient-to-br from-green-600/20 to-emerald-700/20 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-2xl text-center"
            >
              <Target className="w-20 h-20 mx-auto mb-6 text-green-400 drop-shadow-2xl" />
              <h3 className="text-3xl font-bold mb-4 text-green-300">Our Mission</h3>
              <p className="text-gray-100 text-lg">
                {aboutData?.mission || "Delivering excellence in aviation services with integrity and innovation."}
              </p>
            </motion.div>

            {/* VISION - RED */}
            <motion.div
              whileHover={{ scale: 1.07, y: -8 }}
              className="p-10 bg-gradient-to-br from-red-600/20 to-rose-700/20 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-2xl text-center"
            >
              <Telescope className="w-20 h-20 mx-auto mb-6 text-red-400 drop-shadow-2xl" />
              <h3 className="text-3xl font-bold mb-4 text-red-300">Our Vision</h3>
              <p className="text-gray-100 text-lg">
                {aboutData?.vision || "To be Africa's leading aviation institution with world-class standards."}
              </p>
            </motion.div>
          </div>
        )}
      </section>

      {/* CORE PILLARS — TITLES FROM API, REST CUSTOM */}
      <section id="pillars" className="py-28 px-6 bg-gradient-to-br from-[#818589] to-[#525354] text-white">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Our Core Pillars
        </motion.h2>

        {isMobile ? (
          <div className="max-w-sm mx-auto" style={{ perspective: 1200 }}>
            <motion.div
              key={activePillar}
              initial={{ opacity: 0, rotateY: 90, scale: 0.98 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.98 }}
              transition={flipTransition}
              style={{ transformStyle: "preserve-3d" }}
              className={`p-10 rounded-2xl border backdrop-blur-xl shadow-xl text-center bg-gradient-to-br ${corePillars[activePillar]?.color}/20 border-white/20`}
            >
              <div style={{ backfaceVisibility: "hidden" }}>
                {corePillars[activePillar] && (() => {
                  const Icon = corePillars[activePillar].icon;
                  return (
                    <>
                      <Icon className={`w-16 h-16 mx-auto mb-6 ${corePillars[activePillar].iconColor} drop-shadow-xl`} />
                      <h3 className="text-2xl font-bold mb-3">{corePillars[activePillar].title}</h3>
                      <p className="text-gray-200 text-base leading-relaxed">
                        {corePillars[activePillar].description}
                      </p>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {corePillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.12, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className={`p-10 rounded-2xl border backdrop-blur-xl shadow-2xl text-center bg-gradient-to-br ${pillar.color}/20 border-white/20`}
                >
                  <Icon className={`w-20 h-20 mx-auto mb-6 ${pillar.iconColor} drop-shadow-2xl`} />
                  <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
                  <p className="text-gray-200 leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* PARTNERS */}
      <section id="partners" className="py-20 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#f7f7f7]">
          Our Trusted Partners
        </h2>
        <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
          We collaborate with respected organizations across aviation and logistics.
        </p>

        {isMobile ? (
          <div className="max-w-sm mx-auto mt-10" style={{ perspective: 1200 }}>
            <motion.div
              key={activePartner}
              initial={{ opacity: 0, rotateY: 90, scale: 0.98 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.98 }}
              transition={flipTransition}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-white rounded-xl p-10 shadow-md border border-gray-200 flex flex-col items-center"
            >
              <div style={{ backfaceVisibility: "hidden" }}>
                <img
                  src={getImageUrl(partners[activePartner]?.companyLogo || partners[activePartner]?.logo)}
                  alt={partners[activePartner]?.companyName || partners[activePartner]?.name}
                  className="w-32 h-32 object-contain mb-6 rounded-xl"
                  onError={(e) => e.target.src = "/placeholder-logo.png"}
                />
                <h3 className="font-semibold text-xl text-[#0A4D2D]">
                  {partners[activePartner]?.companyName || partners[activePartner]?.name || "Partner"}
                </h3>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
            {partners.length === 0 ? (
              <p className="col-span-full text-gray-300">No partners listed yet.</p>
            ) : (
              partners.map((partner, idx) => (
                <motion.div
                  key={partner.id || idx}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  whileHover={{ scale: 1.12, y: -10 }}
                  className="bg-white rounded-xl p-10 shadow-md border border-gray-200 flex flex-col items-center hover:bg-gray-50 transition"
                >
                  <img
                    src={getImageUrl(partner.companyLogo || partner.logo)}
                    alt={partner.companyName || partner.name}
                    className="w-32 h-32 object-contain mb-6 rounded-xl"
                    onError={(e) => e.target.src = "/placeholder-logo.png"}
                  />
                  <h3 className="font-semibold text-xl text-[#0A4D2D]">
                    {partner.companyName || partner.name}
                  </h3>
                </motion.div>
              ))
            )}
          </div>
        )}
      </section>

      {/* LEADERSHIP — EACH WITH UNIQUE COLOR */}
      <section id="leadership" className="w-full">
        <div className="bg-gradient-to-br from-[#818589] to-[#525354] text-[#f7f7f7] py-16 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Leadership Team
            </h1>
            <p className="mt-5 text-lg md:text-xl text-[#f7f7f7]/80 leading-relaxed">
              Meet the visionary executives driving aviation excellence, technical innovation,
              and operational leadership.
            </p>
          </div>
        </div>

        <div className="py-12 bg-gradient-to-br from-[#818589] to-[#525354] px-6">
          {leaders.length === 0 ? (
            <p className="text-center text-white text-xl">Leadership team coming soon...</p>
          ) : (
            <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-12 md:overflow-visible md:snap-none lg:grid-cols-3">
              {leaders.map((leader, index) => {
                const color = leaderColors[index % leaderColors.length];
                return (
                  <motion.div
                    key={leader.id || index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group relative bg-gradient-to-br ${color} p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] backdrop-blur-lg cursor-pointer flex-shrink-0 w-72 snap-center sm:w-auto`}
                  >
                    <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-110">
                      <img 
                        src={leader.photoUrl} 
                        alt={leader.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = "/placeholder-avatar.jpg"}
                      />
                      <div className="absolute inset-0 rounded-full border-4 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1">{leader.name}</h3>
                    <p className="text-white/90 font-semibold mb-4 text-sm tracking-wide">{leader.role}</p>
                    <p className="text-white/80 text-sm leading-relaxed">{leader.bio || "Dedicated leader in aviation excellence."}</p>

                    <div className="mt-6 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 text-white font-semibold">
                      View Profile
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}