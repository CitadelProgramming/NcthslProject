// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminApp from "./admin/AdminApp";

import Layout from "./layout/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import NewsPage from "./pages/NewsPage";
import ScrollToTop from "./admin/components/ScrollToTop";

// ============================================
// 🔥 Smooth scrolling to #section (Gallery fix)
// ============================================
function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    }
  }, [location]);

  return null;
}

// ============================================
//                MAIN APP
// ============================================
export default function App() {
  // Global gallery data (images)
  const galleryImages = [
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
    "/gallery/5.jpeg",
    "/gallery/6.jpeg",
    "/gallery/7.jpeg",
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <ScrollToTop />

      {/* ================================ */}
      {/* 🌟 GLOBAL IMAGE VIEWER MODAL FIX  */}
      {/* ================================ */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="relative max-w-3xl w-full p-4">
            <img
              src={selectedImage.src || selectedImage}
              alt={selectedImage.caption || "Selected Image"}
              className="w-full max-h-[85vh] object-contain rounded-xl shadow-xl"
            />

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>

            {/* Caption */}
            {selectedImage.caption && (
              <p className="text-center text-white mt-3 text-sm">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Ensures hash scrolling works globally */}
      <ScrollToHashElement />

      {/* ROUTES */}
      <Routes>
        {/* Public website pages wrapped with Layout */}
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Home
                gallery={galleryImages}
                setSelectedImage={setSelectedImage}
              />
            }
          />

          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />

          {/* ⭐ FULL PAGE GALLERY COMPONENT */}
          <Route
            path="gallery"
            element={
              <Gallery
                gallery={galleryImages}
                setSelectedImage={setSelectedImage}
              />
            }
          />

          <Route path="testimonials" element={<Testimonials />} />
          <Route path="news" element={<NewsPage />} />
        </Route>

        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </>
  );
}
