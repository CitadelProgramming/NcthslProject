// src/pages/Testimonials.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// Public endpoint — confirmed working without token
const PUBLIC_API = "https://enchanting-expression-production.up.railway.app/api/v1/testimonials/all-testimonials";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

// Reliable placeholder
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
        const res = await axios.get(PUBLIC_API); // Public — no token needed!

        const list = Array.isArray(res.data) ? res.data : [];

        const processed = list.map((item) => ({
          ...item,
          imageSrc: item.image ? getImageUrl(item.image) : PLACEHOLDER,
          rating: item.rating || 5, // fallback to 5 stars
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#818589] to-[#525354] flex items-center justify-center">
        <div className="text-white text-2xl font-medium">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <motion.section
        className="bg-gradient-to-br from-[#0A4D2D] to-[#052a05] text-white py-24 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            What Our Clients Say
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
          >
            Trusted by aviation, defense, security, and oil & gas industries across Nigeria and beyond.
          </motion.p>
        </div>
      </motion.section>

      {/* Testimonials Grid */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#818589] to-[#525354]">
        <div className="max-w-7xl mx-auto">
          {testimonials.length === 0 ? (
            <div className="text-center text-white text-2xl py-20 font-light">
              No testimonials available at the moment.
            </div>
          ) : (
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.15,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden transform-gpu"
                >
                  {/* Photo */}
                  <div className="p-8 pb-0">
                    <motion.img
                      src={item.imageSrc}
                      alt={item.name}
                      className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full mx-auto shadow-xl border-4 border-white"
                      whileHover={{ scale: 1.1 }}
                      onError={(e) => (e.target.src = PLACEHOLDER)}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-[#0A4D2D] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 font-medium mb-4">{item.role}</p>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6 text-yellow-500 text-2xl">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < item.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 italic leading-relaxed text-base">
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