import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE =
  "https://enchanting-expression-production.up.railway.app/api/v1/news";

export default function NewsAdmin() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    title: "",
    preview: "",
    content: "",
    author: "",
    coverFile: null,
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

  // LOAD NEWS
  const loadNews = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const res = await axios.get(`${API_BASE}/all-news`, config);

      const list = res.data || [];
      setNewsList(list);

      list.forEach((item) => loadImageWithAuth(item));
    } catch (err) {
      Swal.fire("Error", "Failed to load news", "error");
    } finally {
      setLoading(false);
    }
  };

  // SECURE IMAGE
  const loadImageWithAuth = async (item) => {
    if (!item.imageUrl) return;

    try {
      const token = localStorage.getItem("adminToken");
      const fullUrl = `https://enchanting-expression-production.up.railway.app${item.imageUrl}`;

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

  useEffect(() => {
    loadNews();
  }, []);

  // -----------------------------
  // FORM HANDLERS
  // -----------------------------
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

    fd.append(
      "data",
      new Blob([JSON.stringify(dataObj)], { type: "application/json" })
    );

    if (form.coverFile) {
      fd.append("file", form.coverFile);
    }

    return fd;
  };

  // SAVE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      return Swal.fire("Error", "Title and content are required", "error");
    }

    try {
      const config = getAuthConfig();
      const fd = buildFormData();

      if (editingId) {
        await axios.put(`${API_BASE}/update/${editingId}`, fd, config);

        Swal.fire("Updated!", "News updated successfully", "success");

        setNewsList((prev) =>
          prev.map((n) =>
            n.id === editingId ? { ...n, ...form, imageUrl: n.imageUrl } : n
          )
        );
      } else {
        const res = await axios.post(`${API_BASE}/create-news`, fd, config);

        Swal.fire("Success!", "News created successfully", "success");

        const newItem = res.data?.data;

        if (newItem) {
          setNewsList((prev) => [newItem, ...prev]);
          loadImageWithAuth(newItem);
        }
      }

      cancelEdit();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save news",
        "error"
      );
    }
  };

  // DELETE
  const deleteNews = (id) => {
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

        Swal.fire("Deleted!", "News removed", "success");

        setNewsList((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
        Swal.fire("Error", "Failed to delete news", "error");
      }
    });
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

  // SEARCH + PAGINATION
  const filtered = newsList.filter((n) =>
    JSON.stringify(n).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // -------------------------------------------------------
  // PREMIUM GLASS BUTTON STYLE
  // -------------------------------------------------------
  const glassButton =
    "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-95";

  const editBtn = `${glassButton} text-blue-700 font-semibold`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold`;

  const paginationBtn =
    "px-4 py-2 bg-white/30 border border-gray-300 rounded-lg backdrop-blur-md hover:bg-white/40 transition disabled:opacity-40";

  // -------------------------------------------------------

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">News Management</h1>

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

      {/* Form */}
      <div className="bg-white shadow p-4 rounded mb-6 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit News" : "Add News"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Preview"
            value={form.preview}
            onChange={(e) => setForm({ ...form, preview: e.target.value })}
          />

          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <textarea
            className="w-full p-2 border rounded"
            rows="5"
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Cover Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="p-2 border rounded bg-gray-50"
            />
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Author</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((item) => (
              <tr key={item.id} className="border">
                <td className="p-2 border font-semibold text-gray-700">
                  {item.id}
                </td>

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
                <td className="p-2 border">{item.preview}</td>
                <td className="p-2 border">{item.author}</td>

                <td className="p-2 border flex gap-2">
                  <button onClick={() => startEdit(item)} className={editBtn}>
                    Edit
                  </button>

                  <button
                    onClick={() => deleteNews(item.id)}
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

      {/* Pagination */}
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
