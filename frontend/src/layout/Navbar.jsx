// src/layout/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    navigate("/about");
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
    { to: "/news", label: "News" },
    { to: "/gallery", label: "Gallery" },
    { to: "/testimonials", label: "Testimonials" },
  ];

  const aboutDropdown = [
    { label: "Company Overview", id: "overview" },
    { label: "Mission & Vision", id: "mission" },
    { label: "Core Pillars", id: "pillars" },
    { label: "Partners", id: "partners" },
    { label: "Leadership Team", id: "leadership" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-br from-[#0f2f20]/95 to-[#052a05]/95 backdrop-blur-xl shadow-2xl border-b border-white/10"
          : "bg-gradient-to-br from-[#0f2f20]/90 to-[#052a05]/90 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

        {/* Logo & Brand */}
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4">
            <motion.img
              src="/logo.png"
              alt="NCTHSL Logo"
              className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-2xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            />
            <div className="hidden md:block">
              <h1 className="text-white font-bold text-xl tracking-tight">NCTHSL</h1>
              <p className="text-green-300 text-xs -mt-1">Nigeria Customs Technical & Hangar Services</p>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <div key={link.to} className="relative group">
              {link.label === "About" ? (
                <>
                  <button
                    onClick={() => navigate("/about")}
                    className="text-white font-medium text-lg hover:text-green-400 transition relative pb-1"
                  >
                    About
                    <motion.span
                      className="absolute left-0 -bottom-1 h-0.5 bg-green-400 w-0 group-hover:w-full transition-all duration-500"
                      layoutId="navbar-underline"
                    />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-gradient-to-br from-[#0f2f20]/95 to-[#052a05]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-400 translate-y-4 group-hover:translate-y-0 z-50">
                    <div className="p-4">
                      {aboutDropdown.map((item) => (
                        <motion.button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className="block w-full text-left px-5 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition text-base font-medium"
                          whileHover={{ x: 8 }}
                        >
                          {item.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `text-lg font-medium transition relative pb-1 ${
                      isActive ? "text-green-400" : "text-white hover:text-green-400"
                    }`
                  }
                >
                  {link.label}
                  <motion.span
                    className="absolute left-0 -bottom-1 h-0.5 bg-green-400 w-0 group-hover:w-full transition-all duration-500"
                    layoutId={`underline-${link.to}`}
                  />
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white text-3xl z-50 relative"
        >
          <AnimatePresence mode="wait">
            {open ? <X size={32} /> : <Menu size={32} />}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute top-full left-0 w-full bg-gradient-to-br from-[#0f2f20]/98 to-[#052a05]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
          >
            <nav className="px-8 py-8 space-y-6 text-center">
              {navLinks.map((link) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {link.label === "About" ? (
                    <div>
                      <button
                        onClick={() => setAboutOpen(!aboutOpen)}
                        className="text-xl font-semibold text-white flex items-center justify-between w-full py-3"
                      >
                        About
                        <span className="text-2xl">{aboutOpen ? "−" : "+"}</span>
                      </button>

                      <AnimatePresence>
                        {aboutOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-6 mt-3 space-y-3 border-l-2 border-green-500 pl-6"
                          >
                            {aboutDropdown.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  setOpen(false);
                                  scrollToSection(sub.id);
                                }}
                                className="block text-left text-gray-300 hover:text-white py-2 text-lg transition"
                              >
                                {sub.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="block text-xl font-semibold text-white py-3 hover:text-green-400 transition"
                    >
                      {link.label}
                    </NavLink>
                  )}
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}