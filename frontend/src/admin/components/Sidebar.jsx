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
  FaBorderAll,
  FaUsersCog
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path);

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

        {/* Services */}
        <Link
          to="/admin/services"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("services") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaBoxes /> Services
        </Link>

        {/* Gallery */}
        <Link
          to="/admin/gallery"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("gallery") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaImages /> Gallery
        </Link>

        {/* News */}
        <Link
          to="/admin/news"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("news") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaRegNewspaper /> News
        </Link>

        {/* Testimonials */}
        <Link
          to="/admin/testimonials"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("testimonials") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaUsers /> Testimonials
        </Link>

        {/* Messages */}
        <Link
          to="/admin/messages"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("messages") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaEnvelope /> Messages
        </Link>

        {/* Admin Registration */}
        <Link
          to="/admin/register"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("register") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaUsersCog /> Admin Registration
        </Link>

        {/* ⭐ NEW — About Page Admin */}
        <Link
          to="/admin/about"
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isActive("about") ? "bg-blue-700" : "hover:bg-blue-800"
          }`}
        >
          <FaInfoCircle /> About Page
        </Link>

        {/* Website UI (Navbar + Footer) */}
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
