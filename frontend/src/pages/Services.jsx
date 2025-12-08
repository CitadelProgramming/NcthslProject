// src/pages/Services.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import ncaaLogo from "../assets/Images/compliance/ncaa.png";
import faanLogo from "../assets/Images/compliance/faan.png";

/* ===========================
   REUSABLE IMAGE SLIDER
=========================== */

function ImageSlider({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(autoSlide);
  }, [images.length]);

  return (
    <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden shadow-lg">
      <img
        src={images[index]}
        alt=""
        className="w-full h-full object-cover animate-fadeScale"
      />

      {/* Controls */}
      <button
        onClick={() =>
          setIndex((prev) => (prev - 1 + images.length) % images.length)
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
      >
        ‹
      </button>

      <button
        onClick={() => setIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
      >
        ›
      </button>

      {/* Dots */}
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

/* ===========================
   MAIN SERVICES COMPONENT
=========================== */
export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSecureImage = async (relativePath) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        `https://enchanting-expression-production.up.railway.app${relativePath}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      return URL.createObjectURL(res.data);
    } catch (err) {
      console.error("Image fetch failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await axios.get(
          "https://enchanting-expression-production.up.railway.app/api/v1/service/all-services",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const list = res.data || [];

        // Load secure images for each service item
        const processed = await Promise.all(
          list.map(async (service) => {
            let loadedImages = [];

            if (Array.isArray(service.images)) {
              loadedImages = await Promise.all(
                service.images.map(async (path) => await fetchSecureImage(path))
              );
            }

            return {
              ...service,
              loadedImages,
            };
          })
        );

        setServices(processed);
      } catch (error) {
        console.error("Services Fetch Error:", error);
        Swal.fire("Error", "Unable to load services.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="w-full">

      {/* HEADER */}
      <section className="bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white py-8 px-6 text-center animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="mt-2 text-lg md:text-xl text-gray-200">
            Comprehensive aviation, logistics, and security services tailored for civil & military operators.
          </p>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#818589] to-[#525354]">
        <div className="max-w-7xl mx-auto space-y-20">

          {loading && (
            <div className="text-white text-center text-xl">Loading services...</div>
          )}

          {!loading && services.length === 0 && (
            <div className="text-white text-center text-xl">
              No services available.
            </div>
          )}

          {/* Loop Render */}
          {!loading &&
            services.map((service, index) => (
              <div
                key={service.id}
                className={`grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Images */}
                <div>
                  {service.loadedImages.length > 0 ? (
                    <ImageSlider images={service.loadedImages} />
                  ) : (
                    <div className="w-full h-56 bg-gray-300 rounded-xl flex items-center justify-center">
                      No Images
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="animate-staggerFade">
                  <h3 className="text-2xl text-red-700 font-bold mb-4">
                    {service.title}
                  </h3>

                  <p className="text-black mb-4">{service.description}</p>

                  <ul className="list-disc list-inside text-black space-y-2">
                    {(service.bullets || []).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* SAFETY */}
      <section className="py-12 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">
            Quality, Safety & Compliance
          </h3>

          <p className="max-w-3xl mx-auto text-gray-100 mb-8">
            We operate under strict international aviation safety standards.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 mt-6">
            <div className="bg-white p-4 rounded-xl shadow-lg w-32 h-32">
              <img src={ncaaLogo} alt="NCAA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg w-32 h-32">
              <img src={faanLogo} alt="FAAN Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
