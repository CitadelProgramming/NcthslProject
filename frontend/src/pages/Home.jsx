// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { Award, ShieldCheck, Flame, Image, Newspaper, Target, Telescope } from "lucide-react";

import heroImg from "../assets/Images/hero/hero.jpg";
import aboutImg from "../assets/Images/about/about.png";

/* Gallery imports */
import Gallery from "../pages/Gallery";
import gallery1 from "../assets/Images/gallery/gallery1.jpg";
import gallery2 from "../assets/Images/gallery/gallery2.jpg";
import gallery3 from "../assets/Images/gallery/gallery3.jpg";
import gallery4 from "../assets/Images/gallery/gallery4.jpg";

/* News Images */
import newsFbo from "../assets/Images/news/news1.jpg";
import newsUav from "../assets/Images/news/news2.jpeg";
import newsSafety from "../assets/Images/news/news3.jpg";

export default function Home() {
  const gallery = [gallery1, gallery2, gallery3, gallery4];
  const [selectedImage, setSelectedImage] = useState(null);

  const news = [
    {
      title: "NCTHSL Expands FBO Operations",
      date: "Nov 1, 2025",
      excerpt:
        "We have expanded our Fixed Base Operations to support more international flights with new fueling bays and lounges.",
      image: newsFbo
    },
    {
      title: "New UAV Capability for Geo-Intelligence",
      date: "Oct 18, 2025",
      excerpt:
        "NCTHSL introduces advanced UAV mapping services to improve aerial surveillance, surveying and mapping accuracy.",
      image: newsUav
    },
    {
      title: "Safety Audit — EASA-compliant Procedures Adopted",
      date: "Sep 24, 2025",
      excerpt:
        "Updated maintenance procedures and QA checks aligned with EASA and OEM recommendations to enhance safety and compliance.",
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

      {/* THREE CORE PILLARS – Premium Enhanced Version */}
      <section
        id="core-pillars"
        className="py-28 px-6 relative bg-gradient-to-br from-[#818589] to-[#525354] overflow-hidden"
      >

        {/* Floating particles background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-20 w-32 h-32 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-16 right-32 w-40 h-40 bg-red-500/10 rounded-full blur-2xl animate-ping"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-red-700/10 rounded-full blur-xl animate-bounce"></div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-xl animate-fadeUp">
          Our Core Pillars
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto relative z-10 animate-fadeIn">

          {/* Excellence */}
          <div className="card-zoom-inner hover-zoom-soft relative p-10 rounded-2xl text-center bg-white/10 backdrop-blur-xl shadow-2xl
                          border border-white/10 hover:border-red-500/40 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.04]
                          hover:shadow-[0_0_40px_rgba(255,0,0,0.3)] group cursor-pointer animate-slideUp"
            style={{ '--delay': '100ms' }} >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl"></div>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <Award className="w-16 h-16 text-white drop-shadow transition-all duration-500 group-hover:scale-125 group-hover:-rotate-3 group-hover:text-red-400" />
            </div>

            <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-red-300 transition">
              Excellence
            </h3>

            <p className="text-gray-300 group-hover:text-gray-100 transition">
              Specialized maintenance for NCS aircraft, ensuring airworthiness and unmatched safety.
            </p>
          </div>

          {/* Integrity */}
          <div className="card-zoom-inner relative p-10 rounded-2xl text-center bg-white/10 backdrop-blur-xl shadow-2xl border
                         border-white/10 hover:border-red-500/40 transition-all duration-500 ease-out hover:-translate-y-3 
                         hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(255,0,0,0.3)] group cursor-pointer animate-slideUp"
            style={{ '--delay': '250ms' }}
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl"></div>

            <div className="flex justify-center mb-4">
              <ShieldCheck className="w-16 h-16 text-white drop-shadow transition-all duration-500 group-hover:scale-125 group-hover:rotate-3 group-hover:text-red-400" />
            </div>

            <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-red-300 transition">
              Integrity
            </h3>

            <p className="text-gray-300 group-hover:text-gray-100 transition">
              Engineering support, diagnostics, technical inspections, and transparent operations.
            </p>
          </div>

          {/* Resilience */}
          <div className="card-zoom-inner relative p-10 rounded-2xl text-center bg-white/10 backdrop-blur-xl shadow-2xl
                         border border-white/10 hover:border-red-500/40 transition-all duration-500 ease-out
                          hover:-translate-y-3 hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(255,0,0,0.3)]
                          group cursor-pointer animate-slideUp"
            style={{ '--delay': '400ms' }}
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl"></div>

            <div className="flex justify-center mb-4">
              <Flame className="w-16 h-16 text-red-500 drop-shadow transition-all duration-500 group-hover:scale-125 group-hover:-rotate-3 group-hover:text-red-400" />
            </div>

            <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-red-300 transition">
              Resilience & Determination
            </h3>

            <p className="text-gray-300 group-hover:text-gray-100 transition">
              Aviation logistics, mission readiness, and dependable operational support services.
            </p>
          </div>

        </div>
      </section>

      {/* MINI GALLERY – Premium Green Theme + LIGHTBOX */}
      <section id="home-gallery" className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05]">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white animate-fadeUp tracking-wide">Gallery</h2>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gallery.map((src, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-xl
                            bg-[#124E35] border border-white/10 cursor-pointer transform transition-all duration-500
                             hover:scale-[1.06] hover:-translate-y-2 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
                onClick={() => setSelectedImage(src)}
              >
                <img src={src} alt={`gallery-${idx + 1}`} className="w-full h-60 object-cover rounded-2xl
                                                           transition-transform duration-700 ease-out group-hover:scale-110"/>

                <div className="absolute inset-0 flex items-end p-4bg-gradient-to-t from-black/50 via-black/10 to-transparent
                                 opacity-0 group-hover:opacity-100transition-opacity duration-700">
                  <span className="text-white text-sm font-semibold tracking-wide drop-shadow-md border-b border-yellow-400/70 pb-1">
                    View Image
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* VIEW MORE BUTTON */}
          <div className="mt-12 flex justify-center relative z-10">
            <Link to="/gallery" className="px-8 py-4 bg-red-600 text-white font-semibold text-lg rounded-xl shadow-lg
                    hover:bg-red-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.35)] animate-fadeIn animate-slideUp opacity-0"
              style={{ "--delay": "600ms" }}
            >
              View More
            </Link>
          </div>

        </div>
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
          <div className="card-zoom group p-10 rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl border border-white/10
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
          <div className="p-10 rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl border border-white/10
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
