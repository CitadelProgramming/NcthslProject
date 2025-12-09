// src/admin/pages/NavbarAdmin.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { 
  Menu, 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  GripVertical,
  Save,
  Eye,
  ChevronDown
} from "lucide-react";

const DEFAULT_NAVBAR = {
  logo: "/logo.png",
  menuItems: ["Home", "Services", "Contact", "News", "Gallery", "Testimonials"],
  aboutDropdown: [
    "Company Overview",
    "Mission & Vision",
    "Core Pillars",
    "Partners",
    "Leadership Team"
  ],
  actionButton: "Get In Touch"
};

export default function NavbarAdmin() {
  const [navbar, setNavbar] = useState(DEFAULT_NAVBAR);
  const [editing, setEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ncthsl-navbar-config");
    if (saved) {
      try {
        setNavbar(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load navbar config");
      }
    }
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem("ncthsl-navbar-config", JSON.stringify(data));
  };

  const handleSave = () => {
    saveToStorage(navbar);
    setEditing(false);
    Swal.fire({
      icon: "success",
      title: "Navbar Updated!",
      text: "Your changes have been saved successfully.",
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNavbar(prev => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addMenuItem = () => {
    setNavbar(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, "New Item"]
    }));
  };

  const removeMenuItem = (index) => {
    setNavbar(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter((_, i) => i !== index)
    }));
  };

  const addAboutItem = () => {
    setNavbar(prev => ({
      ...prev,
      aboutDropdown: [...prev.aboutDropdown, "New Section"]
    }));
  };

  const removeAboutItem = (index) => {
    setNavbar(prev => ({
      ...prev,
      aboutDropdown: prev.aboutDropdown.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">Navbar Management</h1>
          
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition ${
                previewMode 
                  ? "bg-purple-600 text-white shadow-lg" 
                  : "bg-white text-gray-700 shadow-md border"
              }`}
            >
              <Eye size={20} />
              {previewMode ? "Exit Preview" : "Live Preview"}
            </motion.button>

            {!editing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl flex items-center gap-3"
              >
                Edit Navbar
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl flex items-center gap-3"
              >
                <Save size={20} />
                Save Changes
              </motion.button>
            )}
          </div>
        </div>

        {/* LIVE PREVIEW */}
        {previewMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-gradient-to-br from-[#0f2f20]/95 to-[#052a05]/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <img 
                  src={navbar.logo || "/logo.png"} 
                  alt="Logo" 
                  className="w-16 h-16 object-contain drop-shadow-2xl" 
                />
                <div className="hidden lg:flex items-center gap-10 text-white font-medium">
                  {navbar.menuItems.map((item, i) => (
                    <div key={i} className="relative group">
                      {item === "About" ? (
                        <div className="flex items-center gap-2 cursor-pointer">
                          About <ChevronDown size={16} />
                          <div className="absolute top-full left-0 mt-4 w-64 bg-gradient-to-br from-[#0f2f20] to-[#052a05] rounded-2xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            {navbar.aboutDropdown.map((sub, j) => (
                              <div key={j} className="px-6 py-3 text-gray-200 hover:bg-white/10 transition">
                                {sub}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="hover:text-green-400 transition">{item}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition">
                {navbar.actionButton}
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW MODE */}
        {!editing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Current Navbar Configuration</h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-700">Logo</h3>
                <img 
                  src={navbar.logo || "/logo.png"} 
                  alt="Current Logo" 
                  className="w-40 h-40 object-contain bg-gray-100 rounded-2xl shadow-lg p-4"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-700">Menu Items</h3>
                <div className="space-y-3">
                  {navbar.menuItems.map((item, i) => (
                    <div key={i} className="bg-gray-50 px-6 py-3 rounded-xl font-medium">
                      {i === 1 ? "About →" : item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4 text-gray-700">About Dropdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {navbar.aboutDropdown.map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-4 rounded-xl text-center font-medium text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-2xl font-bold text-gray-800">
                Action Button: <span className="text-red-600">"{navbar.actionButton}"</span>
              </p>
            </div>
          </motion.div>
        ) : (
          /* EDITING MODE */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            {/* Logo Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Upload className="text-blue-600" />
                Logo Management
              </h3>
              <div className="flex items-center gap-8">
                <img 
                  src={navbar.logo || "/logo.png"} 
                  alt="Logo Preview" 
                  className="w-32 h-32 object-contain bg-gray-100 rounded-2xl shadow-lg p-4"
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-xl border border-gray-300 cursor-pointer focus:outline-none p-3"
                  />
                  <p className="text-sm text-gray-500 mt-2">Recommended: 200x200px PNG</p>
                </div>
              </div>
            </motion.div>

            {/* Menu Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Menu className="text-green-600" />
                Main Menu Items
              </h3>
              <div className="space-y-4">
                {navbar.menuItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 group"
                  >
                    <GripVertical className="text-gray-400 cursor-move" size={20} />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...navbar.menuItems];
                        newItems[i] = e.target.value;
                        setNavbar(prev => ({ ...prev, menuItems: newItems }));
                      }}
                      className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition"
                      placeholder="Menu item name"
                    />
                    <button
                      onClick={() => removeMenuItem(i)}
                      className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
                <button
                  onClick={addMenuItem}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-3"
                >
                  <Plus size={20} />
                  Add Menu Item
                </button>
              </div>
            </motion.div>

            {/* About Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
            >
              <h3 className="text-2xl font-bold mb-6">About Dropdown Menu</h3>
              <div className="space-y-4">
                {navbar.aboutDropdown.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 group"
                  >
                    <GripVertical className="text-gray-400 cursor-move" size={20} />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...navbar.aboutDropdown];
                        newItems[i] = e.target.value;
                        setNavbar(prev => ({ ...prev, aboutDropdown: newItems }));
                      }}
                      className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition"
                      placeholder="Dropdown item"
                    />
                    <button
                      onClick={() => removeAboutItem(i)}
                      className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
                <button
                  onClick={addAboutItem}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-500 hover:text-purple-600 transition flex items-center justify-center gap-3"
                >
                  <Plus size={20} />
                  Add About Item
                </button>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 text-center"
            >
              <h3 className="text-2xl font-bold mb-6">Call-to-Action Button</h3>
              <input
                type="text"
                value={navbar.actionButton}
                onChange={(e) => setNavbar(prev => ({ ...prev, actionButton: e.target.value }))}
                className="px-8 py-4 text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-red-500 transition w-full max-w-md"
                placeholder="Button text"
              />
            </motion.div>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-center gap-6 mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl flex items-center gap-3"
              >
                <Save size={24} />
                Save All Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}