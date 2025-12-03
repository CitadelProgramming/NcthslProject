import React, { useState } from "react";
import Swal from "sweetalert2";

export default function CompanyOverviewAdmin() {
  // Mock stored overview text
  const [overview, setOverview] = useState(
    "Nigeria Customs Technical Hangar Services Limited (NCTHSL) is committed to providing world-class aviation maintenance and technical support services..." // default placeholder
  );

  // Temporary input before saving
  const [newText, setNewText] = useState(overview);

  const handleSave = (e) => {
    e.preventDefault();

    if (!newText.trim()) {
      Swal.fire("Error", "Overview text cannot be empty", "error");
      return;
    }

    setOverview(newText);

    Swal.fire("Success", "Company Overview Updated Successfully!", "success");
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Company Overview Management</h1>

      {/* Edit Form */}
      <form
        onSubmit={handleSave}
        className="bg-white p-4 shadow rounded max-w-3xl space-y-3"
      >
        <label className="font-semibold">Edit Company Overview</label>

        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="w-full p-3 border rounded h-48"
          placeholder="Enter company overview..."
        />

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded w-full"
        >
          Save Overview
        </button>
      </form>

      {/* Current Overview Preview */}
      <div className="bg-white p-4 shadow rounded mt-6 max-w-3xl">
        <h2 className="text-xl font-semibold mb-2">Current Overview</h2>
        <p className="whitespace-pre-line">{overview}</p>
      </div>
    </div>
  );
}
