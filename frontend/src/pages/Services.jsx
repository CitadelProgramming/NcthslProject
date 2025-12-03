import { useState, useEffect } from "react";

import ncaaLogo from "../assets/Images/compliance/ncaa.png";
import faanLogo from "../assets/Images/compliance/faan.png";
import { Plane, Wrench, Satellite } from "lucide-react";

// Helper slider component (clean + reusable)
function ImageSlider({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(autoSlide);
  }, [images.length]);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden shadow-lg">

      {/* Image */}
      <img
        src={images[index]}
        alt=""
        className="w-full h-full object-cover animate-fadeScale"
      />

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
      >
        ›
      </button>

      {/* Slider dots */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition ${
              index === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <div className="w-full">

      {/* ===========================
          PAGE HEADER
      ============================ */}
      <section className="bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white py-8 px-6 text-center animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold animate-slideUp">Our Services</h1>
          <p className="mt-2 text-lg md:text-xl text-gray-200 animate-slideUp">
            Comprehensive aviation, technical, logistics and security solutions tailored for
            governmental, commercial and industrial operators.
          </p>
        </div>
      </section>

      {/* ===========================
            FULL SERVICE SECTIONS
      ============================ */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#818589] to-[#525354]">
        <div className="max-w-7xl mx-auto space-y-20">

          {/* FBO Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 animate-staggerFade" style={{ "--delay": "100ms" }}>
              <h3 className="text-2xl text-red-700 font-bold mb-4">
                Fixed Based Operations — Fueling, Parking & Lounging
              </h3>
              <p className="text-black mb-4">
                NCTHSL operates secure FBO services offering fueling, parking,
                passenger lounges and ground handling.
              </p>
              <ul className="list-disc list-inside text-black space-y-2">
                <li>Fuel management</li>
                <li>Ramp & parking services</li>
                <li>Passenger & crew lounges</li>
                <li>Ground handling</li>
              </ul>
            </div>

            <div className="order-1 md:order-2">
              <ImageSlider
                images={[
                  "../assets/Images/services/fbo/fueling.jpg",
                  "../assets/Images/services/fbo/parking.jpg",
                  "../assets/Images/services/fbo/lounging.jpg",
                ]}
              />
            </div>
          </div>

          {/* Maintenance + UAV */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <ImageSlider
                images={[
                  "../assets/Images/services/maintenance/inspection.jpg",
                  "../assets/Images/services/maintenance/tools.jpg",
                  "../assets/Images/services/maintenance/team.jpg",
                ]}
              />
            </div>

            <div className="animate-staggerFade" style={{ "--delay": "240ms" }}>
              <h3 className="text-2xl text-red-700 font-bold mb-4">
                General Aviation Maintenance, Sales & UAV Operations
              </h3>
              <p className="text-black mb-4">
                From scheduled maintenance to UAV operations and aircraft leasing,
                we ensure compliance and airworthiness.
              </p>
              <ul className="list-disc list-inside text-black space-y-2">
                <li>Inspections & repairs</li>
                <li>Component servicing</li>
                <li>UAV data operations</li>
                <li>Aircraft sales & leasing</li>
              </ul>
            </div>
          </div>

          {/* Oil & Gas */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 animate-staggerFade">
              <h3 className="text-2xl text-red-700 font-bold mb-4">Oil & Gas — Offshore Support</h3>
              <p className="text-black mb-4">
                Specialized helicopter and fixed-wing support for offshore and onshore operations.
              </p>
              <ul className="list-disc list-inside text-black space-y-2">
                <li>Crew transfers</li>
                <li>Medevac operations</li>
                <li>Offshore logistics</li>
              </ul>
            </div>

            <div className="order-1 md:order-2">
              <ImageSlider
                images={[
                  "../assets/Images/services/oilgas/helicopter.jpg",
                  "../assets/Images/services/oilgas/offshore.jpg",
                  "../assets/Images/services/oilgas/crew-transfer.jpg",
                ]}
              />
            </div>
          </div>

          {/* Security */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <ImageSlider
                images={[
                  "../assets/Images/services/security/surveillance.jpeg",
                  "../assets/Images/services/security/patrol.jpg",
                  "../assets/Images/services/security/mapping.jpg",
                ]}
              />
            </div>

            <div className="animate-staggerFade">
              <h3 className="text-2xl text-red-700 font-bold mb-4">
                Security & Geo-Spatial Intelligence
              </h3>
              <p className="text-black mb-4">
                Aerial surveillance, patrol, mapping and intelligence services.
              </p>
              <ul className="list-disc list-inside text-black space-y-2">
                <li>Aerial border patrol</li>
                <li>Geo-spatial intelligence</li>
                <li>Mapping & survey</li>
                <li>Real estate management</li>
              </ul>
            </div>
          </div>

          {/* Air Delivery */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 animate-staggerFade">
              <h3 className="text-2xl text-red-700 font-bold mb-4">Airborne Mail & Cash Delivery</h3>
              <p className="text-black mb-4">
                Secure airborne logistics for high-value items and urgent packages.
              </p>
              <ul className="list-disc list-inside text-black space-y-2">
                <li>Mail transport</li>
                <li>Cash-in-transit</li>
                <li>High-security cargo</li>
              </ul>
            </div>

            <div className="order-1 md:order-2">
              <ImageSlider
                images={[
                  "../assets/Images/services/delivery/air-mail.jpg",
                  "../assets/Images/services/delivery/cash.jpg",
                  "../assets/Images/services/delivery/cargo.jpg",
                ]}
              />
            </div>
          </div>

        </div>
      </section>

      {/* SAFETY SECTION */}
      <section className="py-12 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white">
        <div className="max-w-6xl mx-auto text-center animate-fadeIn">
          <h3 className="text-2xl font-bold mb-4">Quality, Safety & Compliance</h3>
          <p className="max-w-3xl mx-auto text-gray-100 mb-8">
            We operate under strict international aviation safety standards and maintain
            compliance with all Nigerian civil aviation regulatory bodies.
          </p>

          {/* Logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-6">

            {/* NCAA */}
            <div className="bg-white p-4 rounded-xl shadow-lg w-32 h-32 flex items-center justify-center hover:scale-105 transition duration-300">
              <img
                src={ncaaLogo}
                alt="NCAA Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* FAAN */}
            <div className="bg-white p-4 rounded-xl shadow-lg w-32 h-32 flex items-center justify-center hover:scale-105 transition duration-300">
              <img
                src={faanLogo}
                alt="FAAN Logo"
                className="w-full h-full object-contain"
              />
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center animate-fadeIn">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Aviation Solution?</h3>
          <p className="text-gray-700 mb-6">
            Contact our engineering team for tailored services or inspections.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#B30000] text-white px-8 py-3 rounded-lg shadow hover:bg-red-700 transition hover-zoom animate-zoomInSoft"
          >
            Get in Touch
          </a>
        </div>
      </section>

    </div>
  );
}
