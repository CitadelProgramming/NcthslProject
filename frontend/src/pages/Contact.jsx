// src/pages/Contact.jsx
import { useState } from "react";
import { motion } from "framer-motion";

// CORRECT PUBLIC ENDPOINT — NO AUTH REQUIRED
const API_URL = "https://enchanting-expression-production.up.railway.app/api/v1/contact/add-contact";

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    phoneNo: "",
    botphone: "", // honeypot
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (form.botphone.trim() !== "") return "Spam detected.";
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      return "Valid email required.";
    if (!form.phoneNo.trim()) return "Phone number is required.";
    if (!form.subject.trim()) return "Subject is required.";
    if (!form.message.trim() || form.message.length < 10)
      return "Message must be at least 10 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    const error = validate();
    if (error) {
      setStatus({ loading: false, error });
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          phoneNo: form.phoneNo.trim(),
        }),
      });

      if (res.ok) {
        setStatus({
          loading: false,
          success: "Thank you! Your message has been sent successfully.",
        });
        setForm({
          fullName: "",
          email: "",
          subject: "",
          message: "",
          phoneNo: "",
          botphone: "",
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Contact error:", err);
      setStatus({
        loading: false,
        error: err.message || "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <motion.section
        className="bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white py-20 px-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 className="text-4xl md:text-5xl font-bold">
            Contact Us
          </motion.h1>
          <motion.p className="mt-4 text-lg md:text-xl text-gray-200">
            For quotations, technical enquiries or support — send us a message and our team will respond.
          </motion.p>
        </div>
      </motion.section>

      {/* FORM */}
      <section className="py-12 px-6 bg-gradient-to-br from-[#818589] to-[#525354]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-start">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="text-gray-100 mb-8 text-lg">
              Nigeria Customs Technical & Hangar Services Limited<br />
              <strong className="text-white">Phone:</strong> +234 810 407 3973<br />
              <strong className="text-white">Email:</strong> info@nigeriacustomshangar-services.ng
            </p>
            <div className="space-y-6">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
                <h4 className="font-bold text-xl text-white mb-2">Office Hours</h4>
                <p className="text-gray-200">Monday - Friday: 08:30 - 17:00</p>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
                <h4 className="font-bold text-xl text-white mb-2">Location</h4>
                <p className="text-gray-200">
                  Customs Airwing Hangar,<br />
                  Nnamdi Azikiwe International Airport, Abuja.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
          >
            {/* Honeypot */}
            <input
              type="text"
              name="botphone"
              value={form.botphone}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
              className="hidden"
            />

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  className="w-full px-5 py-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-500"
                  required
                />
                
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  className="w-full px-5 py-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <input
                type="text"
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
                placeholder="Phone Number *"
                className="w-full px-5 py-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-500"
                required
              />

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject *"
                className="w-full px-5 py-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-500"
                required
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message *"
                rows="6"
                className="w-full px-5 py-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-500 resize-none"
                required
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  type="submit"
                  disabled={status.loading}
                  className="bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-xl disabled:opacity-70"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status.loading ? "Sending..." : "Send Message"}
                </motion.button>
              </div>

              {/* Status */}
              {status.success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900/60 border border-green-500 text-green-100 p-5 rounded-xl text-center font-semibold"
                >
                  {status.success}
                </motion.div>
              )}
              {status.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/60 border border-red-500 text-red-100 p-5 rounded-xl text-center"
                >
                  {status.error}
                </motion.div>
              )}
            </div>
          </motion.form>
        </div>
      </section>

      {/* MAP */}
      <motion.section className="w-full h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5069330037873!2d7.273863175018739!3d9.017434491043428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e73fd531ddf41%3A0xf0942f93db50b157!2sNigeria%20Customs%20Technical%20%26%20Hangar%20Services%20Limited!5e0!3m2!1sen!2sng!4v1763544496971!5m2!1sen!2sng"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="NCTHSL Location"
        ></iframe>
      </motion.section>
    </div>
  );
}