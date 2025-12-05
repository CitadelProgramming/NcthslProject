import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

// Convert file → base64
const toBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

// BACKEND NEWS API ENDPOINTS
const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1/news";

export default function NewsAdmin() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
    author: "",
    coverImage: null,
    galleryImages: [],
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const PER_PAGE = 5;
  const [page, setPage] = useState(1);

  // ===============================
  // LOAD ALL NEWS FROM BACKEND
  // ===============================
  const loadNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all`);
      setNewsList(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load news", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // ===============================
  // COVER IMAGE UPLOAD
  // ===============================
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setForm({ ...form, coverImage: base64 });
  };

  // ===============================
  // GALLERY UPLOAD
  // ===============================
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    const base64List = await Promise.all(files.map((f) => toBase64(f)));
    setForm({
      ...form,
      galleryImages: [...form.galleryImages, ...base64List],
    });
  };

  // ===============================
  // SUBMIT FORM (Create or Update)
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      Swal.fire("Error", "Title & Content are required", "error");
      return;
    }

    try {
      let res;

      if (editingId) {
        // UPDATE
        res = await axios.put(`${API_BASE}/update/${editingId}`, form);
        Swal.fire("Updated", "News updated successfully!", "success");
      } else {
        // CREATE
        res = await axios.post(`${API_BASE}/create`, form);
        Swal.fire("Success", "News created successfully!", "success");
      }

      loadNews();
      cancelEdit();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save news",
        "error"
      );
    }
  };

  // ===============================
  // DELETE NEWS
  // ===============================
  const deleteNews = (id) => {
    Swal.fire({
      title: "Delete?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(`${API_BASE}/delete/${id}`);
          Swal.fire("Deleted", "News removed", "success");
          loadNews();
        } catch (err) {
          Swal.fire("Error", "Failed to delete news", "error");
        }
      }
    });
  };

  // ===============================
  // EDITING
  // ===============================
  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      category: "",
      content: "",
      author: "",
      coverImage: null,
      galleryImages: [],
    });
  };

  // ===============================
  // SEARCH + PAGINATION
  // ===============================
  const filtered = newsList.filter((n) =>
    JSON.stringify(n).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">News Management</h1>

      {/* SEARCH */}
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
        <span className="text-sm">{filtered.length} found</span>
      </div>

      {/* NEWS FORM */}
      <div className="bg-white shadow p-4 rounded mb-6 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit News" : "Add News"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <select
            className="w-full p-2 border rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option>Maintenance</option>
            <option>Aviation</option>
            <option>Announcement</option>
            <option>General</option>
          </select>

          <input
            type="text"
            placeholder="Author"
            className="w-full p-2 border rounded"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <textarea
            placeholder="Content"
            className="w-full p-2 border rounded"
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />

          {/* COVER IMAGE */}
          <div>
            <label className="text-sm block mb-1">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverUpload} />
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="cover"
                className="w-32 h-32 mt-2 object-cover rounded border"
              />
            )}
          </div>

          {/* GALLERY */}
          <div>
            <label className="text-sm block mb-1">Gallery Images</label>
            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
            <div className="flex flex-wrap gap-2 mt-2">
              {form.galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-24 h-24 object-cover rounded border"
                  alt=""
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              {editingId ? "Update News" : "Add News"}
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

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {paginated.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow">
              {item.coverImage && (
                <img
                  src={item.coverImage}
                  className="w-full max-h-60 object-cover rounded mb-3"
                />
              )}

              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">
                {item.category} • {item.author}
              </p>

              <p className="mt-2">{item.content.substring(0, 250)}...</p>

              {/* GALLERY */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {item.galleryImages?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>

              <div className="flex gap-4 mt-3 text-sm">
                <button
                  className="text-blue-600"
                  onClick={() => startEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => deleteNews(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-5 flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded"
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
