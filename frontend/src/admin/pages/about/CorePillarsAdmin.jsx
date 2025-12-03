import React, { useState } from "react";
import Swal from "sweetalert2";

export default function CorePillarsAdmin() {
  // Initial hard-coded pillars
  const [pillars, setPillars] = useState([
    {
      id: 1,
      title: "Integrity",
      description:
        "We maintain the highest ethical standards in all our operations.",
    },
    {
      id: 2,
      title: "Excellence",
      description:
        "We are committed to delivering top-tier aviation solutions.",
    },
    {
      id: 3,
      title: "Safety",
      description:
        "We prioritize safety in all operations and procedures.",
    },
  ]);

  const [newPillar, setNewPillar] = useState({ title: "", description: "" });

  const [editingPillar, setEditingPillar] = useState(null); // id
  const [editData, setEditData] = useState({ title: "", description: "" });

  const [searchTerm, setSearchTerm] = useState("");

  // Add or Update Pillar
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingPillar) {
      // Save edits
      setPillars(
        pillars.map((p) =>
          p.id === editingPillar ? { ...p, ...editData } : p
        )
      );
      Swal.fire("Updated!", "Pillar updated successfully", "success");
      setEditingPillar(null);
      setEditData({ title: "", description: "" });
    } else {
      // Add new
      if (!newPillar.title.trim() || !newPillar.description.trim()) {
        Swal.fire("Error", "All fields are required", "error");
        return;
      }
      const pillar = { ...newPillar, id: Date.now() };
      setPillars([pillar, ...pillars]);
      Swal.fire("Success", "New pillar added!", "success");
      setNewPillar({ title: "", description: "" });
    }
  };

  // Start editing
  const startEdit = (pillar) => {
    setEditingPillar(pillar.id);
    setEditData({ title: pillar.title, description: pillar.description });
  };

  const cancelEdit = () => {
    setEditingPillar(null);
    setEditData({ title: "", description: "" });
  };

  // Delete pillar
  const handleDelete = (id) => {
    setPillars(pillars.filter((p) => p.id !== id));
    Swal.fire("Deleted", "Pillar removed", "success");
  };

  // Filter search
  const filteredPillars = pillars.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Core Pillars Management</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search pillars..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded max-w-lg"
      />

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded max-w-lg space-y-3"
      >
        <input
          type="text"
          placeholder="Pillar Title"
          className="w-full p-2 border rounded"
          value={editingPillar ? editData.title : newPillar.title}
          onChange={(e) =>
            editingPillar
              ? setEditData({ ...editData, title: e.target.value })
              : setNewPillar({ ...newPillar, title: e.target.value })
          }
        />

        <textarea
          placeholder="Pillar Description"
          className="w-full p-2 border rounded h-24"
          value={editingPillar ? editData.description : newPillar.description}
          onChange={(e) =>
            editingPillar
              ? setEditData({ ...editData, description: e.target.value })
              : setNewPillar({ ...newPillar, description: e.target.value })
          }
        />

        <button className="bg-green-600 text-white w-full p-2 rounded">
          {editingPillar ? "Update Pillar" : "Add Pillar"}
        </button>

        {editingPillar && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-500 text-white w-full p-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Pillars List */}
      <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {filteredPillars.length === 0 ? (
          <p>No pillars found.</p>
        ) : (
          filteredPillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white p-4 shadow rounded flex flex-col md:flex-row justify-between items-start"
            >
              <div className="flex-1">
                <h2 className="text-lg font-bold">{pillar.title}</h2>
                <p>{pillar.description}</p>
              </div>

              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 mt-2 md:mt-0">
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => startEdit(pillar)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 text-sm"
                  onClick={() => handleDelete(pillar.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
