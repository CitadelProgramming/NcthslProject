import React, { useState } from "react";
import Swal from "sweetalert2";

export default function LeadershipTeamAdmin() {
  const [leaders, setLeaders] = useState([
    {
      id: 1,
      name: "Engr. Ibrahim Musa",
      role: "Managing Director",
      bio: "Oversees all operations and strategic direction of NCTHSL.",
      photo: "",
    },
    {
      id: 2,
      name: "Capt. John Doe",
      role: "Director of Flight Operations",
      bio: "Ensures safe flights and sets operational standards.",
      photo: "",
    },
  ]);

  const [newLeader, setNewLeader] = useState({
    name: "",
    role: "",
    bio: "",
    photo: "",
  });

  const [editingLeader, setEditingLeader] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    role: "",
    bio: "",
    photo: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Convert uploaded image to base64
  const handlePhotoUpload = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEditing) {
        setEditData({ ...editData, photo: reader.result });
      } else {
        setNewLeader({ ...newLeader, photo: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  // Add or update a leader
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingLeader) {
      setLeaders(
        leaders.map((l) =>
          l.id === editingLeader ? { ...l, ...editData } : l
        )
      );
      Swal.fire("Updated!", "Leadership team member updated.", "success");
      setEditingLeader(null);
      setEditData({ name: "", role: "", bio: "", photo: "" });
    } else {
      if (!newLeader.name || !newLeader.role || !newLeader.bio) {
        Swal.fire("Error", "Please fill all required fields", "error");
        return;
      }

      const leader = { ...newLeader, id: Date.now() };
      setLeaders([leader, ...leaders]);
      Swal.fire("Success", "New leader added!", "success");
      setNewLeader({ name: "", role: "", bio: "", photo: "" });
    }
  };

  const startEdit = (leader) => {
    setEditingLeader(leader.id);
    setEditData({ ...leader });
  };

  const cancelEdit = () => {
    setEditingLeader(null);
    setEditData({ name: "", role: "", bio: "", photo: "" });
  };

  const handleDelete = (id) => {
    setLeaders(leaders.filter((l) => l.id !== id));
    Swal.fire("Deleted!", "Leader removed", "success");
  };

  const filteredLeaders = leaders.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leadership Team Management</h1>

      <input
        type="text"
        placeholder="Search leaders..."
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
          placeholder="Full Name"
          value={editingLeader ? editData.name : newLeader.name}
          onChange={(e) =>
            editingLeader
              ? setEditData({ ...editData, name: e.target.value })
              : setNewLeader({ ...newLeader, name: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Position / Role"
          value={editingLeader ? editData.role : newLeader.role}
          onChange={(e) =>
            editingLeader
              ? setEditData({ ...editData, role: e.target.value })
              : setNewLeader({ ...newLeader, role: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          placeholder="Short Bio / Description"
          value={editingLeader ? editData.bio : newLeader.bio}
          onChange={(e) =>
            editingLeader
              ? setEditData({ ...editData, bio: e.target.value })
              : setNewLeader({ ...newLeader, bio: e.target.value })
          }
          className="w-full p-2 border rounded h-24"
          required
        />

        {/* Photo Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handlePhotoUpload(e, !!editingLeader)}
          className="w-full p-2 border rounded"
        />

        {(editingLeader ? editData.photo : newLeader.photo) && (
          <img
            src={editingLeader ? editData.photo : newLeader.photo}
            alt="Preview"
            className="w-24 h-24 object-cover rounded mt-2"
          />
        )}

        <button className="bg-green-600 text-white w-full p-2 rounded">
          {editingLeader ? "Update Leader" : "Add Leader"}
        </button>

        {editingLeader && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-500 text-white w-full p-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Leaders List */}
      <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {filteredLeaders.length === 0 ? (
          <p>No leaders found.</p>
        ) : (
          filteredLeaders.map((l) => (
            <div
              key={l.id}
              className="bg-white p-4 shadow rounded flex flex-col md:flex-row justify-between items-start"
            >
              <div className="flex items-center space-x-4">
                {l.photo ? (
                  <img
                    src={l.photo}
                    className="w-20 h-20 object-cover rounded-full"
                    alt={l.name}
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                )}
                <div>
                  <h2 className="text-lg font-bold">{l.name}</h2>
                  <p className="font-semibold text-gray-700">{l.role}</p>
                  <p className="text-sm text-gray-600 mt-1">{l.bio}</p>
                </div>
              </div>

              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 mt-2 md:mt-0">
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => startEdit(l)}
                >
                  Edit
                </button>

                <button
                  className="text-red-600 text-sm"
                  onClick={() => handleDelete(l.id)}
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
