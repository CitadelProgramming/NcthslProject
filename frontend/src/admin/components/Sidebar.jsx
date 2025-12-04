import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaImages,
  FaRegNewspaper,
  FaUsers,
  FaBoxes,
  FaSignOutAlt,
  FaEnvelope,
  FaInfoCircle,
  FaChevronDown,
  FaBars,
  FaBorderAll,
  FaUsersCog   // <-- NEW ICON ADDED
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path);

  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [uiOpen, setUiOpen] = React.useState(false);

  return (
    <div className="w-64 bg-blue-900 text-white h-screen flex flex-col p-5 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <nav className="flex flex-col gap-4">

        {/* Dashboard */}
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("dashboard") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaTachometerAlt /> Dashboard
        </Link>

        {/* ABOUT DROPDOWN */}
        <div>
          <button
            onClick={() => setAboutOpen(!aboutOpen)}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-blue-800"
          >
            <span className="flex items-center gap-2">
              <FaInfoCircle /> About Section
            </span>
            <FaChevronDown
              className={`transition-transform ${aboutOpen ? "rotate-180" : ""}`}
            />
          </button>

          {aboutOpen && (
            <div className="ml-6 mt-2 flex flex-col gap-2">
              <Link
                to="/admin/about/company-overview"
                className={`p-2 rounded ${
                  isActive("company-overview") ? "bg-blue-700" : "hover:bg-blue-800"
                }`}
              >
                Company Overview
              </Link>

              <Link
                to="/admin/about/mission-vision"
                className={`p-2 rounded ${
                  isActive("mission-vision") ? "bg-blue-700" : "hover:bg-blue-800"
                }`}
              >
                Mission & Vision
              </Link>

              <Link
                to="/admin/about/core-pillars"
                className={`p-2 rounded ${
                  isActive("core-pillars") ? "bg-blue-700" : "hover:bg-blue-800"
                }`}
              >
                Core Pillars
              </Link>

              <Link
                to="/admin/about/leadership-team"
                className={`p-2 rounded ${
                  isActive("leadership-team") ? "bg-blue-700" : "hover:bg-blue-800"
                }`}
              >
                Leadership Team
              </Link>

              <Link
                to="/admin/about/partners"
                className={`p-2 rounded ${
                  isActive("partners") ? "bg-blue-700" : "hover:bg-blue-800"
                }`}
              >
                Partners
              </Link>

              <Link
                to="/admin/about/regulatory-compliance"
                className={`p-2 rounded ${
                  isActive("regulatory-compliance") ? "bg-blue-700" : "hover:bg-blue-800"
                }`}
              >
                Regulatory Compliance
              </Link>
            </div>
          )}
        </div>

        {/* Additional Admin Sections */}
        <Link
          to="/admin/services"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("services") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaBoxes /> Services
        </Link>

        <Link
          to="/admin/gallery"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("gallery") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaImages /> Gallery
        </Link>

        <Link
          to="/admin/news"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("news") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaRegNewspaper /> News
        </Link>

        <Link
          to="/admin/testimonials"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("testimonials") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaUsers /> Testimonials
        </Link>

        <Link
          to="/admin/messages"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("messages") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaEnvelope /> Messages
        </Link>

        {/* NEW ADMIN REGISTRATION LINK (ADDED HERE) */}
        <Link
          to="/admin/register"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("register") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaUsersCog /> Admin Registration
        </Link>

        {/* WEBSITE UI (Navbar + Footer) */}
        <div>
          <button
            onClick={() => setUiOpen(!uiOpen)}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-blue-800 mt-2"
          >
            <span className="flex items-center gap-2">
              <FaBorderAll /> Website UI
            </span>
            <FaChevronDown
              className={`transition-transform ${uiOpen ? "rotate-180" : ""}`}
            />
          </button>

          {uiOpen && (
            <div className="ml-6 mt-2 flex flex-col gap-2">
              <Link
                to="/admin/navbar"
                className={`p-2 rounded ${
                  isActive("navbar") ? "bg-blue-700" : "hover:bg-blue-800"
                }`}
              >
                Navbar Editor
              </Link>

              <Link
                to="/admin/footer"
                className={`p-2 rounded ${
                  isActive("footer") ? "bg-blue-700" : "hover:bg-blue-800"
                }`}
              >
                Footer Editor
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => {
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
        }}
        className="mt-auto flex items-center gap-2 bg-red-600 hover:bg-red-700 p-3 rounded-lg"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}
