import React, { useState } from "react";
import Swal from "sweetalert2";

export default function ServicesAdmin() {
  const [services, setServices] = useState([
    {
      id: 1,
      title: "Aircraft Maintenance",
      description: "Full aircraft maintenance and repair services.",
      images: [],
      features: ["Engine check", "Airframe repair", "Avionics inspection"],
    },
    {
      id: 2,
      title: "Fixed Based Operations",
      description:
        "NCTHSL operates secure FBO services offering fueling, parking, passenger lounges and ground handling.",
      images: [],
      features: [
        "Fuel management",
        "Ramp & parking services",
        "Passenger & crew lounges",
        "Ground handling",
      ],
    },
  ]);

  const emptyService = {
    title: "",
    description: "",
    images: [],
    features: [""],
  };

  const [newService, setNewService] = useState(emptyService);
  const [editingService, setEditingService] = useState(null);
  const [editData, setEditData] = useState(emptyService);
  const [searchTerm, setSearchTerm] = useState("");

  // Convert uploaded files to base64
  const handleImagesUpload = (e, isEditing = false) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((results) => {
      if (isEditing)
        setEditData({ ...editData, images: [...editData.images, ...results] });
      else
        setNewService({
          ...newService,
          images: [...newService.images, ...results],
        });
    });
  };

  // Remove image
  const removeImage = (index, isEditing = false) => {
    if (isEditing) {
      const images = [...editData.images];
      images.splice(index, 1);
      setEditData({ ...editData, images });
    } else {
      const images = [...newService.images];
      images.splice(index, 1);
      setNewService({ ...newService, images });
    }
  };

  // Add or Update service
  const handleAddService = (e) => {
    e.preventDefault();

    const data = editingService ? editData : newService;

    if (!data.title.trim() || !data.description.trim()) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    if (data.features.some((f) => !f.trim())) {
      Swal.fire(
        "Error",
        "Please fill all feature fields or remove empty ones",
        "error"
      );
      return;
    }

    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService ? { ...s, ...editData } : s
        )
      );
      Swal.fire("Success", "Service updated successfully!", "success");
      setEditingService(null);
      setEditData(emptyService);
    } else {
      const service = { ...newService, id: Date.now() };
      setServices([service, ...services]);
      Swal.fire("Success", "Service added successfully!", "success");
      setNewService(emptyService);
    }
  };

  // Delete service
  const handleDelete = (id) => {
    setServices(services.filter((s) => s.id !== id));
    Swal.fire("Deleted", "Service removed successfully", "success");
  };

  // Start editing
  const startEdit = (service) => {
    setEditingService(service.id);
    setEditData({ ...service });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingService(null);
    setEditData(emptyService);
  };

  // Features
  const handleFeatureChange = (index, value, isEditing = false) => {
    const features = isEditing ? [...editData.features] : [...newService.features];
    features[index] = value;

    if (isEditing) setEditData({ ...editData, features });
    else setNewService({ ...newService, features });
  };

  const addFeatureField = (isEditing = false) => {
    if (isEditing)
      setEditData({ ...editData, features: [...editData.features, ""] });
    else
      setNewService({
        ...newService,
        features: [...newService.features, ""],
      });
  };

  const removeFeatureField = (index, isEditing = false) => {
    if (isEditing) {
      const features = [...editData.features];
      features.splice(index, 1);
      setEditData({ ...editData, features });
    } else {
      const features = [...newService.features];
      features.splice(index, 1);
      setNewService({ ...newService, features });
    }
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#0a3a0a]">Services Admin</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 border rounded-xl shadow-sm max-w-xl"
      />

      {/* Form */}
      <form
        onSubmit={handleAddService}
        className="mb-6 space-y-4 bg-white p-6 shadow-xl rounded-2xl max-w-2xl border"
      >
        <h2 className="text-xl font-bold text-[#0a3a0a]">
          {editingService ? "Edit Service" : "Add New Service"}
        </h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Service Title *"
          value={editingService ? editData.title : newService.title}
          onChange={(e) =>
            editingService
              ? setEditData({ ...editData, title: e.target.value })
              : setNewService({ ...newService, title: e.target.value })
          }
          className="w-full p-3 border rounded-xl shadow-sm"
        />

        {/* Description */}
        <textarea
          placeholder="Service Description *"
          value={editingService ? editData.description : newService.description}
          onChange={(e) =>
            editingService
              ? setEditData({ ...editData, description: e.target.value })
              : setNewService({ ...newService, description: e.target.value })
          }
          className="w-full p-3 border rounded-xl shadow-sm"
          rows={4}
        />

        {/* Image Upload */}
        <label className="block text-sm font-medium text-gray-700">
          Upload Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleImagesUpload(e, !!editingService)}
          className="w-full p-3 border rounded-xl"
        />

        {/* Preview Images */}
        <div className="flex flex-wrap gap-3 mt-2">
          {(editingService ? editData.images : newService.images).map(
            (img, idx) => (
              <div
                key={idx}
                className="relative group border rounded-lg shadow-sm"
              >
                <img
                  src={img}
                  className="w-28 h-28 object-cover rounded-lg"
                  alt=""
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx, !!editingService)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>

        {/* Features */}
        <h3 className="text-lg font-semibold mt-4">Features</h3>
        {(editingService ? editData.features : newService.features).map(
          (f, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={f}
                placeholder="Feature"
                onChange={(e) =>
                  handleFeatureChange(idx, e.target.value, !!editingService)
                }
                className="flex-1 p-3 border rounded-xl shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeFeatureField(idx, !!editingService)}
                className="bg-red-500 text-white px-3 rounded-xl"
              >
                X
              </button>
            </div>
          )
        )}

        <button
          type="button"
          onClick={() => addFeatureField(!!editingService)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Add Feature
        </button>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-700 text-white p-3 rounded-xl w-full"
        >
          {editingService ? "Update Service" : "Add Service"}
        </button>

        {editingService && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-500 text-white p-3 rounded-xl w-full"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <p>No services found.</p>
        ) : (
          filteredServices.map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 shadow rounded-xl border flex flex-col"
            >
              <div>
                {s.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {s.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt=""
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
                <h2 className="text-lg font-semibold text-[#0a3a0a]">
                  {s.title}
                </h2>
                <p className="text-gray-700">{s.description}</p>

                {s.features.length > 0 && (
                  <ul className="list-disc pl-6 mt-2 text-sm">
                    {s.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => startEdit(s)}
                  className="text-blue-700 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
