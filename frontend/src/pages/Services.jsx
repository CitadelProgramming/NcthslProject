// src/pages/Services.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // ← THIS WAS MISSING!

// Public endpoint — confirmed working in Postman without token
const PUBLIC_API = "https://enchanting-expression-production.up.railway.app/api/v1/service/all-service";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

// Reliable placeholder (works offline)
const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyNTZweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjRweCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

import ncaaLogo from "../assets/Images/compliance/ncaa.png";
import faanLogo from "../assets/Images/compliance/faan.png";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER;
    return `${BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(PUBLIC_API); // Public endpoint — no token needed

        const list = res.data || [];
        const processed = list.map((service) => ({
          ...service,
          imageSrc: service.image ? getImageUrl(service.image) : null,
        }));

        setServices(processed);
      } catch (err) {
        console.error("Failed to load services:", err);
        setServices([]); // Ensure we don't show "loading" forever
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#818589] to-[#525354] flex items-center justify-center">
        <div className="text-white text-2xl font-medium">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white py-16 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Comprehensive aviation, logistics, and security services tailored for civil & military operators.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-br from-[#818589] to-[#525354]">
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-24">

          {services.length === 0 ? (
            <div className="text-center text-white text-2xl py-20 font-medium">
              No services available at the moment.
            </div>
          ) : (
            services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className="w-full flex justify-center">
                  {service.imageSrc ? (
                    <motion.img
                      src={service.imageSrc}
                      alt={service.title}
                      className="w-full max-w-xl h-64 sm:h-72 md:h-96 object-cover rounded-2xl shadow-2xl"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                      onError={(e) => {
                        e.target.src = PLACEHOLDER;
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 md:h-96 bg-gray-300 rounded-2xl flex items-center justify-center text-gray-600 text-xl font-medium shadow-xl">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="text-white px-2 md:px-4"
                >
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-700 mb-4 md:mb-6 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-6 md:mb-8">
                    {service.description}
                  </p>

                  <ul className="space-y-3 md:space-y-4">
                    {service.features?.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 text-base sm:text-lg"
                      >
                        <span className="text-red-700 mt-1.5">›</span>
                        <span className="text-black">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6"
          >
            Quality, Safety & Compliance
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-base sm:text-lg text-gray-200 mb-10 md:mb-12"
          >
            We operate under strict international aviation safety standards.
          </motion.p>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
            >
              <img src={ncaaLogo} alt="NCAA" className="w-full h-full object-contain" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
            >
              <img src={faanLogo} alt="FAAN" className="w-full h-full object-contain" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
