// src/pages/Testimonials.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const PUBLIC_API = "https://enchanting-expression-production.up.railway.app/api/v1/testimonials/all-testimonials";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gUGhvdG88L3RleHQ+PC9zdmc+";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER;
    return `${BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const res = await axios.get(PUBLIC_API);

        const list = Array.isArray(res.data) ? res.data : [];

        const processed = list.map((item) => ({
          ...item,
          imageSrc: item.image ? getImageUrl(item.image) : PLACEHOLDER,
          rating: item.rating || Math.floor(Math.random() * 2) + 4, // 4 or 5 if not provided
        }));

        setTestimonials(processed);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-3xl md:text-4xl transition-colors ${i < rating ? "star-filled" : "star-empty"}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#818589] to-[#525354] flex items-center justify-center">
        <div className="text-white text-3xl font-medium tracking-wide">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#818589] to-[#525354]">

      {/* Header */}
      <motion.section
        className="py-24 md:py-32 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight"
          >
            Client Testimonials
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed"
          >
            Trusted voices from aviation, defense, security, and energy sectors across Nigeria and beyond.
          </motion.p>
        </div>
      </motion.section>

      {/* Testimonials Grid — Fully Responsive */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {testimonials.length === 0 ? (
            <div className="text-center text-white text-2xl py-32 font-light">
              No testimonials available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              {testimonials.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  className="testimonial-glow depth-lift"
                >
                  <div className="p-8 md:p-10 text-center">
                    {/* Photo */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="mb-8"
                    >
                      <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full mx-auto shadow-2xl border-4 border-white/30"
                        onError={(e) => (e.target.src = PLACEHOLDER)}
                      />
                    </motion.div>

                    {/* Name & Role */}
                    <h3 className="text-2xl md:text-3xl font-bold text-[#0A4D2D] mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 font-medium mb-8 text-base md:text-lg">
                      {item.role}
                    </p>

                    {/* Unique Rating Stars */}
                    <div className="flex justify-center gap-1 mb-8">
                      {renderStars(item.rating)}
                    </div>

                    {/* Message */}
                    <p className="text-gray-800 italic leading-relaxed text-base md:text-lg px-4">
                      "{item.message}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}