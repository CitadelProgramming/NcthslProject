// src/admin/pages/TestimonialsAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1/testimonials";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2QxZDFkMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOWE5YTlhIj5ObyBQaG90bzwvdGV4dD48L3N2Zz4=";

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const emptyForm = {
    name: "",
    role: "",
    message: "",
    photoFile: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const PER_PAGE = 5;

  const getToken = () => localStorage.getItem("adminToken");

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  // Secure image URL with access_token
  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    const token = getToken();
    if (!token) return PLACEHOLDER_IMAGE;
    return `${BASE_URL}${imagePath}?access_token=${token}`;
  };

  // Load all testimonials
  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all-testimonials`, getAuthHeaders());
      setTestimonials(res.data || []);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      Swal.fire("Error", "Failed to load testimonials. Please log in again.", "error");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({ ...f, photoFile: file }));
  };

  const buildFormData = () => {
    const fd = new FormData();
    const dataObj = {
      name: form.name,
      role: form.role,
      message: form.message,
    };
    fd.append("data", new Blob([JSON.stringify(dataObj)], { type: "application/json" }));
    if (form.photoFile) fd.append("file", form.photoFile);
    return fd;
  };

  // CREATE / UPDATE with AUTO REFRESH
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.role.trim() || !form.message.trim()) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    try {
      const fd = buildFormData();
      const config = getAuthHeaders();

      if (editingId) {
        await axios.put(`${API_BASE}/update/${editingId}`, fd, config);
        Swal.fire("Updated!", "Testimonial updated successfully", "success");
      } else {
        await axios.post(`${API_BASE}/create-testimonials`, fd, config);
        Swal.fire("Success!", "Testimonial created successfully", "success");
      }

      cancelEdit();
      await loadTestimonials(); // AUTO REFRESH
      setPage(1);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save testimonial";
      Swal.fire("Error", msg, "error");
    }
  };

  // DELETE with AUTO REFRESH
  const deleteTestimonial = async (id) => {
    const result = await Swal.fire({
      title: "Delete Testimonial?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE}/delete/${id}`, getAuthHeaders());
      Swal.fire("Deleted!", "Testimonial removed", "success");
      await loadTestimonials(); // AUTO REFRESH
      setPage(1);
    } catch (err) {
      Swal.fire("Error", "Failed to delete testimonial", "error");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      role: item.role || "",
      message: item.message || "",
      photoFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // Search & Pagination
  const filtered = testimonials.filter((t) =>
    JSON.stringify(t).toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Glass buttons
  const glassButton =
    "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-95";
  const editBtn = `${glassButton} text-blue-700 font-semibold`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Testimonials Management</h1>

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search testimonials..."
          className="w-full max-w-lg p-4 border rounded-lg shadow-sm text-lg"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Form */}
      <div className="bg-white shadow-xl p-8 rounded-2xl mb-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          {editingId ? "Edit Testimonial" : "Add New Testimonial"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Full Name *"
              className="w-full p-4 border rounded-lg text-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Position / Role *"
              className="w-full p-4 border rounded-lg text-lg"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            />
            <textarea
              placeholder="Testimonial Message *"
              rows="8"
              className="w-full p-4 border rounded-lg text-lg"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-3 text-gray-700">Photo (optional on update)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full p-3 border rounded-lg bg-gray-50 text-lg"
              />
            </div>

            <div className="flex gap-4 mt-10">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
              >
                {editingId ? "Update Testimonial" : "Add Testimonial"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-600">Loading testimonials...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <>
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="py-5 px-6 text-left font-semibold">ID</th>
                  <th className="py-5 px-6 text-left">Photo</th>
                  <th className="py-5 px-6 text-left">Name</th>
                  <th className="py-5 px-6 text-left">Role</th>
                  <th className="py-5 px-6 text-left">Message</th>
                  <th className="py-5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-5 px-6 font-mono text-sm text-gray-700">#{t.id}</td>
                    <td className="py-5 px-6">
                      <img
                        src={getImageUrl(t.image)}
                        alt={t.name}
                        className="w-20 h-20 object-cover rounded-full shadow-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </td>
                    <td className="py-5 px-6 font-semibold text-gray-800">{t.name}</td>
                    <td className="py-5 px-6 text-gray-600">{t.role}</td>
                    <td className="py-5 px-6 text-gray-700 italic max-w-md">
                      "{t.message}"
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => startEdit(t)} className={editBtn}>
                          Edit
                        </button>
                        <button onClick={() => deleteTestimonial(t.id)} className={deleteBtn}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-8 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg font-medium"
              >
                Previous
              </button>
              <span className="text-xl font-bold text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-8 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg font-medium"
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