// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <AlertTriangle size={120} className="mx-auto text-red-500 mb-8 drop-shadow-2xl" />
        <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6">404</h1>
        <p className="text-2xl md:text-4xl text-gray-300 mb-8">Page Not Found</p>
        <p className="text-lg text-gray-400 mb-12">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition transform hover:scale-105"
        >
          <Home size={28} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}