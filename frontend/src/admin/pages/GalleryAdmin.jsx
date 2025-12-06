// src/admin/pages/GalleryAdmin.jsx
import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "framer-motion";
import { ImagePlus, Trash2, Edit, Search } from "lucide-react";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1/gallery";
const HOST = "https://enchanting-expression-production.up.railway.app";

export default function GalleryAdmin() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    title: "",
    category: "",
    description: "",
    galleryFile: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewMap, setPreviewMap] = useState({}); // id -> objectURL (server blobs)
  const objectUrlsRef = useRef({}); // keep track for cleanup of server blobs

  // temp preview for newly selected local file
  const [previewTemp, setPreviewTemp] = useState(null);
  const previewTempRef = useRef(null);

  const PER_PAGE = 6;
  const [page, setPage] = useState(1);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // -------------------
  // Load albums + secure images
  // -------------------
  const loadAlbums = async () => {
    try {
      setLoading(true);
      const config = { headers: getAuthHeaders() };
      const res = await axios.get(`${API_BASE}/galleries`, config);
      const list = Array.isArray(res.data) ? res.data : [];

      // sort latest first
      list.sort((a, b) => b.id - a.id);
      setAlbums(list);

      // kick off loading each image as blob (authenticated)
      list.forEach((item) => loadImageWithAuth(item));
    } catch (err) {
      console.error("Failed to load albums:", err);
      Swal.fire("Error", "Failed to load albums", "error");
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  const loadImageWithAuth = async (item) => {
    if (!item?.galleryImage) return;

    try {
      const fullUrl = `${HOST}${item.galleryImage}`;
      const response = await fetch(fullUrl, {
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        console.warn("Image fetch failed", fullUrl, response.status);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // store url in state and ref for cleanup
      setPreviewMap((prev) => ({ ...prev, [item.id]: url }));
      objectUrlsRef.current[item.id] = url;
    } catch (error) {
      console.error("Secure image load failed:", error);
    }
  };

  useEffect(() => {
    loadAlbums();

    // cleanup on unmount: revoke objectURLs
    return () => {
      Object.values(objectUrlsRef.current || {}).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
      objectUrlsRef.current = {};

      if (previewTempRef.current) {
        try {
          URL.revokeObjectURL(previewTempRef.current);
        } catch (e) {}
        previewTempRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------
  // Form helpers
  // -------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({ ...f, galleryFile: file }));

    // revoke previous local preview if any and not a server-blob
    if (previewTempRef.current && !Object.values(objectUrlsRef.current).includes(previewTempRef.current)) {
      try {
        URL.revokeObjectURL(previewTempRef.current);
      } catch (e) {}
    }

    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewTemp(localUrl);
      previewTempRef.current = localUrl;
    } else {
      setPreviewTemp(null);
      previewTempRef.current = null;
    }
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

    // IMPORTANT: backend expects RequestPart("file") for create. Name must be "file".
    if (form.galleryFile) fd.append("file", form.galleryFile);
    return fd;
  };

  // -------------------
  // Submit (Create / Update)
  // -------------------
  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    // Option A: image required for CREATE, optional for UPDATE
    if (!editingId && !form.galleryFile) {
      return Swal.fire("Error", "Please choose an image for the gallery (required on create).", "error");
    }

    if (!form.title?.trim() || !form.category?.trim()) {
      return Swal.fire("Error", "Title and Category are required", "error");
    }

    try {
      const fd = buildFormData();
      const headers = getAuthHeaders(); // don't set Content-Type, let axios/browser set boundary
      const config = { headers };

      const url = editingId ? `${API_BASE}/update/${editingId}` : `${API_BASE}/add-gallery`;
      const method = editingId ? "put" : "post";

      await axios[method](url, fd, config);

      Swal.fire("Success", editingId ? "Gallery updated" : "Gallery created", "success");

      // refresh list and images
      await loadAlbums();
      cancelEdit();
    } catch (err) {
      console.error("Submit error:", err);

      // extract readable message: backend might return string or object
      const resp = err?.response?.data;
      let message = "Failed to save gallery";
      if (typeof resp === "string") message = resp;
      else if (resp?.message) message = resp.message;
      else if (resp && typeof resp === "object") message = JSON.stringify(resp);

      Swal.fire("Error", message, "error");
    }
  };

  // -------------------
  // Edit / Cancel / Delete
  // -------------------
  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      galleryFile: null,
    });

    // if server blob preview already available use it; otherwise try to load it
    if (previewMap[item.id]) {
      setPreviewTemp(previewMap[item.id]);
      previewTempRef.current = previewMap[item.id];
    } else if (item.galleryImage) {
      loadImageWithAuth(item);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);

    // revoke local preview if it was a new local object URL (not a server blob)
    if (previewTempRef.current && !Object.values(objectUrlsRef.current).includes(previewTempRef.current)) {
      try {
        URL.revokeObjectURL(previewTempRef.current);
      } catch (e) {}
    }
    previewTempRef.current = null;
    setPreviewTemp(null);
  };

  const deleteAlbum = (id) => {
    Swal.fire({
      title: "Delete?",
      text: "This album will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const config = { headers: getAuthHeaders() };
        await axios.delete(`${API_BASE}/delete/${id}`, config);
        Swal.fire("Deleted!", "Album removed", "success");
        // Optimistically remove from UI and revoke object URL
        setAlbums((prev) => prev.filter((a) => a.id !== id));
        if (objectUrlsRef.current[id]) {
          try {
            URL.revokeObjectURL(objectUrlsRef.current[id]);
          } catch (e) {}
          delete objectUrlsRef.current[id];
          setPreviewMap((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
          });
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Failed to delete album", "error");
      }
    });
  };

  // -------------------
  // Pagination / helpers
  // -------------------
  const filtered = albums.filter((a) => JSON.stringify(a).toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const getDisplayPreview = (albumId) => {
    // prefer a newly selected local preview (previewTemp when editing), otherwise server blob
    if (previewTemp && editingId === albumId) return previewTemp;
    return previewMap[albumId] || null;
  };

  // styles
  const glassButton =
    "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-95";
  const editBtn = `${glassButton} text-blue-700 font-semibold`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold`;
  const paginationBtn = "px-4 py-2 bg-white/30 border border-gray-300 rounded-lg backdrop-blur-md hover:bg-white/40 transition disabled:opacity-40";

  // -------------------
  // Render
  // -------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gallery Admin</h1>

      {/* Search */}
      <div className="mb-6 flex items-center gap-2 bg-gray-100 p-3 rounded-xl">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search galleries..."
          className="w-full bg-transparent outline-none"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <div className="text-sm text-gray-600">{filtered.length} found</div>
      </div>

      {/* Form */}
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-xl shadow mb-8 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Gallery" : "Add Gallery"}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" className="w-full p-3 border rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <input type="text" className="w-full p-3 border rounded" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />

          <textarea className="w-full p-3 border rounded" rows="4" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
              <ImagePlus /> Upload Image {editingId ? "(optional)" : "(required)"}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {/* local preview (new file) or server preview when editing */}
            {previewTemp ? (
              <img src={previewTemp} alt="preview" className="h-40 rounded mb-2 object-cover" />
            ) : editingId && previewMap[editingId] ? (
              <img src={previewMap[editingId]} alt="preview" className="h-40 rounded mb-2 object-cover" />
            ) : null}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editingId ? "Update Gallery" : "Add Gallery"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* List */}
      <div className="grid md:grid-cols-3 gap-6">
        {paginated.map((album) => (
          <motion.div key={album.id} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow p-4">
            {getDisplayPreview(album.id) ? (
              <img src={getDisplayPreview(album.id)} alt={album.title} className="h-48 w-full object-cover rounded mb-3" />
            ) : (
              <div className="h-48 w-full bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">No preview</div>
            )}

            <h2 className="font-bold text-lg">{album.title}</h2>
            <p className="text-sm text-gray-600">{album.category}</p>
            <p className="text-sm text-gray-600 mb-3">{album.description}</p>

            <div className="flex gap-3">
              <button onClick={() => startEdit(album)} className={editBtn}>
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => deleteAlbum(album.id)} className={deleteBtn}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={paginationBtn}>
            Previous
          </button>
          <div className="px-4 py-2 rounded bg-white/10 border">{page} / {totalPages}</div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={paginationBtn}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
