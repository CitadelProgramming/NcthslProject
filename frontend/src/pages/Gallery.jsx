// src/pages/Gallery.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Gallery({ setSelectedImage, selectedImage }) {
  const [selectedAlbum, setSelectedAlbum] = useState("all");
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE = "https://enchanting-expression-production.up.railway.app";

  const fetchSecureImage = async (relativePath) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${BASE}${relativePath}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      return URL.createObjectURL(res.data);
    } catch (err) {
      console.error("Gallery image fetch failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await axios.get(`${BASE}/api/v1/gallery/galleries`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data || [];

        // Process each gallery item and load secure image
        const processed = await Promise.all(
          list.map(async (item) => {
            let imageSrc = null;

            if (item.galleryImage) {
              imageSrc = await fetchSecureImage(item.galleryImage);
            }

            return {
              ...item,
              imageSrc,
              category: item.category || "Gallery",
              caption:
                item.caption ||
                item.description ||
                item.title ||
                "Gallery Image",
            };
          })
        );

        setAlbums(processed);
      } catch (err) {
        console.error("Gallery Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  // GROUP BY CATEGORY
  const grouped = {};
  albums.forEach((g) => {
    if (!grouped[g.category]) {
      grouped[g.category] = {
        id: g.category,
        title: g.category,
        images: [],
      };
    }

    grouped[g.category].images.push({
      src: g.imageSrc,
      caption: g.caption,
    });
  });

  const formattedAlbums = Object.values(grouped);

  const galleryImages =
    selectedAlbum === "all"
      ? formattedAlbums.flatMap((a) => a.images)
      : formattedAlbums.find((a) => a.id === selectedAlbum)?.images || [];

  // Navigation logic
  const flatImages = formattedAlbums.flatMap((a) => a.images);
  const currentIndex = flatImages.findIndex(
    (img) => img.src === (selectedImage?.src || selectedImage)
  );

  const goPrevImage = () => {
    const prevIndex =
      currentIndex === 0 ? flatImages.length - 1 : currentIndex - 1;
    setSelectedImage(flatImages[prevIndex]);
  };

  const goNextImage = () => {
    const nextIndex =
      currentIndex === flatImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(flatImages[nextIndex]);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowLeft") goPrevImage();
      if (e.key === "ArrowRight") goNextImage();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white tracking-wide"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Gallery
        </motion.h2>

        {/* Loading */}
        {loading && (
          <div className="text-center text-white text-lg animate-pulse">
            Loading images...
          </div>
        )}

        {/* Filter */}
        {!loading && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                selectedAlbum === "all"
                  ? "bg-red-500 text-black"
                  : "text-white border-white/20 hover:bg-white/10"
              }`}
              onClick={() => setSelectedAlbum("all")}
            >
              All Galleries
            </button>

            {formattedAlbums.map((album) => (
              <button
                key={album.id}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                  selectedAlbum === album.id
                    ? "bg-red-500 text-black"
                    : "text-white border-white/20 hover:bg-white/10"
                }`}
                onClick={() => setSelectedAlbum(album.id)}
              >
                {album.title}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={idx}
              className="group relative overflow-hidden rounded-2xl shadow-xl bg-[#124E35] cursor-pointer border border-white/10"
              whileHover={{ scale: 1.04, y: -4 }}
            >
              {img.src && (
                <img
                  src={img.src}
                  alt={`gallery-${idx}`}
                  className="w-full h-60 object-cover rounded-2xl group-hover:scale-110 transition-all duration-700"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 p-4 flex flex-col justify-end transition-all duration-500">
                <span className="text-white text-xs mb-2 font-medium">
                  {img.caption}
                </span>

                <button
                  className="px-4 py-1 bg-red-500 text-black text-xs font-semibold rounded-full"
                  onClick={() => setSelectedImage(img)}
                >
                  View Image
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9990] flex justify-center items-center px-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
  className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded-full z-[9999] shadow-lg"
  onClick={() => setSelectedImage(null)}
>
  Close
</button>


            <img
              src={selectedImage.src}
              alt={selectedImage.caption}
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-xl"
            />

            <p className="text-center text-white text-sm mt-3">
              {selectedImage.caption}
            </p>

            {/* Navigation */}
            <button
              onClick={goPrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
            >
              ‹
            </button>

            <button
              onClick={goNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
