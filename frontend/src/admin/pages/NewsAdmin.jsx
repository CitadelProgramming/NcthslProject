import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1/news";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2QxZDFkMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOWE5YTlhIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

export default function NewsAdmin() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const emptyForm = {
    title: "",
    preview: "",
    content: "",
    author: "",
    coverFile: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const PER_PAGE = 5;

  const getToken = () => localStorage.getItem("adminToken");

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return PLACEHOLDER_IMAGE;
    const token = getToken();
    if (!token) return PLACEHOLDER_IMAGE;
    return `${BASE_URL}${imageUrl}?access_token=${token}`;
  };

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const loadNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all-news`, getAuthConfig());
      setNewsList(res.data || []);
    } catch (err) {
      console.error("Failed to load news:", err);
      Swal.fire("Error", "Failed to load news. Please log in again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, coverFile: file });
  };

  const buildFormData = () => {
    const fd = new FormData();
    const dataObj = {
      title: form.title,
      preview: form.preview,
      content: form.content,
      author: form.author,
    };
    fd.append("data", new Blob([JSON.stringify(dataObj)], { type: "application/json" }));
    if (form.coverFile) fd.append("file", form.coverFile);
    return fd;
  };

  // CREATE OR UPDATE — WITH AUTO REFRESH
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      return Swal.fire("Error", "Title and content are required", "error");
    }

    try {
      const fd = buildFormData();
      const config = getAuthConfig();

      if (editingId) {
        await axios.put(`${API_BASE}/update/${editingId}`, fd, config);
        Swal.fire("Updated!", "News updated successfully", "success");
      } else {
        await axios.post(`${API_BASE}/create-news`, fd, config);
        Swal.fire("Success!", "News created successfully", "success");
      }

      cancelEdit();
      await loadNews();     // AUTO REFRESH FROM SERVER
      setPage(1);           // Reset to first page
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save news", "error");
    }
  };

  // DELETE — WITH AUTO REFRESH
  const deleteNews = async (id) => {
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
      Swal.fire("Deleted!", "News removed", "success");
      await loadNews();     // AUTO REFRESH
      setPage(1);           // Reset pagination
    } catch (err) {
      Swal.fire("Error", "Failed to delete news", "error");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      preview: item.preview || "",
      content: item.content,
      author: item.author || "",
      coverFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const filtered = newsList.filter((n) =>
    JSON.stringify(n).toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Styles
  const glassButton =
    "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-95";
  const editBtn = `${glassButton} text-blue-700 font-semibold`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold`;
  const paginationBtn =
    "px-4 py-2 bg-white/30 border border-gray-300 rounded-lg backdrop-blur-md hover:bg-white/40 transition disabled:opacity-40";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">News Management</h1>

      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search news..."
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
          {editingId ? "Edit News" : "Add New News"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title *"
            className="w-full p-3 border rounded-lg"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Preview (short description)"
            className="w-full p-3 border rounded-lg"
            value={form.preview}
            onChange={(e) => setForm({ ...form, preview: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author"
            className="w-full p-3 border rounded-lg"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          <textarea
            placeholder="Content *"
            rows="6"
            className="w-full p-3 border rounded-lg"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="w-full p-3 border rounded-lg bg-gray-50"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {editingId ? "Update News" : "Add News"}
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
          <p className="mt-4 text-gray-600">Loading news...</p>
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
                  <th className="p-4 text-left">Preview</th>
                  <th className="p-4 text-left">Author</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{item.id}</td>
                    <td className="p-4">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded-lg shadow border bg-gray-50"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </td>
                    <td className="p-4 font-medium">{item.title}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {item.preview || "-"}
                    </td>
                    <td className="p-4">{item.author || "Unknown"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(item)} className={editBtn}>
                          Edit
                        </button>
                        <button onClick={() => deleteNews(item.id)} className={deleteBtn}>
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
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={paginationBtn}
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-700">
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