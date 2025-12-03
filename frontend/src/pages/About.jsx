
import { useEffect, useState } from "react";
import { Award, ShieldCheck, Flame, Users, Briefcase, Building, Target, Telescope, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import aboutBg from "../assets/Images/about/about-bg.jpg";

// Import images
import acgAb from "../assets/images/leadership/acg-ab.png";
import acgT from "../assets/images/leadership/acg-t.jpg";
import comp from "../assets/images/leadership/comp.png";
import dcg from "../assets/images/leadership/dcg.jpeg";
import dr from "../assets/images/leadership/dr.png";
import la from "../assets/images/leadership/la.png";
import md from "../assets/images/leadership/md.png";

export default function About() {

  const leaders = [
    {
      name: "DCG. A. O. Alajogun",
      title: "Chairman",
      img: dcg,
      bio: "Deputy Comptroller General || EI&I Nigeria Customs Service Headquarters.",
    },
    {
      name: "Dr. Femi Ogunseinde",
      title: "Executive Director Investment",
      img: dr,
      bio: "Ministry of Finance Incorporated (MOFI).",
    },
    {
      name: "Capt. KW Mbaya",
      title: "Managing Director",
      img: md,
      bio: ".....",
    },
    {
      name: "Ms Hauwa Ibrahim Kuchi",
      title: "Company Secretary",
      img: la,
      bio: "Asst. Legal Adviser || Legal Dept. Nigeria Customs Service.",
    },
    {
      name: "ACG. AB Mohammed",
      title: "Asst. Comptroller General (TS)",
      img: acgAb,
      bio: "Nigeria Customs Service.",
    },
    {
      name: "ACG Timi Bomodi",
      title: "Assistant Comptroller General EI&I",
      img: acgT,
      bio: "Nigeria Customs Service.",
    },
    {
      name: "Comptroller N. Isiyaku",
      title: "Comptroller (Trade Facilitation)",
      img: comp,
      bio: "Nigeria Customs Service.",
    },
  ];

  const partners = [
    { name: "Quorum Aviation", icon: Users },
    { name: "Sea Jewel Energy Ltd", icon: Briefcase },
    { name: "Mounthill Aviation Ltd", icon: Building },
  ];

  const pillars = [
    {
      title: "Excellence",
      icon: Award,
      desc: "Precision-driven aircraft maintenance ensuring unmatched airworthiness.",
    },
    {
      title: "Integrity",
      icon: ShieldCheck,
      desc: "Transparent engineering processes and accountable technical operations.",
    },
    {
      title: "Resilience",
      icon: Flame,
      desc: "Mission-ready aviation logistics and dependable operational support.",
    },
  ];

  // MOBILE DETECTION
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // CAROUSEL STATES
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePillar, setActivePillar] = useState(0);
  const [activePartner, setActivePartner] = useState(0);

  // AUTOSLIDE: Mission & Vision
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => setActiveIndex((prev) => (prev + 1) % 2), 7000);
    return () => clearInterval(timer);
  }, [isMobile]);

  // AUTOSLIDE: Pillars
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(
      () => setActivePillar((prev) => (prev + 1) % pillars.length),
      7000
    );
    return () => clearInterval(timer);
  }, [isMobile]);

  // AUTOSLIDE: Partners
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(
      () => setActivePartner((prev) => (prev + 1) % partners.length),
      7000
    );
    return () => clearInterval(timer);
  }, [isMobile]);

  // 3D flip transition settings
  const flipTransition = { duration: 2.5, ease: [0.2, 0.8, 0.2, 1] };

  return (
    <div className="w-full text-gray-800 about-enhanced-section">

      {/* HERO SECTION */}
      <section id="overview"
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
              Nigeria Customs Technical & Hangar Services Limited (NCTHSL) is a
              premier provider of aviation services, renowned for its
              comprehensive range of offerings, technical expertise, and
              commitment to excellence in service delivery.
              <br /><br />
              We take pride in being your one-stop shop for all your aviation needs.
              Whether you are a commercial airline, private operator, or an
              individual, we ensure safe and efficient operations.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* MISSION & VISION */}
      <section id="mission" className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Our Mission & Vision
        </motion.h2>

        {/* MOBILE: 3D Flip */}
        {isMobile ? (
          <div className="max-w-xl mx-auto" style={{ perspective: 1200 }}>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, rotateY: 90, scale: 0.98 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.98 }}
              transition={flipTransition}
              style={{ transformStyle: "preserve-3d" }}
              className="p-10 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl shadow-xl text-center"
            >
              <div style={{ backfaceVisibility: "hidden" }}>
                {activeIndex === 0 ? (
                  <>
                    <Target className="w-16 h-16 mx-auto mb-6 text-red-600 drop-shadow-xl" />
                    <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                    <p className="text-gray-200">
                      To become the most recognized and profitable
                      government-owned aviation company—dedicated to excellence,
                      innovation, and sustainable growth.
                    </p>
                  </>
                ) : (
                  <>
                    <Telescope className="w-16 h-16 mx-auto mb-6 text-red-600 drop-shadow-xl" />
                    <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                    <p className="text-gray-200">
                      To build a world-class aviation institution that supports
                      Nigeria and the global aviation sector with exceptional
                      safety, professionalism, and operational excellence.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          // DESKTOP
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <motion.div
              whileHover={{
                scale: 1.07,
                y: -8,
                boxShadow: "0 0 25px rgba(255,255,255,0.35)",
              }}
              transition={{ type: "spring", stiffness: 150 }}
              className="p-10 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl text-center"
            >
              <Target className="w-20 h-20 mx-auto mb-6 text-red-600 drop-shadow-xl" />
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-200">
                To become the most recognized and profitable government-owned
                aviation company—dedicated to excellence, innovation, and
                sustainable growth.
              </p>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.07,
                y: -8,
                boxShadow: "0 0 25px rgba(255,255,255,0.35)",
              }}
              transition={{ type: "spring", stiffness: 150 }}
              className="p-10 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl text-center"
            >
              <Telescope className="w-20 h-20 mx-auto mb-6 text-red-600 drop-shadow-xl" />
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-200">
                To build a world-class aviation institution that supports
                Nigeria and the global aviation sector with exceptional safety,
                professionalism, and operational excellence.
              </p>
            </motion.div>
          </div>
        )}
      </section>

      {/* CORE PILLARS */}
      <section id="pillars" className="py-28 px-6 bg-gradient-to-br from-[#818589] to-[#525354] text-white">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Our Core Pillars
        </h2>

        {isMobile ? (
          <div className="max-w-sm mx-auto" style={{ perspective: 1200 }}>
            <motion.div
              key={activePillar}
              initial={{ opacity: 0, rotateY: 90, scale: 0.98 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.98 }}
              transition={flipTransition}
              style={{ transformStyle: "preserve-3d" }}
              className="p-10 bg-white/10 backdrop-blur-xl rounded-2xl text-center shadow-xl border border-white/10"
            >
              <div style={{ backfaceVisibility: "hidden" }}>
                {(() => {
                  const Icon = pillars[activePillar].icon;
                  return <Icon className="w-16 h-16 mx-auto mb-4 text-red-600" />;
                })()}
                <h3 className="text-2xl font-bold">{pillars[activePillar].title}</h3>
                <p className="text-gray-300 mt-3">{pillars[activePillar].desc}</p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.12,
                    y: -12,
                    boxShadow: "0 0 30px rgba(0,255,180,0.35)",
                  }}
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
                {(() => {
                  const Icon = partners[activePartner].icon;
                  return <Icon className="w-20 h-20 text-red-600 mb-4 drop-shadow-xl" />;
                })()}
                <h3 className="font-semibold text-xl text-[#0A4D2D]">
                  {partners[activePartner].name}
                </h3>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
            {partners.map((partner, idx) => {
              const Icon = partner.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  whileHover={{
                    scale: 1.12,
                    y: -10,
                    boxShadow: "0 0 20px rgba(10,77,45,0.45)",
                  }}
                  className="bg-white rounded-xl p-10 shadow-md border border-gray-200 flex flex-col items-center hover:bg-gray-50 transition"
                >
                  <Icon className="w-20 h-20 text-red-600 mb-4 drop-shadow-xl" />
                  <h3 className="font-semibold text-xl text-[#0A4D2D]">
                    {partner.name}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= LEADERSHIP TEAM SECTION ================= */}
      <section id="leadership" className="w-full">

        {/* HEADER SECTION (Reduced padding) */}
        <div className="bg-gradient-to-br from-[#818589] to-[#525354] text-[#f7f7f7] py-16 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight animate-fadeIn">
              Leadership Team
            </h1>
            <p className="mt-5 text-lg md:text-xl text-[#f7f7f7]/80 leading-relaxed animate-slideUp">
              Meet the visionary executives driving aviation excellence, technical innovation,
              and operational leadership.
            </p>
          </div>
        </div>

        {/* LEADERS GRID (Reduced padding) */}
        <div className="py-12 bg-gradient-to-br from-[#818589] to-[#525354] px-6">
          <div
            className="
              max-w-7xl mx-auto
              flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory
              md:grid md:grid-cols-2 md:gap-12 md:overflow-visible md:snap-none
              lg:grid-cols-3
            "
          >

            {leaders.map((leader, index) => (
              <div
                key={index}
                className="
                    group relative bg-white p-8 rounded-3xl shadow-lg 
                    hover:shadow-2xl transition-all duration-500 
                    hover:-translate-y-3 hover:scale-[1.03]
                    backdrop-blur-lg cursor-pointer
                    flex-shrink-0 w-72 snap-center     /* MOBILE horizontal card sizing */
                    sm:w-auto                           /* RESET ON DESKTOP */
                  "

                style={{ animationDelay: `${index * 120}ms` }}
              >

                {/* IMAGE */}
                <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-110">
                  <img src={leader.img} alt={leader.name} className="w-full h-full object-cover" />
                  <div className="
                      absolute inset-0 rounded-full border-4 border-[#0A4D2D] 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    "></div>
                </div>

                {/* NAME / TITLE */}
                <h3 className="text-2xl font-bold text-[#0A4D2D] mb-1">{leader.name}</h3>
                <p className="text-red-700 font-semibold mb-4 text-sm tracking-wide">{leader.title}</p>

                <p className="text-gray-700 text-sm leading-relaxed">{leader.bio}</p>

                {/* ARROW HOVER */}
                <div className="mt-6 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 text-red-700 font-semibold">
                  View Profile
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}