// src/admin/pages/MessagesAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1";

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("adminToken");
  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/contact/all-contact`, getAuthConfig());
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      Swal.fire("Error", "Failed to load messages. Please log in again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // FIXED DATE FORMATTER — Handles backend array format [year, month, day, hour, minute...]
  const formatDate = (dateInput) => {
    if (!dateInput) return "Recently";

    if (Array.isArray(dateInput)) {
      const [year, month, day, hour = 0, minute = 0] = dateInput;
      const date = new Date(year, month - 1, day, hour, minute);
      if (isNaN(date.getTime())) return "Recently";
      return date.toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Fallback for standard string dates
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Recently";
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Contact Messages</h1>

        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
            <p className="text-xl text-gray-600">No messages received yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <h3 className="text-2xl font-bold">{msg.fullName}</h3>
                  <p className="text-sm opacity-90 mt-1">{msg.email}</p>
                  {msg.phoneNo && (
                    <p className="text-sm opacity-90 mt-2">
                      Phone: {msg.phoneNo}
                    </p>
                  )}
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                      {msg.subject}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                    <span className="flex items-center gap-2">
                      Received
                    </span>
                    <span className="font-medium">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Footer accent */}
                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}