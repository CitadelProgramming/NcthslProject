// src/admin/pages/ServicesAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE =
  "https://enchanting-expression-production.up.railway.app/api/v1/service";

export default function ServicesAdmin() {
  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    title: "",
    description: "",
    features: [""],
    imageFile: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [previewMap, setPreviewMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const getAuthConfig = () => {
    const token = localStorage.getItem("adminToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  };

  // -------------------------------------------
  // LOAD ALL SERVICES
  // -------------------------------------------
  const loadServices = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();

      const res = await axios.get(`${API_BASE}/all-service`, config);

      const list = res.data || [];
      setServiceList(list);

      list.forEach((item) => loadImageWithAuth(item));
    } catch (error) {
      Swal.fire("Error", "Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // SECURE IMAGE FETCH
  // -------------------------------------------
  const loadImageWithAuth = async (item) => {
    if (!item.image) return;

    const fullUrl = `https://enchanting-expression-production.up.railway.app${item.image}`;
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) return;

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setPreviewMap((prev) => ({
        ...prev,
        [item.id]: url,
      }));
    } catch (error) {
      console.log("Image fetch failed:", error);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // -------------------------------------------
  // IMAGE UPLOAD
  // -------------------------------------------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, imageFile: file });
  };

  // -------------------------------------------
  // BUILD FORMDATA (JSON + FILE)
  // -------------------------------------------
  const buildFormData = () => {
    const fd = new FormData();

    const dataObj = {
      title: form.title,
      description: form.description,
      features: form.features
    };

    fd.append(
      "data",
      new Blob([JSON.stringify(dataObj)], { type: "application/json" })
    );

    if (form.imageFile) {
      fd.append("file", form.imageFile); // correct, matches backend
    }

    return fd;
  };


  // -------------------------------------------
  // SAVE OR UPDATE SERVICE
  // -------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      return Swal.fire("Error", "Title & description required", "error");
    }

    if (form.features.some((f) => !f.trim())) {
      return Swal.fire("Error", "Features cannot be empty", "error");
    }

    try {
      const config = getAuthConfig();
      const fd = buildFormData();

      if (editingId) {
        await axios.put(`${API_BASE}/update/${editingId}`, fd, config);

        Swal.fire("Updated!", "Service updated successfully", "success");

        setServiceList((prev) =>
          prev.map((s) =>
            s.id === editingId ? { ...s, ...form, image: s.image } : s
          )
        );
      } else {
        const res = await axios.post(`${API_BASE}/add-service`, fd, config);

        Swal.fire("Created!", "Service added successfully", "success");

        const newItem = res.data?.data;
        if (newItem) {
          setServiceList((prev) => [newItem, ...prev]);
          loadImageWithAuth(newItem);
        }
      }

      cancelEdit();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save service",
        "error"
      );
    }
  };

  // -------------------------------------------
  // DELETE SERVICE
  // -------------------------------------------
  const deleteService = (id) => {
    Swal.fire({
      title: "Delete?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        const config = getAuthConfig();
        await axios.delete(`${API_BASE}/delete/${id}`, config);

        Swal.fire("Deleted!", "Service removed", "success");

        setServiceList((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        Swal.fire("Error", "Failed to delete service", "error");
      }
    });
  };

  // -------------------------------------------
  // EDIT SERVICE
  // -------------------------------------------
  const startEdit = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title,
      description: item.description,
      features: item.features || [""],
      imageFile: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // -------------------------------------------
  // FEATURES HANDLING
  // -------------------------------------------
  const handleFeatureChange = (index, value) => {
    const ft = [...form.features];
    ft[index] = value;
    setForm({ ...form, features: ft });
  };

  const addFeatureField = () => {
    setForm({ ...form, features: [...form.features, ""] });
  };

  const removeFeatureField = (index) => {
    const ft = [...form.features];
    ft.splice(index, 1);
    setForm({ ...form, features: ft });
  };

  // -------------------------------------------
  // SEARCH + PAGINATION
  // -------------------------------------------
  const filtered = serviceList.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // -------------------------------------------
  // BUTTON STYLES
  // -------------------------------------------
  const glassButton =
    "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm hover:bg-white/30 hover:shadow-lg active:scale-95";
  const editBtn = `${glassButton} text-blue-700 font-semibold`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold`;

  const paginationBtn =
    "px-4 py-2 bg-white/30 border border-gray-300 rounded-lg backdrop-blur-md hover:bg-white/40 transition disabled:opacity-40";

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Services Management</h1>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded w-full max-w-md"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <span>{filtered.length} found</span>
      </div>

      {/* FORM */}
      <div className="bg-white shadow p-4 rounded mb-6 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Service" : "Add Service"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Service title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* FEATURES */}
          <div>
            <label className="block font-medium mb-1">Features</label>

            {form.features.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded"
                  placeholder={`Feature ${i + 1}`}
                  value={f}
                  onChange={(e) => handleFeatureChange(i, e.target.value)}
                />

                {form.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeatureField(i)}
                    className="px-3 bg-red-500 text-white rounded"
                  >
                    x
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addFeatureField}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              + Add Feature
            </button>
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm font-medium">Service Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="p-2 border rounded w-full bg-gray-50"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2">
            <button className="bg-green-700 text-white px-4 py-2 rounded">
              {editingId ? "Update Service" : "Add Service"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Features</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((item) => (
              <tr key={item.id} className="border">
                <td className="p-2 border font-semibold">{item.id}</td>

                <td className="p-2 border">
                  {previewMap[item.id] ? (
                    <img
                      src={previewMap[item.id]}
                      className="w-20 h-14 object-cover rounded"
                    />
                  ) : (
                    "Loading..."
                  )}
                </td>

                <td className="p-2 border">{item.title}</td>
                <td className="p-2 border text-sm">{item.description}</td>
                <td className="p-2 border">
                  <ul className="list-disc ml-4 text-sm">
                    {item.features?.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </td>

                <td className="p-2 border flex gap-2">
                  <button onClick={() => startEdit(item)} className={editBtn}>
                    Edit
                  </button>

                  <button
                    onClick={() => deleteService(item.id)}
                    className={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className={paginationBtn}
          >
            Previous
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className={paginationBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
