// 🔥 FULL NAVBAR CODE WITH ONLY THE MODIFICATIONS YOU NEED
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleAboutScroll = (sectionId) => {
        navigate("/about");
        setTimeout(() => {
            const interval = setInterval(() => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                    clearInterval(interval);
                }
            }, 50);
        }, 350);
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

    const navParent = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } },
    };

    const navItem = {
        hidden: { opacity: 0, y: -10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.6 } }}
            className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-all duration-300 border-b ${
                scrolled
                    ? "bg-gradient-to-br from-[#818589] to-[#525354] shadow-lg"
                    : "bg-gradient-to-br from-[#818589] to-[#525354] shadow-sm"
            }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <motion.div>
                    <Link to="/" className="flex items-center gap-3">
                        <motion.img
                            src="/logo.png"
                            alt="NCTSHL Logo"
                            className="w-12 h-12 md:w-20 md:h-20"
                        />
                        <motion.div className="font-bold text-white text-lg">
                            Nigeria Customs Technical & Hangar Services Limited
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Mobile button */}
                <motion.button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-3xl text-white"
                >
                    {open ? "✕" : "☰"}
                </motion.button>

                {/* Desktop navigation */}
                <motion.nav
                    className="hidden md:flex gap-8 items-center font-medium text-white"
                    variants={navParent}
                    initial="hidden"
                    animate="show"
                >
                    {navLinks.map((item, index) => {

                        if (index === 1) {
                            return (
                                <div key="about-group" className="flex items-center gap-8">

                                    {/* ABOUT */}
                                    <motion.div key="about" className="relative group" variants={navItem}>
                                        <NavLink
                                            to="/about"
                                            className={({ isActive }) =>
                                                `relative pb-1 transition group ${
                                                    isActive
                                                        ? "text-[#0A4D2D] font-semibold"
                                                        : "hover:text-[#0A4D2D] text-white"
                                                }`
                                            }
                                        >
                                            About
                                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#0A4D2D] transition-all duration-300 group-hover:w-full" />
                                        </NavLink>

                                        {/* Dropdown */}
                                        <div className="absolute left-0 mt-2 bg-[#111] rounded-lg border border-gray-700 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-3 z-50">
                                            {aboutDropdown.map((sub) => (
                                                <div
                                                    key={sub.id}
                                                    onClick={() => handleAboutScroll(sub.id)}
                                                    className="px-4 py-2 text-white hover:bg-[#0A4D2D] cursor-pointer transition"
                                                >
                                                    {sub.label}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* SERVICES */}
                                    <motion.div key={item.to} variants={navItem}>
                                        <NavLink
                                            to={item.to}
                                            className={({ isActive }) =>
                                                `relative pb-1 transition group ${
                                                    isActive
                                                        ? "text-[#0A4D2D] font-semibold"
                                                        : "hover:text-[#0A4D2D] text-white"
                                                }`
                                            }
                                        >
                                            {item.label}
                                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#0A4D2D] transition-all duration-300 group-hover:w-full" />
                                        </NavLink>
                                    </motion.div>
                                </div>
                            );
                        }

                        // ⭐ UPDATED: GALLERY USING NavLink + CLEAN SCROLL
                        if (item.label === "Gallery") {
                            return (
                                <motion.div key="gallery" variants={navItem}>
                                    <NavLink
                                        to="/gallery"
                                        className={({ isActive }) =>
                                            `relative pb-1 transition group ${
                                                isActive
                                                    ? "text-[#0A4D2D] font-semibold"
                                                    : "hover:text-[#0A4D2D] text-white"
                                            }`
                                        }
                                        onClick={() => {
                                            window.scrollTo(0, 0);
                                            setTimeout(() => {
                                                const section = document.getElementById("gallery");
                                                if (section) {
                                                    section.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "start"
                                                    });
                                                }
                                            }, 200);
                                        }}
                                    >
                                        Gallery
                                        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#0A4D2D] transition-all duration-300 group-hover:w-full" />
                                    </NavLink>
                                </motion.div>
                            );
                        }

                        // Normal nav links
                        return (
                            <motion.div key={item.to} variants={navItem}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `relative pb-1 transition group ${
                                            isActive
                                                ? "text-[#0A4D2D] font-semibold"
                                                : "hover:text-[#0A4D2D] text-white"
                                        }`
                                    }
                                >
                                    {item.label}
                                    <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#0A4D2D] transition-all duration-300 group-hover:w-full" />
                                </NavLink>
                            </motion.div>
                        );
                    })}
                </motion.nav>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#1a1a1a] px-6 py-4 border-t border-gray-700"
                    >
                        <motion.nav className="flex flex-col gap-4 text-white font-medium">

                            <NavLink to="/" onClick={() => setOpen(false)} className="hover:text-[#0A4D2D]">
                                Home
                            </NavLink>

                            {navLinks.slice(1).map((item) => {

                                // ⭐ UPDATED MOBILE GALLERY
                                if (item.label === "Gallery") {
                                    return (
                                        <NavLink
                                            key="mobile-gallery"
                                            to="/gallery"
                                            onClick={() => {
                                                setOpen(false);
                                                window.scrollTo(0, 0);
                                                setTimeout(() => {
                                                    const section = document.getElementById("gallery");
                                                    if (section) {
                                                        section.scrollIntoView({
                                                            behavior: "smooth",
                                                            block: "start"
                                                        });
                                                    }
                                                }, 200);
                                            }}
                                            className="hover:text-[#0A4D2D]"
                                        >
                                            Gallery
                                        </NavLink>
                                    );
                                }

                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setOpen(false)}
                                        className="hover:text-[#0A4D2D]"
                                    >
                                        {item.label}
                                    </NavLink>
                                );
                            })}

                            {/* ABOUT MOBILE DROPDOWN */}
                            <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => setAboutOpen(!aboutOpen)}
                                >
                                    <span>About</span>
                                    <span>{aboutOpen ? "-" : "+"}</span>
                                </div>

                                <AnimatePresence>
                                    {aboutOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex flex-col ml-4 mt-2 border-l border-gray-700 pl-4"
                                        >
                                            {aboutDropdown.map((sub) => (
                                                <NavLink
                                                    key={sub.id}
                                                    to="/about"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setAboutOpen(false);
                                                        setTimeout(() => {
                                                            const section = document.getElementById(sub.id);
                                                            if (section)
                                                                section.scrollIntoView({ behavior: "smooth" });
                                                        }, 150);
                                                    }}
                                                    className="py-2 text-gray-300 hover:text-[#0A4D2D]"
                                                >
                                                    {sub.label}
                                                </NavLink>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
