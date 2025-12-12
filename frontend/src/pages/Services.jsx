// src/pages/Services.jsx
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import ncaaLogo from "../assets/Images/compliance/ncaa.png";
import faanLogo from "../assets/Images/compliance/faan.png";

const PUBLIC_API = "https://enchanting-expression-production.up.railway.app/api/v1/service/all-service";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyNTZweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjRweCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef([]);

  const getImageUrl = (imagePath) => imagePath ? `${BASE_URL}${imagePath}` : PLACEHOLDER;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(PUBLIC_API);
        const list = res.data || [];
        const processed = list.map((service) => ({
          ...service,
          imageSrc: service.image ? getImageUrl(service.image) : null,
        }));
        setServices(processed);
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
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
      <div className="min-h-screen bg-gradient-to-br from-[#818589] to-[#525354] flex items-center justify-center">
        <div className="text-white text-3xl font-medium tracking-widest">Loading Services...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#818589] to-[#525354]">

      {/* Header */}
      <section className="py-20 md:py-28 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed"
          >
            Comprehensive aviation solutions delivered with precision, safety, and excellence.
          </motion.p>
        </div>
      </section>

      {/* Services — Reduced Spacing, Scalable for Many Items */}
      <section className="py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-28">  {/* Reduced from 32/48 to 20/28 */}
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={service.id}
                ref={el => sectionRefs.current.push(el)}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center elegant-entry ${isEven ? "" : "lg:flex-row-reverse"}`}
              >
                {/* Image */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="service-glow depth-lift w-full max-w-lg"
                  >
                    <img
                      src={service.imageSrc || PLACEHOLDER}
                      alt={service.title}
                      className="w-full h-72 md:h-96 object-cover rounded-3xl shadow-3xl"
                    />
                  </motion.div>
                </div>

                {/* Content */}
                <div className={`text-white ${isEven ? "lg:pr-8" : "lg:pl-8"} text-center lg:text-left`}>
                  <motion.h3
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-3xl md:text-5xl font-extrabold mb-6 text-red-500"
                  >
                    {service.title}
                  </motion.h3>
                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <ul className="space-y-4 text-left max-w-xl mx-auto lg:mx-0">
                    {service.features?.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-4 text-base md:text-lg"
                      >
                        <span className="text-red-500 text-2xl mt-1">•</span>
                        <span className="text-gray-100">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-10"
          >
            Certified Excellence
          </motion.h3>
          <p className="text-xl md:text-2xl text-gray-200 mb-14 max-w-4xl mx-auto">
            Fully compliant with Nigeria's highest aviation safety and regulatory standards.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-10 md:gap-16">
            <motion.div whileHover={{ scale: 1.1 }} className="depth-lift">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-3xl w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                <img src={ncaaLogo} alt="NCAA" className="w-full h-full object-contain" />
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="depth-lift">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-3xl w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                <img src={faanLogo} alt="FAAN" className="w-full h-full object-contain" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}