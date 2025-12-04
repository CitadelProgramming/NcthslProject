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

// ABOUT SECTION ADMIN
import CompanyOverviewAdmin from "./pages/about/CompanyOverviewAdmin";
import MissionVisionAdmin from "./pages/about/MissionVisionAdmin";
import CorePillarsAdmin from "./pages/about/CorePillarsAdmin";
import LeadershipTeamAdmin from "./pages/about/LeadershipTeamAdmin";
import PartnersAdmin from "./pages/about/PartnersAdmin";
import RegulatoryComplianceAdmin from "./pages/about/RegulatoryComplianceAdmin";

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

        {/* ABOUT ADMIN SECTIONS */}
        <Route path="about/company-overview" element={<CompanyOverviewAdmin />} />
        <Route path="about/mission-vision" element={<MissionVisionAdmin />} />
        <Route path="about/core-pillars" element={<CorePillarsAdmin />} />
        <Route path="about/leadership-team" element={<LeadershipTeamAdmin />} />
        <Route path="about/partners" element={<PartnersAdmin />} />
        <Route path="about/regulatory-compliance" element={<RegulatoryComplianceAdmin />} />

        {/* NAVIGATION UI ADMIN */}
        <Route path="navbar" element={<NavbarAdmin />} />
        <Route path="footer" element={<FooterAdmin />} />

        {/* NEW ADMIN REGISTRATION ROUTE */}
        <Route path="register" element={<AdminRegistration />} />
      </Route>
    </Routes>
  );
}
