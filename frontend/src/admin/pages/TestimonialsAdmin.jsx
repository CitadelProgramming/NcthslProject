// src/admin/pages/TestimonialsAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1/testimonials";

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    name: "",
    role: "",
    message: "",
    photoFile: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [previewMap, setPreviewMap] = useState({});

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

  // Exactly like NewsAdmin.jsx
  const loadImageWithAuth = async (item) => {
    if (!item.image) return;

    try {
      const token = localStorage.getItem("adminToken");
      const fullUrl = `https://enchanting-expression-production.up.railway.app${item.image}`;

      const response = await fetch(fullUrl, {
        headers: { Authorization: `Bearer ${token}` },
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
      console.error("Secure image load failed:", error);
    }
  };

  // Load all testimonials
  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const res = await axios.get(`${API_BASE}/all-testimonials`, config);

      const list = res.data || [];
      setTestimonials(list);

      // Load images for each testimonial
      list.forEach((item) => loadImageWithAuth(item));
    } catch (err) {
      Swal.fire("Error", "Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, photoFile: file });
  };

  const buildFormData = () => {
    const fd = new FormData();

    const dataObj = {
      name: form.name,
      role: form.role,
      message: form.message,
    };

    fd.append("data", new Blob([JSON.stringify(dataObj)], { type: "application/json" }));

    if (form.photoFile) {
      fd.append("file", form.photoFile);
    }

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.role.trim() || !form.message.trim()) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    try {
      const config = getAuthConfig();
      const fd = buildFormData();

      if (editingId) {
        await axios.put(`${API_BASE}/update/${editingId}`, fd, config);
        Swal.fire("Updated!", "Testimonial updated", "success");

        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === editingId ? { ...t, ...form, image: t.image } : t
          )
        );
      } else {
        const res = await axios.post(`${API_BASE}/create-testimonials`, fd, config);
        Swal.fire("Success!", "Testimonial created", "success");

        const newItem = res.data?.data || res.data;
        if (newItem) {
          setTestimonials((prev) => [newItem, ...prev]);
          loadImageWithAuth(newItem);
        }
      }

      cancelEdit();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save", "error");
    }
  };

  const deleteTestimonial = (id) => {
    Swal.fire({
      title: "Delete testimonial?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        const config = getAuthConfig();
        await axios.delete(`${API_BASE}/delete/${id}`, config);

        Swal.fire("Deleted!", "Testimonial removed", "success");
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
      }
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      message: item.message,
      photoFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // Search + Pagination
  const filtered = testimonials.filter((t) =>
    JSON.stringify(t).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Glass buttons - same as NewsAdmin
  const glassButton =
    "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-95";
  const editBtn = `${glassButton} text-blue-700 font-semibold`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold`;

  if (loading) return <div className="p-8 text-center text-xl">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-center">Testimonials Management</h1>

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search testimonials..."
          className="w-full max-w-lg p-3 border rounded-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingId ? "Edit Testimonial" : "Add New Testimonial"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 border rounded-lg text-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Position / Role"
              className="w-full p-4 border rounded-lg text-lg"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            />
            <textarea
              placeholder="Testimonial message"
              rows={6}
              className="w-full p-4 border rounded-lg text-lg"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-lg font-medium mb-3">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="block w-full text-lg"
              />
            </div>

            <div className="flex gap-4 mt-8">
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left">ID</th>
              <th className="py-4 px-6 text-left">Photo</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Role</th>
              <th className="py-4 px-6 text-left">Message</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-medium">{t.id}</td>
                <td className="py-4 px-6">
                  {previewMap[t.id] ? (
                    <img
                      src={previewMap[t.id]}
                      alt={t.name}
                      className="w-20 h-20 object-cover rounded-lg shadow"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                      Loading...
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 font-semibold">{t.name}</td>
                <td className="py-4 px-6 text-gray-600">{t.role}</td>
                <td className="py-4 px-6 italic text-gray-700 max-w-md truncate">
                  {t.message}
                </td>
                <td className="py-4 px-6 text-center">
                  <button onClick={() => startEdit(t)} className={editBtn}>
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTestimonial(t.id)}
                    className={deleteBtn}
                    style={{ marginLeft: "12px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}