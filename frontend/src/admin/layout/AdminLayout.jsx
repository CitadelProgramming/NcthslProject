// src/admin/layout/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <div className="p-6 overflow-y-auto flex-1">
          <Outlet /> {/* Renders Dashboard, ServicesAdmin, etc */}
        </div>
      </div>
    </div>
  );
}
