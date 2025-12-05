import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import axios from "axios";

export default function AdminRegistration() {
  const [showPassword, setShowPassword] = useState(false);
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
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      phone_no: form.phone_no,
      address: form.address,
      role: "admin",
    };

    try {
      setLoading(true);

      const response = await axios.post(
        "https://enchanting-expression-production.up.railway.app/api/v1/auth/register",
        payload
      );

      setSuccessMessage("Admin registered successfully!");
      setErrors({});
      console.log("Registration successful:", response.data);

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
      console.error(error);

      setSuccessMessage("");
      setErrors({
        api: error.response?.data?.message || "Registration failed. Check your input.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      className="min-h-screen px-4 py-10 flex justify-center items-center bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <UserPlus className="mx-auto mb-2 text-blue-600" size={45} />
          <h1 className="text-center text-3xl font-bold text-gray-800">
            Register Admin
          </h1>
          <p className="text-center text-sm text-gray-500">
            Create a new admin account for the system.
          </p>
        </motion.div>

        {errors.api && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 py-2 px-4 rounded text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errors.api}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            className="bg-green-100 border border-green-400 text-green-700 py-2 px-4 rounded text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {successMessage}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* First Name */}
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              name="firstname"
              placeholder="Enter first name"
              value={form.firstname}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-gray-300"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              name="lastname"
              placeholder="Enter last name"
              value={form.lastname}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-gray-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-gray-300"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              name="phone_no"
              placeholder="Enter phone number"
              value={form.phone_no}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-gray-300"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              name="address"
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-gray-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                name="password"
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              name="confirmPassword"
              placeholder="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-gray-300"
            />
          </div>

          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-700 text-white rounded-lg text-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Create Admin"}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
