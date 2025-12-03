import React from "react";
import { motion } from "framer-motion";

// Import testimonial images (6 images total)
import client1 from "../assets/images/testimonials/client1.jpg";
import client2 from "../assets/images/testimonials/client2.jpg";
import client3 from "../assets/images/testimonials/client3.jpg";
import client4 from "../assets/images/testimonials/client4.jpg"
import client5 from "../assets/images/testimonials/client5.jpg";
import client6 from "../assets/images/testimonials/client6.jpeg";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Captain Ibrahim Musa",
      position: "Aviation Operations Partner",
      message:
        "NCTHSL has consistently delivered world-class technical and aviation services. Their professionalism, precision, and safety standards are unmatched.",
      rating: 5,
      image: client1,
    },
    {
      name: "Engr. Tunde Okafor",
      position: "Maintenance & Engineering Lead",
      message:
        "Their maintenance support and technical expertise have drastically improved our operational efficiency. Truly reliable and trusted.",
      rating: 5,
      image: client2,
    },
    {
      name: "Maryam A.",
      position: "Charter Services Client",
      message:
        "From booking to touchdown, the experience was seamless. Their charter service is the best in the industry—efficient, safe, and reliable.",
      rating: 4,
      image: client3,
    },
    {
      name: "Samuel Johnson",
      position: "Oil & Gas Logistics Coordinator",
      message:
        "NCTHSL provides excellent offshore and remote support services. Highly secure, efficient, and impressively responsive.",
      rating: 5,
      image: client4,
    },
    {
      name: "Ms. Rebecca Adams",
      position: "Corporate Flight Manager",
      message:
        "Their attention to detail and aircraft readiness is second to none. NCTHSL remains our number one partner for corporate aviation needs.",
      rating: 4,
      image: client5,
    },
    {
      name: "Major Abdullahi Garba",
      position: "Defense Air Mobility Supervisor",
      message:
        "Their technical hangar support has improved our mission readiness significantly. Reliable, trustworthy, and exceptional service delivery.",
      rating: 5,
      image: client6,
    },
  ];

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

          {testimonials.map((item, index) => (
            <motion.div
              key={index}
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
              <motion.img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-5 shadow"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />

              {/* NAME */}
              <h3 className="text-xl font-semibold text-[#0A4D2D] mt-2">
                {item.name}
              </h3>

              {/* POSITION */}
              <p className="text-gray-600 mb-2 text-sm">{item.position}</p>

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
