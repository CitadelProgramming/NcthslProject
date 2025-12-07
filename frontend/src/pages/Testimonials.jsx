// src/pages/Testimonials.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Secure image fetch (same logic used in NewsPage)
  const fetchSecureImage = async (relativePath) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        `https://enchanting-expression-production.up.railway.app${relativePath}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      return URL.createObjectURL(res.data);
    } catch (err) {
      console.error("Image Fetch Failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await axios.get(
          "https://enchanting-expression-production.up.railway.app/api/v1/testimonials/all-testimonials",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const list = response.data || [];

        // Load secure images for each testimonial
        const processed = await Promise.all(
          list.map(async (item) => {
            let imageSrc = null;

            if (item.image) {
              imageSrc = await fetchSecureImage(item.image);
            }

            return {
              ...item,
              imageSrc,
              rating: 5, // default rating for now
            };
          })
        );

        setTestimonials(processed);
      } catch (error) {
        console.error("Testimonials Fetch Error:", error);
        Swal.fire(
          "Error",
          "Unable to load testimonials. Please try again later.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  return (
    <div className="w-full">
      {/* HEADER */}
      <motion.section
        className="bg-[#0A4D2D] text-white py-20 px-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          What Our Clients Say
        </motion.h1>

        <motion.p
          className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          Trusted by aviation, defense, security, and oil & gas industries across Nigeria and beyond.
        </motion.p>
      </motion.section>

      {/* TESTIMONIAL GRID */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#818589] to-[#525354]">
        <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <p className="text-center text-white text-lg col-span-full">
              Loading testimonials...
            </p>
          )}

          {!loading && testimonials.length === 0 && (
            <p className="text-center text-white text-lg col-span-full">
              No testimonials available yet.
            </p>
          )}

          {!loading &&
            testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-white shadow-md rounded-xl p-8 text-center cursor-default"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.7,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  rotateX: 2,
                  rotateY: -2,
                  transition: { duration: 0.35 },
                }}
              >
                {/* IMAGE */}
                {item.imageSrc && (
                  <motion.img
                    src={item.imageSrc}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-5 shadow"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* NAME */}
                <h3 className="text-xl font-semibold text-[#0A4D2D] mt-2">
                  {item.name}
                </h3>

                {/* ROLE / POSITION */}
                <p className="text-gray-600 mb-2 text-sm">{item.role}</p>

                {/* RATING */}
                <div className="text-yellow-500 mb-3 text-lg">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>

                {/* MESSAGE */}
                <p className="text-gray-700 text-sm italic leading-relaxed">
                  "{item.message}"
                </p>
              </motion.div>
            ))}
        </div>
      </section>
    </div>
  );
}
