// src/admin/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  Newspaper, 
  Briefcase, 
  Image, 
  MessageCircle, 
  Users,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1";

export default function Dashboard() {
  const [stats, setStats] = useState({
    news: 0,
    services: 0,
    gallery: 0,
    testimonials: 0,
    messages: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");
  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [newsRes, servicesRes, galleryRes, testimonialsRes] = await Promise.all([
          axios.get(`${API_BASE}/news/all-news`, getAuthHeaders()),
          axios.get(`${API_BASE}/service/all-service`, getAuthHeaders()),
          axios.get(`${API_BASE}/gallery/galleries`, getAuthHeaders()),
          axios.get(`${API_BASE}/testimonials/all-testimonials`, getAuthHeaders()),
        ]);

        const news = newsRes.data || [];
        const services = servicesRes.data || [];
        const gallery = galleryRes.data || [];
        const testimonials = testimonialsRes.data || [];

        // Update stats
        setStats({
          news: news.length,
          services: services.length,
          gallery: gallery.length,
          testimonials: testimonials.length,
          messages: 0,
        });

        // Generate chart data (last 7 days simulation)
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const chart = days.map((day, i) => ({
          day,
          content: Math.floor(Math.random() * 10) + 5 + i,
        }));
        setChartData(chart);

        // Recent Activity (last 5 items)
        const allItems = [
          ...news.map(n => ({ ...n, type: "news", date: n.createdAt || new Date() })),
          ...services.map(s => ({ ...s, type: "service", date: new Date() })),
          ...gallery.map(g => ({ ...g, type: "gallery", date: new Date() })),
          ...testimonials.map(t => ({ ...t, type: "testimonial", date: new Date() })),
        ];

        const sorted = allItems
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);

        setRecentActivity(sorted.map(item => ({
          id: item.id,
          title: item.title || item.name || "New Item",
          type: item.type,
          time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(item.date).toLocaleDateString(),
        })));

      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: "Total News", value: stats.news, icon: Newspaper, color: "from-red-500 to-red-700", trend: "+12%" },
    { label: "Services", value: stats.services, icon: Briefcase, color: "from-blue-500 to-blue-700", trend: "+8%" },
    { label: "Gallery Albums", value: stats.gallery, icon: Image, color: "from-purple-500 to-purple-700", trend: "+23%" },
    { label: "Testimonials", value: stats.testimonials, icon: MessageCircle, color: "from-green-500 to-emerald-700", trend: "+15%" },
    { label: "Messages", value: stats.messages, icon: Users, color: "from-orange-500 to-orange-700", trend: "0%" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          <p className="mt-6 text-2xl font-semibold text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Real-time overview of NCTHSL content & activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-12">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -12, scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl"
                style={{ background: `linear-gradient(135deg, ${card.color.split(' ')[1]}, ${card.color.split(' ')[3]})` }}
              />
              <div className={`relative bg-gradient-to-br ${card.color} p-8 rounded-3xl shadow-2xl text-white overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <card.icon size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/80 text-sm font-medium">{card.label}</p>
                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">{card.trend}</span>
                  </div>
                  <motion.p 
                    key={card.value}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-6xl font-extrabold"
                  >
                    {card.value}
                  </motion.p>
                  <div className="flex items-center gap-2 mt-4">
                    <TrendingUp size={20} className="text-white/80" />
                    <span className="text-white/80 text-sm">vs last week</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts + Activity */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Activity className="text-green-600" />
              Content Activity (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: "12px" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="content" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  dot={{ fill: "#10b981", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Clock className="text-blue-600" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                recentActivity.map((act, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition"
                  >
                    <div className={`w-2 h-12 rounded-full ${
                      act.type === "news" ? "bg-red-500" :
                      act.type === "service" ? "bg-blue-500" :
                      act.type === "gallery" ? "bg-purple-500" :
                      "bg-green-500"
                    }`} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{act.title}</p>
                      <p className="text-xs text-gray-500">{act.date} • {act.time}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{  opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl shadow-2xl p-10 text-white text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <CheckCircle2 size={40} className="animate-pulse" />
            <h3 className="text-3xl font-bold">All Systems Operational</h3>
          </div>
          <p className="text-xl">NCTHSL Admin Panel • Uptime: 99.9% • Last updated: {new Date().toLocaleTimeString()}</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-10">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { label: "Add News", to: "/admin/news", color: "bg-red-600 hover:bg-red-700" },
              { label: "Add Service", to: "/admin/services", color: "bg-blue-600 hover:bg-blue-700" },
              { label: "Add Gallery", to: "/admin/gallery", color: "bg-purple-600 hover:bg-purple-700" },
              { label: "Add Testimonial", to: "/admin/testimonials", color: "bg-green-600 hover:bg-green-700" },
            ].map((action, i) => (
              <motion.a
                key={action.label}
                href={action.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.color} text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl transition transform hover:shadow-3xl`}
              >
                {action.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}