// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import AdminApp from "./admin/AdminApp";
import Layout from "./layout/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound"; // Optional: create this
import ScrollToTop from "./admin/components/ScrollToTop";

// Smooth scroll to hash (#section) on route change
function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    } else {
      // Scroll to top when no hash
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollToHashElement />

      <Routes>
        {/* Public Routes with Shared Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="news" element={<NewsPage />} />
        </Route>

        {/* Admin Panel */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}