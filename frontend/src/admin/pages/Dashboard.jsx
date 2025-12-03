import React from "react";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold">Total News</h2>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold">Total Services</h2>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold">Messages</h2>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
