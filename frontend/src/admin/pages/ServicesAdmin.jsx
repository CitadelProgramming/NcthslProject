// src/admin/pages/ServicesAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1/service";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2QxZDFkMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOWE5YTlhIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

export default function ServicesAdmin() {
  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const emptyForm = {
    title: "",
    description: "",
    features: [""],
    imageFile: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const PER_PAGE = 5;

  const getToken = () => localStorage.getItem("adminToken");

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    const token = getToken();
    if (!token) return PLACEHOLDER_IMAGE;
    return `${BASE_URL}${imagePath}?access_token=${token}`;
  };

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  // Load all services from server
  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all-service`, getAuthConfig());
      setServiceList(res.data || []);
    } catch (error) {
      console.error("Failed to load services:", error);
      Swal.fire("Error", "Failed to load services. Please log in again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, imageFile: file });
  };

  const buildFormData = () => {
    const fd = new FormData();
    const dataObj = {
      title: form.title,
      description: form.description,
      features: form.features.filter(f => f.trim()),
    };

    fd.append("data", new Blob([JSON.stringify(dataObj)], { type: "application/json" }));
    if (form.imageFile) fd.append("file", form.imageFile);
    return fd;
  };

  // CREATE OR UPDATE — WITH AUTO REFRESH
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      return Swal.fire("Error", "Title & description are required", "error");
    }

    if (form.features.some(f => !f.trim())) {
      return Swal.fire("Error", "Features cannot be empty", "error");
    }

    try {
      const fd = buildFormData();
      const config = getAuthConfig();

      if (editingId) {
        await axios.put(`${API_BASE}/update/${editingId}`, fd, config);
        Swal.fire("Updated!", "Service updated successfully", "success");
      } else {
        await axios.post(`${API_BASE}/add-service`, fd, config);
        Swal.fire("Created!", "Service added successfully", "success");
      }

      cancelEdit();
      await loadServices(); // AUTO REFRESH FROM SERVER
      setPage(1); // Reset to first page
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save service", "error");
    }
  };

  // DELETE — WITH AUTO REFRESH
  const deleteService = async (id) => {
    const result = await Swal.fire({
      title: "Delete?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE}/delete/${id}`, getAuthConfig());
      Swal.fire("Deleted!", "Service removed", "success");
      await loadServices(); // AUTO REFRESH
      setPage(1); // Reset to first page if needed
    } catch (error) {
      Swal.fire("Error", "Failed to delete service", "error");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      features: item.features?.length ? item.features : [""],
      imageFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm({ ...form, features: updated });
  };

  const addFeatureField = () => {
    setForm({ ...form, features: [...form.features, ""] });
  };

  const removeFeatureField = (index) => {
    if (form.features.length === 1) return;
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const filtered = serviceList.filter(s =>
    JSON.stringify(s).toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const glassButton =
    "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-95";
  const editBtn = `${glassButton} text-blue-700 font-semibold`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold`;
  const paginationBtn =
    "px-4 py-2 bg-white/30 border border-gray-300 rounded-lg backdrop-blur-md hover:bg-white/40 transition disabled:opacity-40";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Services Management</h1>

      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search services..."
          className="p-3 border rounded-lg w-full max-w-md shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <span className="text-gray-600">{filtered.length} item(s) found</span>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-xl mb-8 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {editingId ? "Edit Service" : "Add New Service"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Service Title *"
            className="w-full p-3 border rounded-lg"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Description *"
            rows="4"
            className="w-full p-3 border rounded-lg"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            {form.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1 p-3 border rounded-lg"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                />
                {form.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeatureField(index)}
                    className="px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeatureField}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Add Feature
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Service Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 border rounded-lg bg-gray-50"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {editingId ? "Update Service" : "Add Service"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      )}

      {!loading && (
        <>
          <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Features</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{item.id}</td>
                    <td className="p-4">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded-lg shadow border bg-gray-50"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </td>
                    <td className="p-4 font-medium">{item.title}</td>
                    <td className="p-4 text-gray-700 max-w-xs truncate">
                      {item.description || "-"}
                    </td>
                    <td className="p-4">
                      <ul className="text-sm space-y-1">
                        {item.features?.map((f, i) => (
                          <li key={i} className="text-gray-600">• {f}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(item)} className={editBtn}>
                          Edit
                        </button>
                        <button onClick={() => deleteService(item.id)} className={deleteBtn}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={paginationBtn}
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={paginationBtn}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}