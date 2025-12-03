// frontend/src/pages/Contact.jsx
import { useState } from "react";
// Removed axios and api imports
import { motion } from "framer-motion";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    mobile: "",     // added
    botphone: "",   // honeypot renamed
  });

  // Simplified status management, as we won't be calling a real API
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    // UPDATED honeypot logic
    if (form.botphone && form.botphone.trim() !== "") return "Bot detected.";

    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";

    const re = /\S+@\S+\.\S+/;
    if (!re.test(form.email)) return "Please enter a valid email address.";

    if (!form.subject.trim()) return "Please add a subject.";

    if (!form.message.trim() || form.message.trim().length < 10)
      return "Please enter a message (10+ characters).";

    return null;
  }

  // Modified handleSubmit to simulate success without an API call
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    const invalid = validate();
    if (invalid) {
      setStatus({ loading: false, success: null, error: invalid });
      return;
    }

    // Simulate an API call delay using a Promise/setTimeout
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // Simulate success
      setStatus({ loading: false, success: "Message received (simulated success)!", error: null });
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        mobile: "",
        botphone: "",
      });

    } catch (err) {
      // Catch any simulated errors
      setStatus({
        loading: false,
        success: null,
        error: "An unexpected error occurred during simulation.",
      });
    }
  }

  return (
    <div className="w-full">

      {/* HEADER */}
      <motion.section
        className="bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white py-20 px-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Contact Us
          </motion.h1>

          <motion.p
            className="mt-4 text-lg md:text-xl text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            For quotations, technical enquiries or support — send us a message and our team will respond.
          </motion.p>
        </div>
      </motion.section>

      {/* CONTACT FORM */}
      <section className="py-12 px-6 bg-gradient-to-br from-[#818589] to-[#525354]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-start">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>

            <p className="text-gray-100 mb-6 leading-relaxed">
              Nigeria Customs Technical Hangar Services Limited<br />
              <strong>Phone:</strong> +234 810 407 3973<br />
              <strong>Email:</strong> info@nigeriacustomshangar-services.ng
            </p>

            <div className="space-y-4">

              <motion.div
                className="p-4 bg-white rounded-lg shadow"
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <h4 className="font-semibold">Office Hours</h4>
                <p className="text-sm text-gray-600">Mon - Fri, 08:30 - 17:00</p>
              </motion.div>

              <motion.div
                className="p-4 bg-white rounded-lg shadow"
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <h4 className="font-semibold">Location</h4>
                <p className="text-sm text-gray-600">Customs Airwing Hangar, General Aviation Terminal, Nnamdi Azikiwe International Airport, Abuja. (Map Below)</p>
              </motion.div>

            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            {/* UPDATED honeypot */}
            <input
              type="text"
              name="botphone"
              value={form.botphone}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
              style={{ display: "none" }}
            />

            <div className="grid gap-4">

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A4D2D]"
                  required
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A4D2D]"
                  required
                />

                {/* FIXED mobile field */}
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A4D2D]"
                  required
                />
              </motion.div>

              <motion.input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A4D2D]"
                required
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200 }}
              />

              <motion.textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your message"
                rows="6"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A4D2D]"
                required
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200 }}
              />

              <div className="flex items-center gap-4">
                <motion.button
                  type="submit"
                  disabled={status.loading}
                  className="bg-[#0A4D2D] text-white px-6 py-3 rounded-lg shadow inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {status.loading ? "Sending..." : "Send Message"}
                </motion.button>

                <motion.button
                  type="reset"
                  onClick={() =>
                    setForm({
                      name: "",
                      email: "",
                      subject: "",
                      message: "",
                      mobile: "",
                      botphone: "",
                    })
                  }
                  className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Clear Form
                </motion.button>

                {status.success && <p className="text-green-600 ml-4">{status.success}</p>}
                {status.error && <p className="text-red-600 ml-4">{status.error}</p>}
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      {/* MAP */}
      <motion.section
        className="w-full h-[450px] mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5069330037873!2d7.273863175018739!3d9.017434491043428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e73fd531ddf41%3A0xf0942f93db50b157!2sNigeria%20Customs%20Technical%20%26%20Hangar%20Services%20Limited!5e0!3m2!1sen!2sng!4v1763544496971!5m2!1sen!2sng"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </motion.section>

    </div>
  );
}
