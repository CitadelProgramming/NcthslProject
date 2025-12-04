import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function AdminRegistration() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // NEW ROLE FIELD
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullname.trim()) newErrors.fullname = "Full name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";

    if (!form.role.trim()) newErrors.role = "Please select a role."; // Validate role

    if (!form.password.trim()) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSuccessMessage("Admin registered successfully! (Backend pending)");

    setForm({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "", // reset role too
    });

    setErrors({});
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

        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <UserPlus className="mx-auto mb-2 text-blue-600" size={45} />
          <h1 className="text-center text-3xl font-bold text-gray-800">
            Register Admin
          </h1>
          <p className="text-center text-sm text-gray-500">
            Create a new admin account for the system.
          </p>
        </motion.div>

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

          {/* Full Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              name="fullname"
              placeholder="Enter full name"
              value={form.fullname}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${
                errors.fullname ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              placeholder="Enter email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg bg-white ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Select Role --</option>
              <option value="super-admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>

            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
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
                className={`w-full p-3 border rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
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
              className={`w-full p-3 border rounded-lg ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button
              type="submit"
              className="w-full h-12 bg-blue-700 text-white rounded-lg text-lg font-semibold hover:bg-blue-800 transition"
            >
              Create Admin
            </button>
          </motion.div>

        </form>
      </div>
    </motion.div>
  );
}
