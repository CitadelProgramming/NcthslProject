// src/admin/AdminApp.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

// MAIN ADMIN PAGES
import Dashboard from "./pages/Dashboard";
import ServicesAdmin from "./pages/ServicesAdmin";
import GalleryAdmin from "./pages/GalleryAdmin";
import NewsAdmin from "./pages/NewsAdmin";
import TestimonialsAdmin from "./pages/TestimonialsAdmin";
import MessagesAdmin from "./pages/MessagesAdmin";
import AboutAdmin from "./pages/AboutAdmin";

// NAVBAR & FOOTER ADMIN
import NavbarAdmin from "./pages/NavbarAdmin";
import FooterAdmin from "./pages/FooterAdmin";

// NEW ADMIN REGISTRATION PAGE
import AdminRegistration from "./pages/AdminRegistration";

import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";

export default function AdminApp() {
  return (
    <Routes>
      {/* Public login route */}
      <Route path="login" element={<Login />} />

      {/* All Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* MAIN ADMIN SECTIONS */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="gallery" element={<GalleryAdmin />} />
        <Route path="news" element={<NewsAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="about" element={<AboutAdmin />} />

        {/* NAVIGATION UI ADMIN */}
        <Route path="navbar" element={<NavbarAdmin />} />
        <Route path="footer" element={<FooterAdmin />} />

        {/* NEW ADMIN REGISTRATION ROUTE */}
        <Route path="register" element={<AdminRegistration />} />
      </Route>
    </Routes>
  );
}
