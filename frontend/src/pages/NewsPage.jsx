// src/pages/NewsPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import your images
import news1 from "../assets/images/news/news1.jpg";
import news2 from "../assets/images/news/news2.jpeg";
import news3 from "../assets/images/news/news3.jpg";

// Page header image
import headerImg from "../assets/images/news/news-header.jpg";

export default function NewsPage() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const news = [
    {
      id: 1,
      title: "NCTHSL Expands FBO Operations",
      category: "FBO",
      author: "Admin",
      date: "2025-11-01",
      coverImage: news1,
      galleryImages: [],
      preview: `
        NCTHSL has expanded its Fixed Base Operations to support more 
        international flights. The upgrade includes new fueling bays...
      `,
      fullContent: `
        NCTHSL has expanded its Fixed Base Operations to support more international flights. 
        This major development includes new fueling bays, extended hangar capacity, upgraded 
        maintenance equipment, and an expanded apron that can now accommodate additional 
        executive aircraft.

        The upgrade also includes the construction of modern VIP lounges designed for 
        comfort, privacy, and seamless travel experience. Passengers can now enjoy 
        dedicated lounges with enhanced security, premium catering, high-speed Wi-Fi, 
        conference facilities, and improved passenger handling efficiency.

        These improvements align with NCTHSL’s commitment to deliver world-class ground 
        support, reduce aircraft turnaround time, and strengthen Nigeria’s aviation 
        infrastructure.
      `
    },
    {
      id: 2,
      title: "New UAV Capability for Geo-Intelligence",
      category: "Aviation",
      author: "Admin",
      date: "2025-10-18",
      coverImage: news2,
      galleryImages: [],
      preview: `
        A new advanced UAV mapping capability has been introduced to support aerial 
        surveillance and terrain mapping...
      `,
      fullContent: `
        NCTHSL has deployed a new generation of UAVs equipped with advanced sensors 
        for high-accuracy geo-intelligence operations. These UAV platforms are capable 
        of long-range flights, high-resolution terrain imaging, thermal detection, and 
        precise aerial mapping used in surveillance, border monitoring, emergency response, 
        and environmental analysis.

        The system integrates real-time telemetry, AI-powered terrain reconstruction, 
        and encrypted communication channels, ensuring secure and reliable data delivery. 
        This new capability supports aviation operations, national security agencies, and 
        private sector clients requiring precision geospatial intelligence.
      `
    },
    {
      id: 3,
      title: "EASA-Compliant Maintenance Procedures Adopted",
      category: "Maintenance",
      author: "Admin",
      date: "2025-09-24",
      coverImage: news3,
      galleryImages: [],
      preview: `
        Our maintenance and safety workflow has been updated to align with EASA standards...
      `,
      fullContent: `
        NCTHSL has officially updated its maintenance, repair, and overhaul (MRO) 
        procedures to align with EASA Part-145 standards. These new safety protocols ensure 
        that aircraft maintenance operations meet the highest levels of international 
        compliance.

        The updated workflow includes enhanced quality assurance processes, precision 
        inspection routines, digital maintenance tracking, and strict adherence to OEM 
        requirements. The new framework improves aircraft reliability, safety performance, 
        and operational efficiency across all engineering departments.

        This milestone reinforces NCTHSL’s commitment to international best practices and 
        positions the company as a leading aviation maintenance service provider.
      `
    }
  ];

  return (
    <>
      {/* Header */}
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

      {/* Main Section */}
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
                  {/* Image */}
                  <motion.img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                  />

                  {/* Meta */}
                  <motion.div
                    className="text-xs text-gray-500 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {item.category} • {item.date} • {item.author}
                  </motion.div>

                  {/* Title */}
                  <motion.h2 className="text-2xl font-bold text-[#0A4D2D] mb-3">
                    {item.title}
                  </motion.h2>

                  {/* Preview or Full Content */}
                  <motion.p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {isExpanded ? item.fullContent : item.preview}
                  </motion.p>

                  {/* Expandable Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4"
                      ></motion.div>
                    )}
                  </AnimatePresence>

                  {/* READ MORE / SHOW LESS */}
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
