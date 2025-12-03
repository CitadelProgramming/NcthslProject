import React, { useState } from "react";
import Swal from "sweetalert2";

// Helper (file → base64)
const toBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

export default function NewsAdmin() {
  // ---------------------------------------------
  // SAMPLE NEWS DATA
  // ---------------------------------------------
  const [newsList, setNewsList] = useState([
    {
      id: 1,
      title: "NCTHSL Launches New Maintenance Program",
      category: "Maintenance",
      content:
        "Nigeria Customs Technical Hangar Services Limited has introduced a new aircraft maintenance upgrade...",
      coverImage: null,
      galleryImages: [],
      author: "Admin",
      date: "2025-11-01",
    },
    {
      id: 2,
      title: "FBO Operations Improved for Faster Turnaround",
      category: "FBO",
      content:
        "Our Fixed Based Operations have been optimized to provide better fueling, lounge experience...",
      coverImage: null,
      galleryImages: [],
      author: "Admin",
      date: "2025-11-05",
    },
  ]);

  // ---------------------------------------------
  // FORM STATES
  // ---------------------------------------------
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

  // ---------------------------------------------
  // HANDLE COVER IMAGE UPLOAD
  // ---------------------------------------------
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setForm({ ...form, coverImage: base64 });
  };

  // ---------------------------------------------
  // HANDLE MULTIPLE GALLERY IMAGES
  // ---------------------------------------------
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    const base64List = await Promise.all(files.map((f) => toBase64(f)));
    setForm({
      ...form,
      galleryImages: [...form.galleryImages, ...base64List],
    });
  };

  // ---------------------------------------------
  // SUBMIT FORM (Create or Update)
  // ---------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      Swal.fire("Error", "Title and content are required.", "error");
      return;
    }

    if (editingId) {
      // UPDATE NEWS
      setNewsList((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );

      Swal.fire("Updated", "News article updated successfully!", "success");
      setEditingId(null);
    } else {
      // CREATE NEWS
      const newArticle = {
        ...form,
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
      };

      setNewsList([newArticle, ...newsList]);
      Swal.fire("Success", "News article added successfully!", "success");
    }

    // RESET FORM
    setForm({
      title: "",
      category: "",
      content: "",
      author: "",
      coverImage: null,
      galleryImages: [],
    });
  };

  // ---------------------------------------------
  // EDIT NEWS
  // ---------------------------------------------
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

  // ---------------------------------------------
  // DELETE NEWS
  // ---------------------------------------------
  const deleteNews = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This news article will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((res) => {
      if (res.isConfirmed) {
        setNewsList((prev) => prev.filter((n) => n.id !== id));
        Swal.fire("Deleted", "News article removed.", "success");
      }
    });
  };

  // ---------------------------------------------
  // SEARCH
  // ---------------------------------------------
  const filtered = newsList.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------------------------------------
  // PAGINATION
  // ---------------------------------------------
  const PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">News & Updates Management</h1>

      {/* SEARCH BAR */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search news..."
          className="p-2 border rounded w-full max-w-md"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <span className="text-sm text-gray-500">{filtered.length} found</span>
      </div>

      {/* NEWS FORM */}
      <div className="bg-white shadow p-4 rounded mb-6 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit News Article" : "Add News Article"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <input
            type="text"
            placeholder="News Title"
            className="w-full p-2 border rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          {/* CATEGORY */}
          <select
            className="w-full p-2 border rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option>Maintenance</option>
            <option>FBO</option>
            <option>Aviation</option>
            <option>Announcement</option>
            <option>General</option>
          </select>

          {/* AUTHOR */}
          <input
            type="text"
            placeholder="Author (optional)"
            className="w-full p-2 border rounded"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          {/* CONTENT */}
          <textarea
            placeholder="News Content"
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
                alt="cover preview"
                className="w-32 h-32 mt-2 object-cover rounded border"
              />
            )}
          </div>

          {/* GALLERY IMAGES */}
          <div>
            <label className="text-sm block mb-1">Gallery Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {form.galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="gallery"
                  className="w-24 h-24 object-cover rounded border"
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
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* NEWS LIST */}
      <div className="space-y-4">
        {paginated.map((item) => (
          <div key={item.id} className="bg-white p-4 shadow rounded">
            {/* COVER IMAGE */}
            {item.coverImage && (
              <img
                src={item.coverImage}
                alt="cover"
                className="w-full max-h-60 object-cover rounded mb-3"
              />
            )}

            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-sm text-gray-500">
              {item.category} • {item.date} • {item.author || "Admin"}
            </p>

            <p className="mt-2">{item.content.substring(0, 200)}...</p>

            {/* GALLERY */}
            {item.galleryImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.galleryImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="gallery"
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}

            {/* ACTIONS */}
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

      {/* PAGINATION CONTROLS */}
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
