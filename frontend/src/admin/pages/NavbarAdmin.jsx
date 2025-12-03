import React, { useState } from "react";
import Swal from "sweetalert2";

export default function NavbarAdmin() {
  const [navbar, setNavbar] = useState({
    logo: "",
    menuItems: ["Home", "Services", "Contact", "News", "Gallery", "Testimonials"],
    aboutDropdown: [
      "Company Overview",
      "Mission & Vision",
      "Core Pillars",
      "Partners",
      "Leadership Team",
    ],
    actionButton: "Get In Touch",
  });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(navbar);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditData({ ...editData, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Menu Items (excluding About)
  const updateMenuItem = (index, value) => {
    const items = [...editData.menuItems];
    items[index] = value;
    setEditData({ ...editData, menuItems: items });
  };

  const addMenuItem = () => {
    setEditData({ ...editData, menuItems: [...editData.menuItems, ""] });
  };

  const removeMenuItem = (index) => {
    const items = [...editData.menuItems];
    items.splice(index, 1);
    setEditData({ ...editData, menuItems: items });
  };

  // ABOUT DROPDOWN CONTROLS
  const updateAboutItem = (index, value) => {
    const items = [...editData.aboutDropdown];
    items[index] = value;
    setEditData({ ...editData, aboutDropdown: items });
  };

  const addAboutItem = () => {
    setEditData({ ...editData, aboutDropdown: [...editData.aboutDropdown, ""] });
  };

  const removeAboutItem = (index) => {
    const items = [...editData.aboutDropdown];
    items.splice(index, 1);
    setEditData({ ...editData, aboutDropdown: items });
  };

  const saveChanges = () => {
    setNavbar(editData);
    setEditMode(false);
    Swal.fire("Saved", "Navbar updated successfully!", "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Navbar Management</h1>

      {!editMode ? (
        <>
          <div className="bg-white p-4 shadow rounded max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>

            {navbar.logo && (
              <img
                src={navbar.logo}
                alt="logo"
                className="w-32 h-32 object-contain mb-4 bg-gray-100 rounded"
              />
            )}

            <h3 className="text-lg font-semibold">Main Menu Items:</h3>
            <ul className="list-disc pl-6">
              {navbar.menuItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mt-4">About Dropdown Items:</h3>
            <ul className="list-disc pl-6">
              {navbar.aboutDropdown.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <p className="mt-4">
              <strong>Action Button:</strong> {navbar.actionButton}
            </p>
          </div>

          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Navbar
          </button>
        </>
      ) : (
        <>
          <div className="bg-white p-4 shadow rounded max-w-2xl space-y-4">
            <h2 className="text-xl font-semibold">Edit Navbar</h2>

            <div>
              <label className="font-semibold">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full p-2 border rounded"
              />
              {editData.logo && (
                <img
                  src={editData.logo}
                  alt="preview"
                  className="w-32 h-32 object-contain mt-2 bg-gray-100 rounded"
                />
              )}
            </div>

            {/* MENU ITEMS */}
            <div>
              <label className="font-semibold">Menu Items (excluding About)</label>
              <div className="space-y-2 mt-2">
                {editData.menuItems.map((item, idx) => (
                  <div key={idx} className="flex space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateMenuItem(idx, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Menu Item"
                    />
                    <button
                      onClick={() => removeMenuItem(idx)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                  onClick={addMenuItem}
                >
                  Add Menu Item
                </button>
              </div>
            </div>

            {/* ABOUT DROPDOWN */}
            <div>
              <label className="font-semibold">About Dropdown Items</label>
              <div className="space-y-2 mt-2">
                {editData.aboutDropdown.map((item, idx) => (
                  <div key={idx} className="flex space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAboutItem(idx, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Dropdown Item"
                    />
                    <button
                      onClick={() => removeAboutItem(idx)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  onClick={addAboutItem}
                >
                  Add Dropdown Item
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold">Action Button Text</label>
              <input
                type="text"
                value={editData.actionButton}
                onChange={(e) => setEditData({ ...editData, actionButton: e.target.value })}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={saveChanges}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>

            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}