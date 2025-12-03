import {  Facebook, Instagram, Linkedin, Twitter,  MapPin, Clock, Phone, Mail } from "lucide-react";
import Logo from "../assets/logo.png";  // UPDATE IF PATH DIFFERS

export default function Footer() {
  return (
    <footer className="w-full bg-[#082F1F] text-gray-200 pt-20 pb-10 mt-24 border-t border-gray-700/40">

      {/* === MAIN GRID === */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-14">

        {/* === BRAND WITH LOGO === */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3 animate-fadeIn">
            <img 
              src={Logo} 
              alt="NCTHSL Logo"
              className="w-24 h-24 object-contain drop-shadow-lg hover:scale-110 transition"
            />
            <h3 className="text-xl font-bold tracking-wide">
              Nigeria Customs Technical & Hangar Services Limited
            </h3>
          </div>

          <p className="text-sm leading-relaxed text-gray-300 animate-slideUp">
            A premier aviation support and maintenance organization providing 
            world-class engineering, operational support, and mission-critical 
            aviation services for national security and civil aviation advancement.
          </p>
        </div>

        {/* === CONTACT / OFFICE INFO === */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Office & Contact</h3>
          <ul className="space-y-4 text-sm text-gray-300">

            <li className="flex items-start gap-3">
              <MapPin className="text-red-600 mt-1" size={20} />
              <div>
                <p className="font-semibold text-white">Address</p>
                <p>Customs Technical Hangar, NAF Base, Kaduna, Nigeria</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Clock className="text-red-600 mt-1" size={18} />
              <div>
                <p className="font-semibold text-white">Working Hours</p>
                <p>Mon–Fri: 8:30 AM – 5:00 PM</p>
                <p>Sat: 10:00 AM – 3:00 PM</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Phone className="text-red-600 mt-1" size={18} />
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p>+234 903 578 3766</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Mail className="text-red-600 mt-1" size={18} />
              <div>
                <p className="font-semibold text-white">Email</p>
                <p>info@ncthsl.gov.ng</p>
              </div>
            </li>

          </ul>
        </div>

        {/* === SERVICES === */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Our Services</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#services" className="hover:text-white transition">Fixed Based Operations</a></li>
            <li><a href="#services" className="hover:text-white transition">General Aviation Maintenance</a></li>
            <li><a href="#services" className="hover:text-white transition">Technical Support & Engineering</a></li>
            <li><a href="#services" className="hover:text-white transition">UAV Operations & Leasing</a></li>
          </ul>
        </div>

        {/* === NEWSLETTER & SOCIALS === */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm text-gray-300 mb-3">
            Subscribe to receive aviation updates, technical insights, and announcements.
          </p>

          <form className="flex items-center bg-gray-800 rounded-lg overflow-hidden animate-fadeIn shadow-lg shadow-black/20">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-transparent text-sm outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-[#0A4D2D] px-4 py-2 text-sm font-semibold hover:bg-green-900 transition-all"
            >
              Subscribe
            </button>
          </form>

          {/* === SOCIAL ICONS === */}
          <div className="flex items-center gap-4 mt-6">
            {[ 
              { icon: Facebook, link: "https://web.facebook.com/profile.php?id=61581852695826" },
              { icon: Twitter, link: "https://x.com/CustomsHangar?s=20" },
              { icon: Instagram, link: "https://www.instagram.com/customshangarservices" },
              { icon: Linkedin, link: "#" }
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                className="hover:text-white transition transform hover:scale-125 hover:-translate-y-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <item.icon size={22} className="drop-shadow-md" />
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* === LEGAL === */}
      <div className="max-w-7xl mx-auto px-6 mt-16 border-t border-gray-700/40 pt-6 text-center text-xs text-gray-400 leading-relaxed animate-slideUp">
        <p>
          © {new Date().getFullYear()} Nigeria Customs Technical Hangar Services Limited.  
          All Rights Reserved.
        </p>
        <p className="mt-2">
          Authorized under the Federal Republic of Nigeria – Aviation Standards & Compliance Directorate.
        </p>
        <p className="mt-2 text-gray-400 tracking-wide">
          Designed by NCTHSL ICT
        </p>
      </div>

    </footer>
  );
}
