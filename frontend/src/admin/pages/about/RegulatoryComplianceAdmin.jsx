// src/admin/pages/RegulatoryComplianceAdmin.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function RegulatoryComplianceAdmin() {
  const [records, setRecords] = useState([
    {
      id: 1,
      title: "NCAA Safety Certification 2024",
      description: "Approved by Nigerian Civil Aviation Authority.",
      file: null,
      fileName: "",
      imagePreview: "",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const [newRecord, setNewRecord] = useState({
    title: "",
    description: "",
    file: null,
    fileName: "",
    image: null,
    imagePreview: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    file: null,
    fileName: "",
    image: null,
    imagePreview: "",
  });

  // -----------------------------
  // New Record — File Upload
  // -----------------------------
  const handleNewFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRecord({
        ...newRecord,
        file,
        fileName: file.name,
      });
    }
  };

  // New Record — Image Upload
  const handleNewImageUpload = (e) => {
    const img = e.target.files[0];
    if (img) {
      setNewRecord({
        ...newRecord,
        image: img,
        imagePreview: URL.createObjectURL(img),
      });
    }
  };

  // -----------------------------
  // Edit Mode — File Upload
  // -----------------------------
  const handleEditFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({
        ...editData,
        file,
        fileName: file.name,
      });
    }
  };

  // Edit Mode — Image Upload
  const handleEditImageUpload = (e) => {
    const img = e.target.files[0];
    if (img) {
      setEditData({
        ...editData,
        image: img,
        imagePreview: URL.createObjectURL(img),
      });
    }
  };

  // -----------------------------
  // Add Regulatory Record
  // -----------------------------
  const addRecord = (e) => {
    e.preventDefault();

    if (!newRecord.title) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    const record = {
      id: Date.now(),
      title: newRecord.title,
      description: newRecord.description,
      file: newRecord.file,
      fileName: newRecord.fileName,
      image: newRecord.image,
      imagePreview: newRecord.imagePreview,
    };

    setRecords([record, ...records]);

    setNewRecord({
      title: "",
      description: "",
      file: null,
      fileName: "",
      image: null,
      imagePreview: "",
    });

    Swal.fire("Success", "Compliance record added!", "success");
  };

  // -----------------------------
  // Start Editing Record
  // -----------------------------
  const startEdit = (record) => {
    setEditingId(record.id);
    setEditData({
      title: record.title,
      description: record.description,
      file: record.file,
      fileName: record.fileName,
      image: record.image,
      imagePreview: record.imagePreview,
    });
  };

  // -----------------------------
  // Save Edited Record
  // -----------------------------
  const saveEdit = (id) => {
    setRecords(
      records.map((r) =>
        r.id === id
          ? {
              ...r,
              title: editData.title,
              description: editData.description,
              file: editData.file,
              fileName: editData.fileName,
              image: editData.image,
              imagePreview: editData.imagePreview,
            }
          : r
      )
    );

    setEditingId(null);
    Swal.fire("Success", "Record updated!", "success");
  };

  // -----------------------------
  // Delete Record
  // -----------------------------
  const deleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id));
    Swal.fire("Deleted", "Compliance record removed!", "success");
  };

  // -----------------------------
  // Filter Search
  // -----------------------------
  const filtered = records.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Regulatory & Compliance Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search records..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded max-w-lg"
      />

      {/* Add New Record */}
      <form
        onSubmit={addRecord}
        className="bg-white p-4 shadow rounded space-y-3 max-w-xl mb-6"
      >
        <input
          type="text"
          placeholder="Title"
          value={newRecord.title}
          onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Description"
          value={newRecord.description}
          onChange={(e) =>
            setNewRecord({ ...newRecord, description: e.target.value })
          }
          className="w-full p-2 border rounded"
        />

        <label className="font-semibold">Upload Document (PDF Optional)</label>
        <input type="file" accept=".pdf" onChange={handleNewFileUpload} />

        {newRecord.fileName && (
          <p className="text-sm text-gray-600">File: {newRecord.fileName}</p>
        )}

        <label className="font-semibold">Upload Certificate Image (Optional)</label>
        <input type="file" accept="image/*" onChange={handleNewImageUpload} />

        {newRecord.imagePreview && (
          <img
            src={newRecord.imagePreview}
            className="h-24 mt-2 object-contain"
            alt="preview"
          />
        )}

        <button className="bg-blue-600 text-white p-2 w-full rounded">
          Add Record
        </button>
      </form>

      {/* List of Records */}
      <div className="space-y-4">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="bg-white p-4 shadow rounded flex flex-col md:flex-row justify-between"
          >
            {editingId === rec.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />

                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />

                <input type="file" accept=".pdf" onChange={handleEditFileUpload} />
                {editData.fileName && (
                  <p className="text-sm text-gray-600">File: {editData.fileName}</p>
                )}

                <input type="file" accept="image/*" onChange={handleEditImageUpload} />
                {editData.imagePreview && (
                  <img
                    src={editData.imagePreview}
                    className="h-24 mt-2 object-contain"
                    alt="certificate"
                  />
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => saveEdit(rec.id)}
                    className="bg-green-600 text-white p-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{rec.title}</h2>
                  <p className="text-gray-700">{rec.description}</p>

                  {rec.fileName && (
                    <p className="text-blue-600 mt-2">📄 {rec.fileName}</p>
                  )}

                  {rec.imagePreview && (
                    <img
                      src={rec.imagePreview}
                      className="h-20 mt-2 object-contain"
                      alt="certificate"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-3 md:mt-0">
                  <button
                    className="text-blue-600"
                    onClick={() => startEdit(rec)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteRecord(rec.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
