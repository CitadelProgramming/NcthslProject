// src/pages/Gallery.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const PUBLIC_API = "https://enchanting-expression-production.up.railway.app/api/v1/gallery/galleries";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyNTZweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjRweCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

export default function Gallery() {
  const [selectedAlbum, setSelectedAlbum] = useState("all");
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Only one source of truth

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER;
    return `${BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        const res = await axios.get(PUBLIC_API);

        const list = Array.isArray(res.data) ? res.data : [];

        const processed = list.map((item) => ({
          ...item,
          imageSrc: item.galleryImage ? getImageUrl(item.galleryImage) : PLACEHOLDER,
          category: item.category || "Uncategorized",
          caption: item.caption || item.description || item.title || "Gallery Image",
        }));

        setAlbums(processed);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  // Group by category
  const grouped = {};
  albums.forEach((g) => {
    const cat = g.category;
    if (!grouped[cat]) {
      grouped[cat] = { id: cat, title: cat, images: [] };
    }
    grouped[cat].images.push({
      src: g.imageSrc,
      caption: g.caption,
    });
  });

  const formattedAlbums = Object.values(grouped);

  const galleryImages =
    selectedAlbum === "all"
      ? formattedAlbums.flatMap((a) => a.images)
      : formattedAlbums.find((a) => a.id === selectedAlbum)?.images || [];

  // All images for navigation
  const flatImages = formattedAlbums.flatMap((a) => a.images);

  const currentIndex = selectedImage
    ? flatImages.findIndex((img) => img.src === selectedImage.src)
    : -1;

  const goPrevImage = () => {
    if (flatImages.length === 0) return;
    const prevIndex = currentIndex <= 0 ? flatImages.length - 1 : currentIndex - 1;
    setSelectedImage(flatImages[prevIndex]);
  };

  const goNextImage = () => {
    if (flatImages.length === 0) return;
    const nextIndex = currentIndex >= flatImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(flatImages[nextIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowLeft") goPrevImage();
      if (e.key === "ArrowRight") goNextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedImage, currentIndex]);

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-center mb-16 tracking-tight"
        >
          Gallery
        </motion.h2>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
            <p className="mt-4 text-xl">Loading beautiful moments...</p>
          </div>
        )}

        {/* Filters */}
        {!loading && (
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button
              onClick={() => setSelectedAlbum("all")}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selectedAlbum === "all"
                  ? "bg-red-600 text-black shadow-lg"
                  : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
              }`}
            >
              All Galleries
            </button>
            {formattedAlbums.map((album) => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album.id)}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  selectedAlbum === album.id
                    ? "bg-red-600 text-black shadow-lg"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                }`}
              >
                {album.title}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {galleryImages.map((img, idx) => (
            <motion.div
              key={img.src + idx} // Unique key
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
              onClick={() => setSelectedImage(img)} // Always pass full object
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => (e.target.src = PLACEHOLDER)}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <p className="text-white text-sm font-medium line-clamp-2">
                  {img.caption}
                </p>
                <span className="mt-2 inline-block px-4 py-1 bg-red-600 text-black text-xs font-bold rounded-full">
                  Click to View
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold shadow-lg z-10 transition"
              >
                X Close
              </button>

              <motion.img
                key={selectedImage.src}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                onError={(e) => (e.target.src = PLACEHOLDER)}
              />

              <p className="text-center text-white text-lg mt-6 font-medium">
                {selectedImage.caption}
              </p>

              {/* Navigation Arrows */}
              {flatImages.length > 1 && (
                <>
                  <button
                    onClick={goPrevImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-4 rounded-full text-4xl transition"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    onClick={goNextImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-4 rounded-full text-4xl transition"
                    aria-label="Next image"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}