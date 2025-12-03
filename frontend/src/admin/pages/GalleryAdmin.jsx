// src/admin/pages/GalleryAdmin.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";

/**
 * GalleryAdmin (Albums system)
 *
 * Features:
 * - Create albums (title + description)
 * - Add multiple images to an album (local upload, base64 preview)
 * - Edit album metadata
 * - Remove individual images from an album
 * - Delete whole album
 * - Search albums
 * - Scrollable album list
 *
 * Frontend-only (hard-coded data / local state). Replace state operations
 * with API calls when your backend is ready.
 */

export default function GalleryAdmin() {
  // initial sample albums
  const [albums, setAlbums] = useState([
    {
      id: 1,
      title: "Facility & Hangar",
      description: "Photos of the hangar, workshop and facility spaces.",
      images: [], // base64 strings
      createdAt: "2025-11-01T10:00:00",
    },
    {
      id: 2,
      title: "Events & Training",
      description: "Snapshots from training sessions and corporate events.",
      images: [],
      createdAt: "2025-11-10T12:30:00",
    },
  ]);

  // form states
  const [newAlbum, setNewAlbum] = useState({ title: "", description: "", images: [] });
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editAlbumData, setEditAlbumData] = useState({ title: "", description: "", images: [] });
  const [searchTerm, setSearchTerm] = useState("");

  // helpers: convert files -> base64
  const filesToBase64 = (fileList) => {
    const files = Array.from(fileList || []);
    const readers = files.map(
      (file) =>
        new Promise((res) => {
          const r = new FileReader();
          r.onloadend = () => res(r.result);
          r.readAsDataURL(file);
        })
    );
    return Promise.all(readers);
  };

  // add images to album form (new or editing)
  const handleAlbumImagesUpload = async (e, isEditing = false) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const results = await filesToBase64(fileList);

    if (isEditing) {
      setEditAlbumData((prev) => ({ ...prev, images: [...(prev.images || []), ...results] }));
    } else {
      setNewAlbum((prev) => ({ ...prev, images: [...(prev.images || []), ...results] }));
    }
  };

  // create or update album
  const handleSaveAlbum = (e) => {
    e.preventDefault();

    if (!editingAlbumId) {
      // create
      if (!newAlbum.title.trim()) {
        Swal.fire("Error", "Album title is required", "error");
        return;
      }

      const album = {
        ...newAlbum,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setAlbums((prev) => [album, ...prev]);
      setNewAlbum({ title: "", description: "", images: [] });
      Swal.fire("Success", "Album created", "success");
    } else {
      // update existing album
      if (!editAlbumData.title.trim()) {
        Swal.fire("Error", "Album title is required", "error");
        return;
      }

      setAlbums((prev) =>
        prev.map((a) => (a.id === editingAlbumId ? { ...a, ...editAlbumData } : a))
      );
      setEditingAlbumId(null);
      setEditAlbumData({ title: "", description: "", images: [] });
      Swal.fire("Success", "Album updated", "success");
    }
  };

  // start editing album
  const startEdit = (album) => {
    setEditingAlbumId(album.id);
    setEditAlbumData({ title: album.title, description: album.description, images: [...(album.images || [])] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // cancel editing
  const cancelEdit = () => {
    setEditingAlbumId(null);
    setEditAlbumData({ title: "", description: "", images: [] });
  };

  // remove image from new/edit form
  const removeFormImage = (index, isEditing = false) => {
    if (isEditing) {
      const images = [...(editAlbumData.images || [])];
      images.splice(index, 1);
      setEditAlbumData({ ...editAlbumData, images });
    } else {
      const images = [...(newAlbum.images || [])];
      images.splice(index, 1);
      setNewAlbum({ ...newAlbum, images });
    }
  };

  // remove image from saved album
  const removeAlbumImage = (albumId, imageIndex) => {
    setAlbums((prev) =>
      prev.map((a) => {
        if (a.id !== albumId) return a;
        const images = [...(a.images || [])];
        images.splice(imageIndex, 1);
        return { ...a, images };
      })
    );
    Swal.fire("Removed", "Image removed from album", "success");
  };

  // delete whole album
  const deleteAlbum = (id) => {
    Swal.fire({
      title: "Delete album?",
      text: "This will remove the album and all its images. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setAlbums((prev) => prev.filter((a) => a.id !== id));
        Swal.fire("Deleted", "Album removed", "success");
      }
    });
  };

  // search + filtered
  const filteredAlbums = albums.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gallery — Albums Manager</h1>

      {/* Create / Edit Form */}
      <div className="mb-6 bg-white p-4 shadow rounded max-w-3xl">
        <h2 className="text-lg font-semibold mb-3">{editingAlbumId ? "Edit Album" : "Create Album"}</h2>

        <form onSubmit={handleSaveAlbum} className="space-y-3">
          <input
            type="text"
            placeholder="Album title"
            className="w-full p-2 border rounded"
            value={editingAlbumId ? editAlbumData.title : newAlbum.title}
            onChange={(e) =>
              editingAlbumId
                ? setEditAlbumData({ ...editAlbumData, title: e.target.value })
                : setNewAlbum({ ...newAlbum, title: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Short description (optional)"
            className="w-full p-2 border rounded"
            rows={3}
            value={editingAlbumId ? editAlbumData.description : newAlbum.description}
            onChange={(e) =>
              editingAlbumId
                ? setEditAlbumData({ ...editAlbumData, description: e.target.value })
                : setNewAlbum({ ...newAlbum, description: e.target.value })
            }
          />

          <div>
            <label className="block text-sm mb-1">Add images (you can select multiple)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleAlbumImagesUpload(e, !!editingAlbumId)}
              className="w-full"
            />
          </div>

          {/* preview thumbnails for form */}
          <div className="flex flex-wrap gap-2 mt-2">
            {(editingAlbumId ? editAlbumData.images : newAlbum.images).map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt={`preview-${i}`} className="w-28 h-20 object-cover rounded border" />
                <button
                  type="button"
                  onClick={() => removeFormImage(i, !!editingAlbumId)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editingAlbumId ? "Save Changes" : "Create Album"}
            </button>

            {editingAlbumId ? (
              <button type="button" onClick={cancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setNewAlbum({ title: "", description: "", images: [] })}
                className="bg-gray-100 px-4 py-2 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search albums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded max-w-lg w-full"
        />
        <div className="text-sm text-gray-500">{filteredAlbums.length} albums</div>
      </div>

      {/* Albums list */}
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
        {filteredAlbums.length === 0 ? (
          <p className="text-gray-600">No albums found. Create one above.</p>
        ) : (
          filteredAlbums.map((album) => (
            <div key={album.id} className="bg-white p-4 shadow rounded">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{album.title}</h3>
                      <p className="text-sm text-gray-600">{album.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Created: {new Date(album.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(album)}
                        className="text-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAlbum(album.id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* images preview with remove buttons */}
                  {album.images && album.images.length > 0 ? (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {album.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} alt={`album-${album.id}-img-${idx}`} className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeAlbumImage(album.id, idx)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-gray-500">No images in this album yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
