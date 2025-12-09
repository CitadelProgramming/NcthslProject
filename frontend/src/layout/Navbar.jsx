import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutHovered, setAboutHovered] = useState(false); // Controls hover dropdown
  const navigate = useNavigate();
  const aboutRef = useRef(null);

  useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAboutScroll = (sectionId) => {
    navigate("/about");
    setOpen(false);
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 400);
  };

  const aboutDropdown = [
    { label: "Company Overview", id: "overview" },
    { label: "Mission & Vision", id: "mission" },
    { label: "Core Pillars", id: "pillars" },
    { label: "Partners", id: "partners" },
    { label: "Leadership Team", id: "leadership" },
  ];

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
    { to: "/news", label: "News" },
    { to: "/gallery", label: "Gallery" },
    { to: "/testimonials", label: "Testimonials" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-br from-[#0A4D2D]/95 to-[#052a05]/95 backdrop-blur-xl shadow-2xl border-b border-white/10"
          : "bg-gradient-to-br from-[#0A4D2D]/90 to-[#052a05]/90 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/" className="flex items-center gap-4">
            <motion.img
              src="/logo.png"
              alt="NCTHSL Logo"
              className="w-14 h-14 md:w-20 md:h-20 rounded-xl shadow-2xl border-2 border-white/20"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            />
            <div className="hidden md:block">
              <h1 className="text-white font-bold text-lg md:text-2xl tracking-tight drop-shadow-lg">
                Nigeria Customs Technical
              </h1>
              <p className="text-green-200 text-xs md:text-sm font-medium">Hangar Services Limited</p>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {/* Home */}
          <NavLink to="/" className={({ isActive }) => 
            `text-lg font-medium transition-all duration-300 relative group ${isActive ? "text-green-400 font-bold" : "text-white hover:text-green-300"}`
          }>
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-500" />
          </NavLink>

          {/* ABOUT WITH HOVER DROPDOWN */}
          <div 
            className="relative"
            onMouseEnter={() => setAboutHovered(true)}
            onMouseLeave={() => setAboutHovered(false)}
            ref={aboutRef}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 cursor-pointer"
            >
              <span className="text-lg font-medium text-white hover:text-green-300 transition">
                About
              </span>
              <ChevronDown className={`w-4 h-4 text-green-300 transition-transform duration-300 ${aboutHovered ? "rotate-180" : ""}`} />
            </motion.div>

            {/* Dropdown - Only appears on hover */}
            <AnimatePresence>
              {aboutHovered && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                >
                  {aboutDropdown.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 8, backgroundColor: "rgba(34, 197, 94, 0.2)" }}
                      className="px-6 py-4 text-white hover:text-green-300 cursor-pointer transition-all"
                      onClick={() => {
                        handleAboutScroll(item.id);
                        setAboutHovered(false);
                      }}
                    >
                      {item.label}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other Links */}
          {navLinks.slice(1).map((link) => (
            <motion.div key={link.to} whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-lg font-medium transition-all duration-300 relative group ${
                    isActive ? "text-green-400 font-bold" : "text-white hover:text-green-300"
                  }`
                }
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-500" />
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white text-3xl"
        >
          {open ? <X /> : <Menu />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden fixed inset-0 top-20 bg-gradient-to-br from-[#0A4D2D]/98 to-[#052a05]/98 backdrop-blur-2xl z-40"
          >
            <motion.nav
              className="flex flex-col items-center pt-10 space-y-8 text-white text-xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <NavLink to="/" onClick={() => setOpen(false)} className="hover:text-green-400 transition">
                Home
              </NavLink>

              {/* ABOUT MOBILE DROPDOWN */}
              <div className="w-full text-center">
                <div
                  className="flex items-center justify-center gap-3 cursor-pointer py-4"
                  onClick={() => setAboutHovered(!aboutHovered)}
                >
                  <span>About</span>
                  <ChevronDown className={`w-6 h-6 transition-transform ${aboutHovered ? "rotate-180" : ""}`} />
                </div>

                <AnimatePresence>
                  {aboutHovered && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 space-y-3 overflow-hidden"
                    >
                      {aboutDropdown.map((sub) => (
                        <motion.div
                          key={sub.id}
                          whileHover={{ x: 10 }}
                          onClick={() => {
                            handleAboutScroll(sub.id);
                            setOpen(false);
                          }}
                          className="text-green-300 hover:text-white cursor-pointer py-3 text-lg"
                        >
                          {sub.label}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Mobile Links */}
              {navLinks.slice(1).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="hover:text-green-400 transition"
                >
                  {link.label}
                </NavLink>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}