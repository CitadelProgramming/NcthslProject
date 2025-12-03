import React, { useState } from "react";
import Swal from "sweetalert2";

/**
 * TestimonialsAdmin.jsx
 *
 * FEATURES:
 * - Add testimonial (name, position, message, rating, photo)
 * - Edit testimonial
 * - Delete testimonial
 * - Search testimonials by name, position or message
 * - Pagination (5 per page)
 * - Live image preview (base64)
 * - Clean modern admin UI
 *
 * Replace local state with API calls once backend is ready.
 */

export default function TestimonialsAdmin() {
  // ---------------------------------------------
  // SAMPLE TESTIMONIALS (mock data for now)
  // ---------------------------------------------
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "John David",
      position: "Aircraft Engineer",
      message:
        "NCTHSL is truly the best aviation maintenance team I have ever worked with. Their professionalism is world class.",
      rating: 5,
      image: null,
      createdAt: "2025-11-01T09:00:00",
    },
    {
      id: 2,
      name: "Sarah Williams",
      position: "Logistics Manager",
      message:
        "A very reliable and efficient technical service provider. I highly recommend them!",
      rating: 4,
      image: null,
      createdAt: "2025-11-10T13:20:00",
    },
  ]);

  // ---------------------------------------------
  // FORM STATES
  // ---------------------------------------------
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    message: "",
    rating: 5,
    image: null,
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ---------------------------------------------
  // HELPERS: Convert file → base64
  // ---------------------------------------------
  const toBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setFormData({ ...formData, image: base64 });
  };

  // ---------------------------------------------
  // CREATE / UPDATE TESTIMONIAL
  // ---------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      Swal.fire("Error", "Name and message are required", "error");
      return;
    }

    if (editingId) {
      // UPDATE EXISTING
      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      );

      Swal.fire("Success", "Testimonial updated", "success");
      setEditingId(null);
    } else {
      // CREATE NEW
      const newTestimonial = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      setTestimonials((prev) => [newTestimonial, ...prev]);

      Swal.fire("Success", "Testimonial added", "success");
    }

    // RESET FORM
    setFormData({
      name: "",
      position: "",
      message: "",
      rating: 5,
      image: null,
    });
  };

  // ---------------------------------------------
  // START EDITING
  // ---------------------------------------------
  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      position: item.position,
      message: item.message,
      rating: item.rating,
      image: item.image,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      position: "",
      message: "",
      rating: 5,
      image: null,
    });
  };

  // ---------------------------------------------
  // DELETE TESTIMONIAL
  // ---------------------------------------------
  const deleteTestimonial = (id) => {
    Swal.fire({
      title: "Delete testimonial?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((res) => {
      if (res.isConfirmed) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        Swal.fire("Deleted", "Testimonial removed", "success");
      }
    });
  };

  // ---------------------------------------------
  // SEARCH FILTERING
  // ---------------------------------------------
  const filtered = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------------------------------------
  // PAGINATION
  // ---------------------------------------------
  const PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ---------------------------------------------
  // COMPONENT RENDER
  // ---------------------------------------------
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Testimonials Manager</h1>

      {/* ----------------------------------------------------
          CREATE / EDIT FORM
      ------------------------------------------------------ */}
      <div className="bg-white p-4 rounded shadow max-w-3xl mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Testimonial" : "Add New Testimonial"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Position (Optional)"
            className="w-full p-2 border rounded"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
          />

          <textarea
            placeholder="Testimonial message"
            className="w-full p-2 border rounded"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
          />

          {/* Rating */}
          <div>
            <label className="block text-sm mb-1">Rating (1–5)</label>
            <select
              className="p-2 border rounded"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: Number(e.target.value) })
              }
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* PHOTO UPLOAD */}
          <div>
            <label className="block text-sm mb-1">Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />

            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="preview"
                  className="h-24 w-24 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              {editingId ? "Save Changes" : "Add Testimonial"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ----------------------------------------------------
          SEARCH BAR
      ------------------------------------------------------ */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          className="p-2 border rounded w-full max-w-md"
          placeholder="Search testimonials..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <span className="text-sm text-gray-500">{filtered.length} found</span>
      </div>

      {/* ----------------------------------------------------
          TESTIMONIALS LIST
      ------------------------------------------------------ */}
      <div className="space-y-4">
        {paginated.length === 0 ? (
          <p className="text-gray-500">No testimonials found.</p>
        ) : (
          paginated.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded shadow">
              <div className="flex gap-4">
                {/* PHOTO */}
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Photo</span>
                  </div>
                )}

                {/* CONTENT */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-600">{t.position}</p>
                  <p className="mt-1">{t.message}</p>

                  {/* Rating */}
                  <div className="mt-2 text-yellow-500">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-4 text-sm">
                    <button
                      className="text-blue-600"
                      onClick={() => startEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => deleteTestimonial(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ----------------------------------------------------
          PAGINATION
      ------------------------------------------------------ */}
      {totalPages > 1 && (
        <div className="mt-5 flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 rounded border ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded border ${
              page === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
