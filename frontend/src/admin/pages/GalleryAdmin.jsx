// src/admin/pages/GalleryAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "framer-motion";
import { ImagePlus, Trash2, Edit, Search } from "lucide-react";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1/gallery";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";

export default function GalleryAdmin() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const emptyForm = {
    title: "",
    category: "",
    description: "",
    galleryFile: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [previewTemp, setPreviewTemp] = useState(null);

  const PER_PAGE = 6;

  const getToken = () => localStorage.getItem("adminToken");
  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    const token = getToken();
    return token ? `${BASE_URL}${imagePath}?access_token=${token}` : PLACEHOLDER_IMAGE;
  };

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/galleries`, getAuthHeaders());
      const list = Array.isArray(res.data) ? res.data : [];
      list.sort((a, b) => b.id - a.id);
      setAlbums(list);
    } catch (err) {
      console.error("Failed to load albums:", err);
      Swal.fire("Error", "Failed to load gallery albums", "error");
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({ ...f, galleryFile: file }));

    if (previewTemp) URL.revokeObjectURL(previewTemp);
    if (file) setPreviewTemp(URL.createObjectURL(file));
    else setPreviewTemp(null);
  };

  const buildFormData = () => {
    const fd = new FormData();
    const dataObj = {
      title: form.title,
      category: form.category,
      description: form.description,
      caption: "",
    };
    fd.append("data", new Blob([JSON.stringify(dataObj)], { type: "application/json" }));
    if (form.galleryFile) fd.append("file", form.galleryFile);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !form.galleryFile) {
      return Swal.fire("Error", "Image is required when creating a new album", "error");
    }
    if (!form.title.trim() || !form.category.trim()) {
      return Swal.fire("Error", "Title and Category are required", "error");
    }

    try {
      const fd = buildFormData();
      const config = getAuthHeaders();

      if (editingId) {
        await axios.put(`${API_BASE}/update/${editingId}`, fd, config);
        Swal.fire("Updated!", "Gallery updated successfully", "success");
      } else {
        await axios.post(`${API_BASE}/add-gallery`, fd, config);
        Swal.fire("Success!", "Gallery created successfully", "success");
      }

      cancelEdit();
      await loadAlbums();
      setPage(1);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Failed to save gallery";
      Swal.fire("Error", String(msg), "error");
    }
  };

  const deleteAlbum = async (id) => {
    const result = await Swal.fire({
      title: "Delete Album?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE}/delete/${id}`, getAuthHeaders());
      Swal.fire("Deleted!", "Album removed", "success");
      await loadAlbums();
      setPage(1);
    } catch (err) {
      Swal.fire("Error", "Failed to delete album", "error");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      galleryFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    if (previewTemp) {
      URL.revokeObjectURL(previewTemp);
      setPreviewTemp(null);
    }
  };

  const filtered = albums.filter((a) =>
    JSON.stringify(a).toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const glassButton =
    "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-95";
  const editBtn = `${glassButton} text-blue-700 font-semibold flex items-center gap-2`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold flex items-center gap-2`;
  const paginationBtn = "px-4 py-2 bg-white/30 border border-gray-300 rounded-lg backdrop-blur-md hover:bg-white/40 transition disabled:opacity-40";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gallery Management</h1>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-xl shadow">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search albums..."
          className="flex-1 outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <span className="text-sm text-gray-600">{filtered.length} album(s)</span>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl mb-10 max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingId ? "Edit Album" : "Add New Album"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Album Title *"
            className="w-full p-4 border rounded-lg text-lg"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category * (e.g. Events, Facilities)"
            className="w-full p-4 border rounded-lg text-lg"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <textarea
            placeholder="Description (optional)"
            rows="4"
            className="w-full p-4 border rounded-lg text-lg"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer text-lg font-medium text-gray-700">
              <ImagePlus size={24} />
              {editingId ? "Change Image (optional)" : "Upload Image *"}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {previewTemp && (
              <img
                src={previewTemp}
                alt="Preview"
                className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg"
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {editingId ? "Update Album" : "Create Album"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading gallery...</p>
        </div>
      )}

      {/* Gallery Grid with ID */}
      {!loading && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((album) => (
              <motion.div
                key={album.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden relative"
              >
                {/* ID Badge */}
                <div className="absolute top-3 left-3 z-10 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ID: #{album.id}
                </div>

                <img
                  src={getImageUrl(album.galleryImage)}
                  alt={album.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{album.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Category:</strong> {album.category}
                  </p>
                  {album.description && (
                    <p className="text-gray-700 text-sm mt-2 line-clamp-2">{album.description}</p>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => startEdit(album)} className={editBtn}>
                      <Edit size={18} /> Edit
                    </button>
                    <button onClick={() => deleteAlbum(album.id)} className={deleteBtn}>
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={paginationBtn}
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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