// src/admin/pages/AboutAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gUGhvdG88L3RleHQ+PC9zdmc+";

export default function AboutAdmin() {
  const [aboutData, setAboutData] = useState(null);
  const [partners, setPartners] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [aboutForm, setAboutForm] = useState({
    overview: "",
    mission: "",
    vision: "",
    corePillars: [""],
  });

  const [partnerForm, setPartnerForm] = useState({ name: "", website: "", logoFile: null });
  const [leaderForm, setLeaderForm] = useState({ fullName: "", position: "", bio: "", photoFile: null });

  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [editingLeaderId, setEditingLeaderId] = useState(null);

  const getToken = () => localStorage.getItem("adminToken");
  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  // Secure image URL with access_token
  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    const token = getToken();
    if (!token) return PLACEHOLDER_IMAGE;
    return `${BASE_URL}${imagePath}?access_token=${token}`;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const config = getAuthHeaders();

      const [aboutRes, partnersRes, leadersRes] = await Promise.all([
        axios.get(`${API_BASE}/about/all-about`, config),
        axios.get(`${API_BASE}/partners/all-partners`, config),
        axios.get(`${API_BASE}/leadership/leaders`, config),
      ]);

      // About
      const about = aboutRes.data?.[0] || aboutRes.data || {};
      setAboutData(about);
      setAboutForm({
        overview: about.overview || "",
        mission: about.mission || "",
        vision: about.vision || "",
        corePillars: Array.isArray(about.corePillars) ? about.corePillars : [""],
      });

      // Partners
      setPartners(partnersRes.data || []);

      // Leaders
      setLeaders(leadersRes.data || []);
    } catch (err) {
      console.error("Failed to load About data:", err);
      Swal.fire("Error", "Failed to load data. Please log in again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ABOUT: Pure JSON
  const saveAbout = async () => {
    if (!aboutForm.overview.trim()) {
      return Swal.fire("Error", "Overview is required", "error");
    }

    const payload = {
      overview: aboutForm.overview,
      mission: aboutForm.mission,
      vision: aboutForm.vision,
      corePillars: aboutForm.corePillars.filter(p => p.trim()),
    };

    try {
      await axios.post(`${API_BASE}/about/add-about`, payload, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire("Success!", "About section updated", "success");
      await loadData();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save About", "error");
    }
  };

  // PARTNERS
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    if (!partnerForm.name.trim()) return Swal.fire("Error", "Name required", "error");

    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify({ name: partnerForm.name, website: partnerForm.website || "" })], { type: "application/json" }));
    if (partnerForm.logoFile) fd.append("file", partnerForm.logoFile);

    try {
      if (editingPartnerId) {
        await axios.delete(`${API_BASE}/partners/delete/${editingPartnerId}`, getAuthHeaders());
      }
      const res = await axios.post(`${API_BASE}/partners/create-partner`, fd, getAuthHeaders());
      const newP = res.data?.data || res.data;

      if (editingPartnerId) {
        setPartners(prev => prev.map(p => p.id === editingPartnerId ? newP : p));
      } else {
        setPartners(prev => [newP, ...prev]);
      }

      Swal.fire("Success!", editingPartnerId ? "Partner updated" : "Partner added", "success");
      setPartnerForm({ name: "", website: "", logoFile: null });
      setEditingPartnerId(null);
      await loadData();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save partner", "error");
    }
  };

  const deletePartner = async (id) => {
    const result = await Swal.fire({ title: "Delete Partner?", icon: "warning", showCancelButton: true });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE}/partners/delete/${id}`, getAuthHeaders());
      setPartners(prev => prev.filter(p => p.id !== id));
      Swal.fire("Deleted!", "Partner removed", "success");
      await loadData();
    } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  // LEADERSHIP
  const handleLeaderSubmit = async (e) => {
    e.preventDefault();
    if (!leaderForm.fullName.trim()) return Swal.fire("Error", "Name required", "error");

    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify({
      name: leaderForm.fullName,
      role: leaderForm.position,
      bio: leaderForm.bio,
    })], { type: "application/json" }));
    if (leaderForm.photoFile) fd.append("file", leaderForm.photoFile);

    try {
      if (editingLeaderId) {
        await axios.put(`${API_BASE}/leadership/update/${editingLeaderId}`, fd, getAuthHeaders());
        Swal.fire("Updated!", "Leader updated", "success");
      } else {
        const res = await axios.post(`${API_BASE}/leadership/register`, fd, getAuthHeaders());
        const newL = res.data?.data || res.data;
        setLeaders(prev => [newL, ...prev]);
        Swal.fire("Success!", "Leader added", "success");
      }

      setLeaderForm({ fullName: "", position: "", bio: "", photoFile: null });
      setEditingLeaderId(null);
      await loadData();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save leader", "error");
    }
  };

  const deleteLeader = async (id) => {
    const result = await Swal.fire({ title: "Delete Leader?", icon: "warning", showCancelButton: true });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE}/leadership/delete/${id}`, getAuthHeaders());
      setLeaders(prev => prev.filter(l => l.id !== id));
      Swal.fire("Deleted!", "Leader removed", "success");
      await loadData();
    } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  const glassButton = "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-95";
  const editBtn = `${glassButton} text-blue-700 font-semibold`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">About Administration</h1>

      {/* Tabs */}
      <div className="mb-8 flex justify-center gap-4 flex-wrap">
        {["overview", "partners", "leadership"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${activeTab === tab
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
              : "bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/20"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-6xl mx-auto">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Company Overview</h2>
              <textarea
                className="w-full p-5 border-2 rounded-xl text-lg resize-none focus:border-blue-500 transition"
                rows="6"
                value={aboutForm.overview}
                onChange={e => setAboutForm({ ...aboutForm, overview: e.target.value })}
                placeholder="Write a compelling company overview..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Mission</h3>
                <textarea
                  className="w-full p-5 border-2 rounded-xl text-lg resize-none focus:border-green-500 transition"
                  rows="5"
                  value={aboutForm.mission}
                  onChange={e => setAboutForm({ ...aboutForm, mission: e.target.value })}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Vision</h3>
                <textarea
                  className="w-full p-5 border-2 rounded-xl text-lg resize-none focus:border-purple-500 transition"
                  rows="5"
                  value={aboutForm.vision}
                  onChange={e => setAboutForm({ ...aboutForm, vision: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Core Pillars</h3>
              <div className="space-y-4">
                {aboutForm.corePillars.map((pillar, i) => (
                  <div key={i} className="flex gap-3">
                    <input
                      className="flex-1 p-4 border-2 rounded-xl text-lg focus:border-indigo-500 transition"
                      value={pillar}
                      onChange={e => {
                        const updated = [...aboutForm.corePillars];
                        updated[i] = e.target.value;
                        setAboutForm({ ...aboutForm, corePillars: updated });
                      }}
                    />
                    {aboutForm.corePillars.length > 1 && (
                      <button
                        onClick={() => setAboutForm({
                          ...aboutForm,
                          corePillars: aboutForm.corePillars.filter((_, idx) => idx !== i)
                        })}
                        className="px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setAboutForm({ ...aboutForm, corePillars: [...aboutForm.corePillars, ""] })}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
                >
                  + Add Pillar
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={saveAbout}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition transform hover:scale-105"
              >
                Save About Section
              </button>
            </div>
          </div>
        )}

        {/* Partners */}
        {activeTab === "partners" && (
          <div className="space-y-10">
            <form onSubmit={handlePartnerSubmit} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingPartnerId ? "Replace Partner" : "Add New Partner"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Partner Name *"
                  className="p-4 border-2 rounded-xl text-lg focus:border-blue-500 transition"
                  value={partnerForm.name}
                  onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  required
                />
                <input
                  type="url"
                  placeholder="Website (optional)"
                  className="p-4 border-2 rounded-xl text-lg focus:border-blue-500 transition"
                  value={partnerForm.website}
                  onChange={e => setPartnerForm({ ...partnerForm, website: e.target.value })}
                />
              </div>
              <div className="mt-6">
                <label className="block text-lg font-medium mb-3">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setPartnerForm({ ...partnerForm, logoFile: e.target.files?.[0] || null })}
                  className="w-full p-3 border-2 rounded-xl bg-white"
                />
              </div>
              <div className="mt-8 flex gap-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition">
                  {editingPartnerId ? "Replace Partner" : "Add Partner"}
                </button>
                {editingPartnerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPartnerId(null);
                      setPartnerForm({ name: "", website: "", logoFile: null });
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
              {partners.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-2xl shadow-xl text-center hover:shadow-2xl transition">
                  <img
                    src={getImageUrl(p.logo)}
                    alt={p.name}
                    className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg"
                    onError={e => e.target.src = PLACEHOLDER_IMAGE}
                  />
                  <h3 className="font-bold text-xl text-gray-800">{p.name}</h3>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noreferrer" className="text-blue-600 text-sm block mt-2 hover:underline">
                      {p.website}
                    </a>
                  )}
                  <div className="flex justify-center gap-3 mt-6">
                    <button
                      onClick={() => {
                        setEditingPartnerId(p.id);
                        setPartnerForm({ name: p.name, website: p.website || "", logoFile: null });
                      }}
                      className={editBtn}
                    >
                      Edit
                    </button>
                    <button onClick={() => deletePartner(p.id)} className={deleteBtn}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leadership */}
        {activeTab === "leadership" && (
          <div className="space-y-10">
            <form onSubmit={handleLeaderSubmit} className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingLeaderId ? "Edit Leader" : "Add New Leader"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name *"
                  className="p-4 border-2 rounded-xl text-lg focus:border-purple-500 transition"
                  value={leaderForm.fullName}
                  onChange={e => setLeaderForm({ ...leaderForm, fullName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Position *"
                  className="p-4 border-2 rounded-xl text-lg focus:border-purple-500 transition"
                  value={leaderForm.position}
                  onChange={e => setLeaderForm({ ...leaderForm, position: e.target.value })}
                  required
                />
              </div>
              <textarea
                placeholder="Bio"
                rows="5"
                className="w-full p-4 border-2 rounded-xl text-lg mt-6 focus:border-purple-500 transition"
                value={leaderForm.bio}
                onChange={e => setLeaderForm({ ...leaderForm, bio: e.target.value })}
              />
              <div className="mt-6">
                <label className="block text-lg font-medium mb-3">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setLeaderForm({ ...leaderForm, photoFile: e.target.files?.[0] || null })}
                  className="w-full p-3 border-2 rounded-xl bg-white"
                />
              </div>
              <div className="mt-8 flex gap-4">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold transition">
                  {editingLeaderId ? "Update Leader" : "Add Leader"}
                </button>
                {editingLeaderId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLeaderId(null);
                      setLeaderForm({ fullName: "", position: "", bio: "", photoFile: null });
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {leaders.map(l => (
                <div key={l.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition">
                  <img
                    src={getImageUrl(l.photo)}
                    alt={l.name}
                    className="w-full h-80 object-cover"
                    onError={e => e.target.src = PLACEHOLDER_IMAGE}
                  />
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-800">{l.name}</h3>
                    <p className="text-lg text-purple-600 font-semibold mt-2">{l.role}</p>
                    <p className="text-gray-700 mt-4 leading-relaxed">{l.bio}</p>
                    <div className="flex justify-center gap-4 mt-8">
                      <button
                        onClick={() => {
                          setEditingLeaderId(l.id);
                          setLeaderForm({ fullName: l.name, position: l.role, bio: l.bio || "", photoFile: null });
                        }}
                        className={editBtn}
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteLeader(l.id)} className={deleteBtn}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          <p className="mt-6 text-xl text-gray-600">Loading About section...</p>
        </div>
      )}
    </div>
  );
}