// src/admin/pages/AdminRegistration.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1";

export default function AdminRegistration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_no: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const getPasswordStrength = () => {
    const pwd = form.password;
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      phone_no: form.phone_no.trim(),
      address: form.address.trim(),
      role: "admin",
    };

    const newErrors = {};
    if (!payload.firstname) newErrors.firstname = "First name is required";
    if (!payload.lastname) newErrors.lastname = "Last name is required";
    if (!payload.email) newErrors.email = "Email is required";
    if (!payload.password) newErrors.password = "Password is required";
    if (payload.password !== payload.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (getPasswordStrength() < 3) {
      newErrors.password = "Password too weak (use uppercase, lowercase, number & symbol)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await axios.post(`${API_BASE}/auth/register`, payload);

      Swal.fire({
        icon: "success",
        title: "Admin Created!",
        text: "New admin account registered successfully.",
        timer: 3000,
        showConfirmButton: false,
        background: "#10b981",
        color: "white",
        toast: true,
        position: "top-end"
      });

      setForm({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone_no: "",
        address: "",
      });

    } catch (error) {
      console.error("Registration error:", error);

      const msg = error.response?.data?.message || "Registration failed. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: msg,
        background: "#ef4444",
        color: "white",
        toast: true,
        position: "top-end",
        timer: 4000
      });

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-10">
          {/* Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl mb-6">
              <UserPlus size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-3">Register New Admin</h1>
            <p className="text-gray-300 text-lg">Create a privileged administrator account</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-white font-medium mb-2">First Name</label>
                <input
                  name="firstname"
                  type="text"
                  value={form.firstname}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-white/10 border ${errors.firstname ? "border-red-500" : "border-white/20"} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition`}
                  placeholder="John"
                />
                {errors.firstname && <p className="text-red-400 text-sm mt-1">{errors.firstname}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-white font-medium mb-2">Last Name</label>
                <input
                  name="lastname"
                  type="text"
                  value={form.lastname}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-white/10 border ${errors.lastname ? "border-red-500" : "border-white/20"} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition`}
                  placeholder="Doe"
                />
                {errors.lastname && <p className="text-red-400 text-sm mt-1">{errors.lastname}</p>}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              >
              <label className="block text-white font-medium mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-white/10 border ${errors.email ? "border-red-500" : "border-white/20"} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition`}
                placeholder="admin@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-white font-medium mb-2">Phone Number</label>
              <input
                name="phone_no"
                type="tel"
                value={form.phone_no}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                placeholder="+234 801 234 5678"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-white font-medium mb-2">Address</label>
              <input
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                placeholder="123 Airport Road, Abuja"
              />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-white font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 bg-white/10 border ${errors.password ? "border-red-500" : "border-white/20"} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-300 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-3">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            i <= getPasswordStrength() ? passwordStrengthColor() : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {getPasswordStrength() < 3 ? "Weak" : getPasswordStrength() < 5 ? "Good" : "Strong"} password
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className="block text-white font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 bg-white/10 border ${errors.confirmPassword ? "border-red-500" : "border-white/20"} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-gray-300 hover:text-white transition"
                  >
                    {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>}
              </motion.div>
            </div>

            {/* FIXED: className instead of ptName */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl py-5 px-12 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={28} />
                    Creating Admin...
                  </>
                ) : (
                  <>
                    <UserPlus size={28} />
                    Create Admin Account
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <div className="text-center mt-10 text-gray-400">
            <p className="text-sm">Only authorized personnel can create admin accounts.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}