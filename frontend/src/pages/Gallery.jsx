import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Gallery({ setSelectedImage, selectedImage }) {
  const [selectedAlbum, setSelectedAlbum] = useState("all");
  const [albums, setAlbums] = useState([]);

  const BASE_URL = "https://enchanting-expression-production.up.railway.app";

  // Fetch galleries from backend
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/gallery/galleries`);
        setAlbums(res.data); // backend returns list of gallery objects
      } catch (error) {
        console.error("Failed to fetch galleries", error);
      }
    };

    fetchGallery();
  }, []);

  // Format gallery items
// GROUP galleries by category
const grouped = {};

albums.forEach((g) => {
  const category = g.category || "Gallery";

  if (!grouped[category]) {
    grouped[category] = {
      id: category,       // Use CATEGORY as album ID
      title: category,    // Album title = category
      images: [],
    };
  }

  // Build correct full URL for image
  const imageUrl = `${BASE_URL}${g.galleryImage.startsWith("/") ? g.galleryImage : "/" + g.galleryImage}`;

  grouped[category].images.push({
    src: imageUrl,
    caption: g.caption || g.description || g.title || "Gallery Image",
  });
});

// FINAL album list
const formattedAlbums = Object.values(grouped);


  const galleryImages =
    selectedAlbum === "all"
      ? formattedAlbums.flatMap((a) => a.images)
      : formattedAlbums.find((a) => a.id === selectedAlbum)?.images || [];

  // Navigation helpers
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

  // ESC + Arrow keys
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowLeft") goPrevImage();
      if (e.key === "ArrowRight") goNextImage();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <section
      id="gallery"
      className="py-24 px-6 bg-gradient-to-br from-[#0a3a0a] to-[#052a05]"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white animate-fadeUp tracking-wide">
          Gallery
        </h2>

        {/* Album Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
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
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl shadow-xl bg-[#124E35] border border-white/10 cursor-pointer transform transition-all duration-500 hover:scale-[1.06] hover:-translate-y-2 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
            >
              <img
                src={item.src}
                alt={`gallery-${idx + 1}`}
                className="w-full h-60 object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <span className="text-white text-xs mb-2 font-medium pointer-events-none">
                  {item.caption}
                </span>

                <button
                  className="px-4 py-1 bg-red-500 text-black text-xs font-semibold rounded-full pointer-events-auto"
                  onClick={() => setSelectedImage(item)}
                >
                  View Image
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex justify-center items-center animate-fadeIn px-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full text-sm shadow-lg transition-all"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>

            <img
              src={selectedImage.src || selectedImage}
              alt={selectedImage.caption || "Selected Image"}
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />

            {selectedImage.caption && (
              <p className="text-center text-white mt-4 text-sm font-light tracking-wide">
                {selectedImage.caption}
              </p>
            )}

            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full text-lg shadow-md transition-all"
              onClick={goPrevImage}
            >
              ‹
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full text-lg shadow-md transition-all"
              onClick={goNextImage}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
