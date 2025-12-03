// src/admin/pages/PartnersAdmin.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function PartnersAdmin() {
  const [partners, setPartners] = useState([
    {
      id: 1,
      name: "Sky Aviation Ltd",
      website: "https://skyaviation.com",
      logo: "", // store image URL or base64 preview
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const [newPartner, setNewPartner] = useState({
    name: "",
    website: "",
    logo: null,
    logoPreview: "",
  });

  const [editingPartner, setEditingPartner] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    website: "",
    logo: null,
    logoPreview: "",
  });

  // Handle new partner logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPartner({
        ...newPartner,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      });
    }
  };

  // Handle edit logo upload
  const handleEditLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({
        ...editData,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      });
    }
  };

  // Add partner
  const handleAddPartner = (e) => {
    e.preventDefault();

    if (!newPartner.name) {
      Swal.fire("Error", "Partner name is required", "error");
      return;
    }

    const partner = {
      id: Date.now(),
      name: newPartner.name,
      website: newPartner.website,
      logo: newPartner.logoPreview,
    };

    setPartners([partner, ...partners]);

    setNewPartner({
      name: "",
      website: "",
      logo: null,
      logoPreview: "",
    });

    Swal.fire("Success", "Partner added!", "success");
  };

  // Start editing
  const startEdit = (partner) => {
    setEditingPartner(partner.id);
    setEditData({
      name: partner.name,
      website: partner.website,
      logoPreview: partner.logo,
      logo: null,
    });
  };

  // Save edited partner
  const saveEdit = (id) => {
    setPartners(
      partners.map((p) =>
        p.id === id
          ? {
              ...p,
              name: editData.name,
              website: editData.website,
              logo: editData.logoPreview,
            }
          : p
      )
    );

    setEditingPartner(null);
    Swal.fire("Success", "Partner updated!", "success");
  };

  // Delete partner
  const deletePartner = (id) => {
    setPartners(partners.filter((p) => p.id !== id));
    Swal.fire("Deleted", "Partner removed", "success");
  };

  // Filter search
  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Partners Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search partners..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded max-w-lg"
      />

      {/* Add Partner */}
      <form
        onSubmit={handleAddPartner}
        className="bg-white p-4 shadow rounded space-y-3 max-w-lg mb-6"
      >
        <input
          type="text"
          placeholder="Partner Name"
          value={newPartner.name}
          onChange={(e) =>
            setNewPartner({ ...newPartner, name: e.target.value })
          }
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Website (optional)"
          value={newPartner.website}
          onChange={(e) =>
            setNewPartner({ ...newPartner, website: e.target.value })
          }
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="w-full"
        />

        {newPartner.logoPreview && (
          <img
            src={newPartner.logoPreview}
            alt="preview"
            className="h-20 mt-2 object-contain"
          />
        )}

        <button className="bg-blue-600 text-white p-2 w-full rounded">
          Add Partner
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        {filteredPartners.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 shadow rounded flex flex-col md:flex-row justify-between"
          >
            {editingPartner === p.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />

                <input
                  type="text"
                  value={editData.website}
                  onChange={(e) =>
                    setEditData({ ...editData, website: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditLogoUpload}
                />

                {editData.logoPreview && (
                  <img
                    src={editData.logoPreview}
                    alt="logo"
                    className="h-20 object-contain mt-1"
                  />
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => saveEdit(p.id)}
                    className="bg-green-600 text-white p-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPartner(null)}
                    className="bg-gray-500 text-white p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{p.name}</h2>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {p.website}
                    </a>
                  )}
                  {p.logo && (
                    <img
                      src={p.logo}
                      alt="logo"
                      className="h-16 mt-2 object-contain"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    className="text-blue-600"
                    onClick={() => startEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deletePartner(p.id)}
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
