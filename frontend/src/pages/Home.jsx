// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { Award, ShieldCheck, Flame, Image, Newspaper, Target, Telescope } from "lucide-react";
import { motion } from "framer-motion";

import heroImg from "../assets/Images/hero/hero.jpg";
import aboutImg from "../assets/Images/about/about.png";

/* Gallery imports */
import Gallery from "../pages/Gallery";
import gallery1 from "../assets/Images/gallery/gallery1.jpg";
import gallery2 from "../assets/Images/gallery/gallery2.jpg";
import gallery3 from "../assets/Images/gallery/gallery3.jpg";
import gallery4 from "../assets/Images/gallery/gallery4.jpg";

/* News Images */
import newsFbo from "../assets/Images/news/news1.png";
import newsUav from "../assets/Images/news/news2.jpg";
import newsSafety from "../assets/Images/news/news3.png";

export default function Home() {
  const gallery = [gallery1, gallery2, gallery3, gallery4];
  const [selectedImage, setSelectedImage] = useState(null);

  const news = [
    {
      title: "NCTHSL receives the Nigerian Air Force.",
      date: "Nov 25, 2025",
      excerpt:
        "NCTHSL warmly receives the Nigerian Air Force Executive Airlift Group...",
      image: newsFbo
    },
    {
      title: "Strengthening Partnerships for Sustainable Growth.",
      date: "Oct 15, 2025",
      excerpt:
        "Visitations to the Infrastructure Concession Regulatory Commission (ICRC)...",
      image: newsUav
    },
    {
      title: "NCTHSL Hosts Africair for a Two-Day Demonstration Flight at its Hangar",
      date: "Oct 8, 2025",
      excerpt:
        "The Comptroller General of Nigeria Customs Service, BA Adeniyi MFR...",
      image: newsSafety
    }
  ];


  return (
    <div className="w-full">

      {/* ---------------- LIGHTBOX MODAL (NOW IN THE CORRECT PLACE INSIDE RETURN) ---------------- */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn"
          onClick={() => setSelectedImage(null)} >
          <div className="relative max-w-4xl w-full">
            {/* CLOSE BUTTON */}
            <button
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-200 transition"
              onClick={(e) => { e.stopPropagation();
              setSelectedImage(null); }} >
              ✕
            </button>

            {/* IMAGE */}
            <img src={selectedImage} alt="Preview" className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl animate-zoomIn" />
          </div>
        </div>
      )}

      {/* Your remaining homepage JSX continues here... */}


      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-r from-[#0A4D2D] to-[#145C36] text-white py-24 px-6 overflow-hidden animate-fadeIn">
        {/* Background Image */}
        <img src={heroImg} alt="NCTHSL Hero" className="absolute inset-0 w-full h-full object-cover opacity-30" />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto text-center animate-fadeScale">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-slideUp drop-shadow-lg">
            Nigeria Customs Technical &<br/>Hangar Services Limited (NCTHSL)
          </h1>

          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto mb-8 animate-slideUp drop-shadow">
            Premier provider of aviation services, renowned for its comprehensive range of offerings,
            technical expertise, and commitment to excellence in service delivery.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a href="/about" className="bg-white text-[#0A4D2D] font-semibold px-8 py-3 rounded-lg shadow hover:bg-gray-200 transition animate-slideUp">
              Learn More
            </a>

            <Link to="/services" className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg shadow hover:bg-white/10 transition animate-slideUp">
              Our Services
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="relative py-20 text-white overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] animate-fadeIn" />

        {/* Soft Glow */}
        <div className="absolute inset-0 bg-green-500 opacity-20 blur-3xl"></div>

        {/* Floating Particles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-24 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-ping"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl animate-bounce"></div>
        </div>

        {/* Content with Image */}
        <div className="relative container mx-auto px-6 grid md:grid-cols-2 gap-12 animate-fadeScale">
          {/* Text Section */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg animate-slideUp">
              About Nigeria Customs Technical & Hangar Services Limited
            </h2>

            <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-green-100 drop-shadow animate-slideUp">
              Nigeria Customs Technical & Hangar Services Limited (NCTHSL) specializes in providing advanced engineering,
              aircraft support, security technology solutions, and operational services tailored to the aviation and customs sectors.
              Our commitment is to innovation, efficiency, and national development.
            </p>

        {/* CTA Buttons */}
        <div className="flex justify-center md:justify-start mt-10 gap-6 animate-fadeIn">
          <a href="/testimonials" className="px-8 py-3 bg-white text-green-700 font-semibold rounded-xl shadow-lg hover:bg-green-100 hover:scale-105 transition-all duration-300">
            Testimonials
          </a>

          <a href="/about" className="px-8 py-3 bg-green-800 text-white font-semibold rounded-xl shadow-lg border border-green-300/30 hover:bg-green-900 hover:scale-105 transition-all duration-300">
                Meet Our Leadership
              </a>
            </div>
          </div>

            {/* Image Section */}
            <div className="flex justify-center">
              <img src={aboutImg} alt="About NCTHSL" className="w-full max-w-md rounded-2xl shadow-xl animate-slideUp transition-transform duration-500" />
            </div>
          </div>
      </section>

      {/* NEWS SECTION */}
      <section
        id="news"
        className="py-24 px-6 bg-gradient-to-br from-[#818589] to-[#525354] text-white"
      >
        <div className="max-w-7xl mx-auto">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Latest News
          </motion.h2>

          {/* Stagger Animation Wrapper */}
          <motion.div
            className="grid md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.25,
                },
              },
            }}
          >
            {news.map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white/10 rounded-2xl overflow-hidden 
                bg-gradient-to-br from-[#0a3a0a] to-[#052a05] 
                shadow-xl border border-white/10 backdrop-blur-md 
                cursor-pointer transition-all duration-300"
              >
                {/* Image with zoom hover */}
                <div className="overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-56 object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm text-gray-300 mb-2">{item.date}</p>

                  <motion.h3
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl font-bold mb-3"
                  >
                    {item.title}
                  </motion.h3>

                  <p className="text-gray-200 leading-relaxed">
                    {item.excerpt.substring(0, 110)}...
                  </p>

                  <Link
                    to="/news"
                    className="inline-block mt-5 text-sm font-semibold text-red-400 hover:text-red-500 transition"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/news"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
              >
                View All News
              </Link>
            </motion.div>
          </div>

        </div>
      </section>



      {/* MINI GALLERY – Premium Green Theme + LIGHTBOX */}
<section id="home-gallery" className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] relative">
  <div className="max-w-7xl mx-auto">

    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white animate-fadeUp tracking-wide">
      Gallery
    </h2>

    {/* GRID */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {gallery.map((src, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-2xl shadow-xl
          bg-[#124E35] border border-white/10 cursor-pointer transform transition-all duration-500
          hover:scale-[1.06] hover:-translate-y-2 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
          onClick={() => setSelectedImage(src)}
        >
          <img
            src={src}
            alt={`gallery-${idx + 1}`}
            className="w-full h-60 object-cover rounded-2xl
            transition-transform duration-700 ease-out group-hover:scale-110"
          />

          <div
            className="absolute inset-0 flex items-end p-4 
            bg-gradient-to-t from-black/50 via-black/10 to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          >
            <span className="text-white text-sm font-semibold tracking-wide drop-shadow-md 
            border-b border-yellow-400/70 pb-1">
              View Image
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* VIEW MORE BUTTON */}
    <div className="mt-12 flex justify-center relative z-10">
      <Link
        to="/gallery"
        className="px-8 py-4 bg-red-600 text-white font-semibold text-lg rounded-xl shadow-lg
        hover:bg-red-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.35)]
        animate-fadeIn animate-slideUp opacity-0"
        style={{ "--delay": "600ms" }}
      >
        View More
      </Link>
    </div>

  </div>

  {/* LIGHTBOX (Full View Image) */}
{/* LIGHTBOX (Full View Image) */}
{selectedImage && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center
  z-[9999] px-4 animate-fadeIn">

    {/* Image Wrapper - so close button aligns with the image */}
    <div className="relative max-h-[90vh] max-w-[90vw]">

      {/* Close button */}
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute -top-4 -right-4 text-white bg-black/60 hover:bg-black/80
        p-3 rounded-full z-[10000] transition shadow-xl border border-white/20"
      >
        ✕
      </button>

      {/* Full Image */}
      <img
        src={selectedImage}
        alt="Full View"
        className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain
        animate-scaleIn"
      />

    </div>
  </div>
)}

</section>

      {/* MISSION & VISION */}
      <section id="mission-vision" className="py-24 px-6 bg-gradient-to-br from-[#818589] to-[#525354] relative overflow-hidden text-white">

        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-xl animate-fadeUp">
          Our Mission & Vision
        </h2>

        {/* Soft Glow Background Elements */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-red-700/10 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl opacity-40"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start relative z-10">

          {/* Mission */}
          <div className="bg-gradient-to-br from-[#0a3a0a] to-[#052a05] card-zoom group p-10 rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl border border-white/10
                    animate-slideUp animate-fadeIn opacity-0 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,0,0.25)]
                    hover:-translate-y-1"
            style={{ "--delay": "150ms" }}
          >
            <div className="card-zoom-inner cursor-pointer">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-14 h-14 flex items-center justify-center rounded-full bg-red-700/20">
                <Target className="w-16 h-16 mx-auto mb-6 text-red-600 drop-shadow-xl" />
              </span>
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>

            <p className="text-gray-300 leading-relaxed">
              To become the most recognized and most profitable government-owned aviation company—
              consistently delivering healthy dividends to our shareholders while promoting excellence,
              innovation, and sustainable operational growth.
            </p>

            <div className="mt-6 h-1 w-0 bg-red-600 rounded-full animate-growLine"></div>
          </div>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-[#0a3a0a] to-[#052a05] card-zoom group p-10 rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl border border-white/10
                    animate-slideUp animate-fadeIn opacity-0 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,0,0.25)]
                    hover:-translate-y-1"
            style={{ "--delay": "300ms" }}
          >
            <div className="card-zoom-inner cursor-pointer">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-14 h-14 flex items-center justify-center rounded-full bg-red-700/20">

                <Telescope className="w-16 h-16 mx-auto mb-6 text-red-600 drop-shadow-xl" />
              </span>
              <h2 className="text-3xl font-bold">Our Vision</h2>
            </div>

            <p className="text-gray-300 leading-relaxed">
              To build an aviation institution that stands the test of time—providing world-class,
              safety-driven services to Nigeria and the global aviation sector with integrity,
              professionalism, and exceptional operational standards.
            </p>

            <div className="mt-6 h-1 w-0 bg-red-600 rounded-full animate-growLine"></div>
            </div>
          </div>

        </div>

        {/* Centered Learn More Button */}
        <div className="mt-12 flex justify-center relative z-10">
          <a href="/about" className="px-8 py-4 bg-red-600 text-white font-semibold text-lg rounded-xl shadow-lg
                    hover:bg-red-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.35)]
                    animate-fadeIn animate-slideUp opacity-0"
            style={{ "--delay": "600ms" }}
          >
            Learn More
          </a>
        </div>

      </section>
    </div>
  );
}
