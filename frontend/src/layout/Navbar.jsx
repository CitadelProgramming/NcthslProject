import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAboutScroll = (sectionId) => {
    navigate("/about");
    setMobileOpen(false);
    setAboutOpen(false);
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  };

  const isAboutActive = location.pathname === "/about";

  const aboutDropdown = [
    { label: "Company Overview", id: "overview" },
    { label: "Mission & Vision", id: "mission" },
    { label: "Core Pillars", id: "pillars" },
    { label: "Partners", id: "partners" },
    { label: "Leadership Team", id: "leadership" },
  ];

  return (
    <>
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
                <p className="text-green-200 text-xs md:text-sm font-medium">& Hangar Services Limited</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 relative">
            {/* Home */}
            <NavLink to="/" className="relative group">
              <span className={`text-lg font-medium transition-all duration-300 ${location.pathname === "/" ? "text-green-400 font-bold" : "text-white hover:text-green-300"}`}>
                Home
              </span>
              {location.pathname === "/" && (
                <motion.span layoutId="navbar-active-underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-400" />
              )}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-500" />
            </NavLink>

            {/* ABOUT WITH SHARED ACTIVE UNDERLINE */}
            <div 
              className="relative"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                <span className={`text-lg font-medium transition-all duration-300 relative group ${isAboutActive ? "text-green-400 font-bold" : "text-white hover:text-green-300"}`}>
                  About
                  {/* Shared active underline */}
                  {isAboutActive && (
                    <motion.span layoutId="navbar-active-underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-400" />
                  )}
                  {/* Hover underline */}
                  {!isAboutActive && (
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-500" />
                  )}
                </span>
                <ChevronDown className={`w-4 h-4 text-green-300 transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`} />
              </div>

              <AnimatePresence>
                {aboutOpen && (
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
                        onClick={() => handleAboutScroll(item.id)}
                      >
                        {item.label}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Links */}
            {[
              { to: "/services", label: "Services" },
              { to: "/contact", label: "Contact" },
              { to: "/news", label: "News" },
              { to: "/gallery", label: "Gallery" },
              { to: "/testimonials", label: "Testimonials" },
            ].map((link) => (
              <NavLink key={link.to} to={link.to} className="relative group">
                <span className={`text-lg font-medium transition-all duration-300 ${location.pathname === link.to ? "text-green-400 font-bold" : "text-white hover:text-green-300"}`}>
                  {link.label}
                </span>
                {location.pathname === link.to && (
                  <motion.span layoutId="navbar-active-underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-400" />
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-500" />
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white text-3xl"
          >
            {mobileOpen ? <X /> : <Menu />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu with Blur Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xl z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-[#0A4D2D]/98 to-[#052a05]/98 backdrop-blur-2xl z-50 shadow-2xl border-r border-white/10 lg:hidden"
            >
              <div className="flex justify-end p-6">
                <button onClick={() => setMobileOpen(false)} className="text-white hover:text-green-400 transition">
                  <X size={32} />
                </button>
              </div>

              <nav className="flex flex-col items-start px-10 space-y-8 text-white text-xl font-medium mt-10">
                <NavLink to="/" onClick={() => setMobileOpen(false)} className="hover:text-green-400 transition">
                  Home
                </NavLink>

                <div className="w-full">
                  <div
                    className="flex items-center gap-3 cursor-pointer py-4"
                    onClick={() => setAboutOpen(!aboutOpen)}
                  >
                    <span className={isAboutActive ? "text-green-400 font-bold" : "text-white"}>
                      About
                    </span>
                    <ChevronDown className={`w-6 h-6 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {aboutOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-4 overflow-hidden pl-6 border-l-2 border-green-500/50"
                      >
                        {aboutDropdown.map((sub) => (
                          <motion.div
                            key={sub.id}
                            whileHover={{ x: 10 }}
                            onClick={() => {
                              handleAboutScroll(sub.id);
                              setMobileOpen(false);
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

                {[
                  { to: "/services", label: "Services" },
                  { to: "/contact", label: "Contact" },
                  { to: "/news", label: "News" },
                  { to: "/gallery", label: "Gallery" },
                  { to: "/testimonials", label: "Testimonials" },
                ].map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-green-400 transition"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}