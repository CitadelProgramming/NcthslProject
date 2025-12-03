import React from "react";

export default function Topbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">NCTHSL Admin Panel</h2>

      <p className="text-gray-600">
        Logged in as <span className="font-semibold">Administrator</span>
      </p>
    </div>
  );
}
