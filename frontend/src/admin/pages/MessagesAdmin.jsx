// src/admin/pages/MessagesAdmin.jsx
import React, { useState } from "react";

export default function MessagesAdmin() {
  // Hard-coded example messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      mobile: "08012345678",
      subject: "Service Inquiry",
      message: "Hello, I want to know more about your aviation services.",
      createdAt: "2025-11-30T10:30:00",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
      mobile: "08087654321",
      subject: "Booking Request",
      message: "Can I book a private flight for next week?",
      createdAt: "2025-11-29T14:15:00",
    },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-4 shadow rounded">
              <p>
                <strong>From:</strong> {msg.fullName} ({msg.email})
              </p>
              <p>
                <strong>Mobile:</strong> {msg.mobile}
              </p>
              <p>
                <strong>Subject:</strong> {msg.subject}
              </p>
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
              <p className="text-xs text-gray-400">
                Sent: {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
