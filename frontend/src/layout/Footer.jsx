import { Facebook, Instagram, Linkedin, Twitter, MapPin, Clock, Phone, Mail } from "lucide-react";
import Logo from "../assets/logo.png";  // UPDATE IF PATH DIFFERS
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1/about/all-about";

export default function Footer() {
  const [companyInfo, setCompanyInfo] = useState({
    description: "A premier aviation support and maintenance organization providing world-class engineering, operational support, and mission-critical aviation services for national security and civil aviation advancement.",
  });

  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await axios.get(API_BASE);
        const data = res.data?.[0] || {};
        setCompanyInfo({
          description: data.overview || companyInfo.description,
        });
      } catch (err) {
        console.error("Failed to load company info:", err);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return Swal.fire("Error", "Please enter a valid email", "error");
    }

    // Simulate subscription (replace with real API if needed)
    Swal.fire("Subscribed!", "Thank you for subscribing to our newsletter.", "success");
    setEmail("");
  };

  return (
    <footer className="w-full bg-gradient-to-br from-[#082F1F] to-[#0A4D2D] text-gray-200 pt-20 pb-10 mt-24 border-t border-green-700/40 shadow-2xl">

      {/* === MAIN GRID === */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-14">

        {/* === BRAND WITH LOGO === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-4 md:col-span-2"
        >
          <div className="flex items-center gap-3">
            <motion.img 
              src={Logo} 
              alt="NCTHSL Logo"
              className="w-24 h-24 object-contain drop-shadow-xl hover:rotate-12 transition-transform duration-500"
              whileHover={{ scale: 1.1 }}
            />
            <h3 className="text-xl font-bold tracking-wide text-white drop-shadow-md">
              Nigeria Customs Technical & Hangar Services Limited
            </h3>
          </div>

          <p className="text-sm leading-relaxed text-gray-300">
            {companyInfo.description}
          </p>
        </motion.div>

        {/* === CONTACT / OFFICE INFO === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-lg font-semibold text-white drop-shadow-md">Office & Contact</h3>
          <ul className="space-y-5 text-sm text-gray-300">

            <motion.li 
              className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300"
              whileHover={{ color: "#ffffff" }}
            >
              <MapPin className="text-red-500 mt-1" size={20} />
              <div>
                <p className="font-semibold text-white">Address</p>
                <p>Customs Airwing Hangar, General Aviation Terminal, Nnamdi Azikiwe International Airport, Abuja.</p>
              </div>
            </motion.li>

            <motion.li 
              className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300"
              whileHover={{ color: "#ffffff" }}
            >
              <Clock className="text-red-500 mt-1" size={18} />
              <div>
                <p className="font-semibold text-white">Working Hours</p>
                <p>Mon–Fri: 8:30 AM – 5:00 PM</p>
              </div>
            </motion.li>

            <motion.li 
              className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300"
              whileHover={{ color: "#ffffff" }}
            >
              <Phone className="text-red-500 mt-1" size={18} />
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p>+234 810 407 3973</p>
              </div>
            </motion.li>

            <motion.li 
              className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300"
              whileHover={{ color: "#ffffff" }}
            >
              <Mail className="text-red-500 mt-1" size={20} />
              <div>
                <p className="font-semibold text-white">Email</p>
                <p>info@nigeriacustomshangar-services.ng</p>
              </div>
            </motion.li>

          </ul>
        </motion.div>

        {/* === SERVICES === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-lg font-semibold text-white drop-shadow-md">Our Services</h3>
          <ul className="space-y-4 text-sm">
            <motion.li whileHover={{ x: 5, color: "#ffffff" }} transition={{ duration: 0.3 }}>
              <a href="#services" className="hover:text-white transition">Fixed Based Operations</a>
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#ffffff" }} transition={{ duration: 0.3 }}>
              <a href="#services" className="hover:text-white transition">General Aviation Maintenance</a>
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#ffffff" }} transition={{ duration: 0.3 }}>
              <a href="#services" className="hover:text-white transition">Technical Support & Engineering</a>
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#ffffff" }} transition={{ duration: 0.3 }}>
              <a href="#services" className="hover:text-white transition">UAV Operations & Leasing</a>
            </motion.li>
          </ul>
        </motion.div>

        {/* === NEWSLETTER & SOCIALS === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-lg font-semibold text-white drop-shadow-md">Stay Updated</h3>
          <p className="text-sm text-gray-300">
            Subscribe to receive aviation updates, technical insights, and announcements.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex items-center bg-gray-800 rounded-xl overflow-hidden shadow-xl shadow-black/30">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-transparent text-sm outline-none placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#0A4D2D] hover:bg-green-900 px-6 py-3 text-sm font-semibold text-white transition-all"
            >
              Subscribe
            </button>
          </form>

          {/* === SOCIAL ICONS === */}
          <div className="flex items-center gap-6 mt-6">
            {[
              { icon: Facebook, link: "https://web.facebook.com/profile.php?id=61581852695826" },
              { icon: Twitter, link: "https://x.com/CustomsHangar?s=20" },
              { icon: Instagram, link: "https://www.instagram.com/customshangarservices" },
              { icon: Linkedin, link: "#" }
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
                whileHover={{ scale: 1.3, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <item.icon size={26} className="drop-shadow-lg" />
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>

      {/* === LEGAL === */}
      <div className="max-w-7xl mx-auto px-6 mt-16 border-t border-green-700/40 pt-6 text-center text-xs text-gray-400 leading-relaxed">
        <p>
          © {new Date().getFullYear()} Nigeria Customs Technical Hangar Services Limited.  
          All Rights Reserved.
        </p>
        <p className="mt-2">
          Authorized under the Federal Republic of Nigeria – Aviation Standards & Compliance Directorate.
        </p>
        <p className="mt-2 tracking-wide">
          Designed by NCTHSL ICT
        </p>
      </div>

    </footer>
  );
}