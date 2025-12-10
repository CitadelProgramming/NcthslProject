// src/admin/pages/AboutAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1";
const BASE_URL = "https://enchanting-expression-production.up.railway.app";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gUGhvdG88L3RleHQ+PC9zdmc+";

export default function AboutAdmin() {
  const [about, setAbout] = useState(null);
  const [partners, setPartners] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const emptyAboutForm = { overview: "", mission: "", vision: "", corePillars: [""] };
  const [aboutForm, setAboutForm] = useState(emptyAboutForm);

  const [partnerForm, setPartnerForm] = useState({ companyName: "", website: "", logoFile: null });
  const [editingPartnerId, setEditingPartnerId] = useState(null);

  const [leaderForm, setLeaderForm] = useState({ fullName: "", position: "", bio: "", photoFile: null });
  const [editingLeaderId, setEditingLeaderId] = useState(null);

  const getToken = () => localStorage.getItem("adminToken");

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const getMultipartConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return PLACEHOLDER_IMAGE;
    const token = getToken();
    if (!token) return PLACEHOLDER_IMAGE;
    return `${BASE_URL}${path}?access_token=${token}`;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();

      const [aboutRes, partnersRes, leadersRes] = await Promise.all([
        axios.get(`${API_BASE}/about/all-about`, config),
        axios.get(`${API_BASE}/partners/all-partners`, config),
        axios.get(`${API_BASE}/leadership/leaders`, config),
      ]);

      const aboutData = aboutRes.data?.[0] || null;
      setAbout(aboutData);
      if (aboutData) {
        setAboutForm({
          overview: aboutData.overview || "",
          mission: aboutData.mission || "",
          vision: aboutData.vision || "",
          corePillars: Array.isArray(aboutData.corePillars) ? aboutData.corePillars : [""],
        });
      }

      // Ensure every partner has a unique id
      const partnersWithId = (partnersRes.data || []).map(p => ({
        ...p,
        id: p.id || Date.now() + Math.random(),
      }));
      setPartners(partnersWithId);

      setLeaders(leadersRes.data || []);
    } catch (err) {
      console.error("Load error:", err);
      Swal.fire("Error", "Failed to load data. Please log in again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ABOUT — FULLY WORKING
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    if (!aboutForm.overview.trim()) return Swal.fire("Error", "Overview is required", "error");

    const payload = {
      overview: aboutForm.overview.trim(),
      mission: aboutForm.mission.trim(),
      vision: aboutForm.vision.trim(),
      corePillars: aboutForm.corePillars.filter(p => p.trim()),
    };

    try {
      if (about?.id) {
        await axios.put(`${API_BASE}/about/update/${about.id}`, payload, {
          headers: { ...getAuthConfig().headers, "Content-Type": "application/json" },
        });
        Swal.fire("Updated!", "About section updated", "success");
      } else {
        await axios.post(`${API_BASE}/about/add-about`, payload, {
          headers: { ...getAuthConfig().headers, "Content-Type": "application/json" },
        });
        Swal.fire("Created!", "About section created", "success");
      }
      await loadData();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save About", "error");
    }
  };

  // PARTNERS — NOW WITH AUTO REFRESH AFTER ADD/EDIT
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    if (!partnerForm.companyName.trim()) return Swal.fire("Error", "Company name required", "error");

    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify({
      companyName: partnerForm.companyName.trim(),
      website: partnerForm.website.trim() || ""
    })], { type: "application/json" }));
    if (partnerForm.logoFile) fd.append("file", partnerForm.logoFile);

    try {
      let newPartner;

      if (editingPartnerId) {
        await axios.delete(`${API_BASE}/partners/delete/${editingPartnerId}`, getAuthConfig());
        const res = await axios.post(`${API_BASE}/partners/create-partner`, fd, getMultipartConfig());
        newPartner = res.data?.data || res.data;
        setPartners(prev => prev.map(p => p.id === editingPartnerId ? newPartner : p));
        Swal.fire("Updated!", "Partner updated", "success");
      } else {
        const res = await axios.post(`${API_BASE}/partners/create-partner`, fd, getMultipartConfig());
        newPartner = res.data?.data || res.data;
        setPartners(prev => [newPartner, ...prev]);
        Swal.fire("Success!", "Partner added", "success");
      }

      setPartnerForm({ companyName: "", website: "", logoFile: null });
      setEditingPartnerId(null);

      // AUTO RELOAD TO SHOW IMAGE IMMEDIATELY
      await loadData();
    } catch (err) {
      console.error("Partner error:", err.response?.data);
      Swal.fire("Error", err.response?.data?.message || "Failed to save partner", "error");
    }
  };

  const startEditPartner = (p) => {
    setEditingPartnerId(p.id);
    setPartnerForm({
      companyName: p.companyName || "",
      website: p.website || "",
      logoFile: null,
    });
  };

  const cancelPartnerEdit = () => {
    setEditingPartnerId(null);
    setPartnerForm({ companyName: "", website: "", logoFile: null });
  };

  const deletePartner = async (id) => {
    const res = await Swal.fire({
      title: "Delete Partner?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!res.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE}/partners/delete/${id}`, getAuthConfig());
      setPartners(prev => prev.filter(p => p.id !== id));
      Swal.fire("Deleted!", "Partner removed", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  // LEADERSHIP — FULLY WORKING
  const handleLeaderSubmit = async (e) => {
    e.preventDefault();
    if (!leaderForm.fullName.trim() || !leaderForm.position.trim())
      return Swal.fire("Error", "Name and position required", "error");

    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify({
      fullName: leaderForm.fullName.trim(),
      position: leaderForm.position.trim(),
      bio: leaderForm.bio.trim() || ""
    })], { type: "application/json" }));
    if (leaderForm.photoFile) fd.append("file", leaderForm.photoFile);

    try {
      if (editingLeaderId) {
        await axios.put(`${API_BASE}/leadership/update/${editingLeaderId}`, fd, getMultipartConfig());
        Swal.fire("Updated!", "Leader updated", "success");
      } else {
        await axios.post(`${API_BASE}/leadership/register`, fd, getMultipartConfig());
        Swal.fire("Success!", "Leader added", "success");
      }

      setLeaderForm({ fullName: "", position: "", bio: "", photoFile: null });
      setEditingLeaderId(null);
      await loadData();
    } catch (err) {
      console.error("Leader error:", err.response?.data);
      Swal.fire("Error", err.response?.data?.message || "Failed to save leader", "error");
    }
  };

  const startEditLeader = (l) => {
    setEditingLeaderId(l.id);
    setLeaderForm({
      fullName: l.fullName || "",
      position: l.position || "",
      bio: l.bio || "",
      photoFile: null,
    });
  };

  const cancelLeaderEdit = () => {
    setEditingLeaderId(null);
    setLeaderForm({ fullName: "", position: "", bio: "", photoFile: null });
  };

  const deleteLeader = async (id) => {
    const res = await Swal.fire({
      title: "Delete Leader?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!res.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE}/leadership/delete/${id}`, getAuthConfig());
      setLeaders(prev => prev.filter(l => l.id !== id));
      Swal.fire("Deleted!", "Leader removed", "success");
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

      <div className="mb-8 flex justify-center gap-4 flex-wrap">
        {["overview", "partners", "leadership"].map((tab) => (
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

      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-7xl mx-auto">

        {/* OVERVIEW TAB — PRESERVED */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            <form onSubmit={handleAboutSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Company Overview</h2>
                <textarea
                  className="w-full p-5 border-2 rounded-xl text-lg resize-none focus:border-blue-500 transition"
                  rows="6"
                  value={aboutForm.overview}
                  onChange={(e) => setAboutForm({ ...aboutForm, overview: e.target.value })}
                  placeholder="Write a compelling company overview..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Mission</h3>
                  <textarea className="w-full p-5 border-2 rounded-xl text-lg resize-none focus:border-green-500 transition" rows="5" value={aboutForm.mission} onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Vision</h3>
                  <textarea className="w-full p-5 border-2 rounded-xl text-lg resize-none focus:border-purple-500 transition" rows="5" value={aboutForm.vision} onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })} />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Core Pillars</h3>
                <div className="space-y-4">
                  {aboutForm.corePillars.map((pillar, index) => (
                    <div key={`pillar-${index}-${Date.now()}`} className="flex gap-3">
                      <input
                        className="flex-1 p-4 border-2 rounded-xl text-lg focus:border-indigo-500 transition"
                        value={pillar}
                        onChange={(e) => {
                          const updated = [...aboutForm.corePillars];
                          updated[index] = e.target.value;
                          setAboutForm({ ...aboutForm, corePillars: updated });
                        }}
                        placeholder="Enter pillar"
                      />
                      {aboutForm.corePillars.length > 1 && (
                        <button type="button" onClick={() => setAboutForm({ ...aboutForm, corePillars: aboutForm.corePillars.filter((_, i) => i !== index) })} className="px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setAboutForm({ ...aboutForm, corePillars: [...aboutForm.corePillars, ""] })} className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold">
                    + Add Pillar
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition transform hover:scale-105">
                  {about ? "Update About Section" : "Create About Section"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PARTNERS TAB — NOW WITH AUTO REFRESH */}
        {activeTab === "partners" && (
          <div className="space-y-10">
            <form onSubmit={handlePartnerSubmit} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingPartnerId ? "Edit Partner" : "Add New Partner"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Company Name *"
                  className="p-4 border-2 rounded-xl text-lg focus:border-blue-500 transition"
                  value={partnerForm.companyName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                  required
                />
                <input
                  type="url"
                  placeholder="Website (optional)"
                  className="p-4 border-2 rounded-xl text-lg focus:border-blue-500 transition"
                  value={partnerForm.website}
                  onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                />
              </div>
              <div className="mt-6">
                <label className="block text-lg font-medium mb-3">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPartnerForm({ ...partnerForm, logoFile: e.target.files?.[0] || null })}
                  className="w-full p-3 border-2 rounded-xl bg-white"
                />
              </div>
              <div className="mt-8 flex gap-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition">
                  {editingPartnerId ? "Update Partner" : "Add Partner"}
                </button>
                {editingPartnerId && (
                  <button type="button" onClick={cancelPartnerEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-bold transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
              {partners.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">No partners yet.</p>
              ) : (
                partners.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-2xl shadow-xl text-center hover:shadow-2xl transition">
                    <img
                      src={getImageUrl(p.companyLogo)}
                      alt={p.companyName}
                      className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg bg-gray-50"
                      onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                    />
                    <h3 className="font-bold text-xl text-gray-800">{p.companyName}</h3>
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noreferrer" className="text-blue-600 text-sm block mt-2 hover:underline">
                        {p.website}
                      </a>
                    )}
                    <div className="flex justify-center gap-3 mt-6">
                      <button onClick={() => startEditPartner(p)} className={editBtn}>Edit</button>
                      <button onClick={() => deletePartner(p.id)} className={deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* LEADERSHIP TAB — PRESERVED */}
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
                  onChange={(e) => setLeaderForm({ ...leaderForm, fullName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Position *"
                  className="p-4 border-2 rounded-xl text-lg focus:border-purple-500 transition"
                  value={leaderForm.position}
                  onChange={(e) => setLeaderForm({ ...leaderForm, position: e.target.value })}
                  required
                />
              </div>
              <textarea
                placeholder="Bio"
                rows="5"
                className="w-full p-4 border-2 rounded-xl text-lg mt-6 focus:border-purple-500 transition"
                value={leaderForm.bio}
                onChange={(e) => setLeaderForm({ ...leaderForm, bio: e.target.value })}
              />
              <div className="mt-6">
                <label className="block text-lg font-medium mb-3">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLeaderForm({ ...leaderForm, photoFile: e.target.files?.[0] || null })}
                  className="w-full p-3 border-2 rounded-xl bg-white"
                />
              </div>
              <div className="mt-8 flex gap-4">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold transition">
                  {editingLeaderId ? "Update Leader" : "Add Leader"}
                </button>
                {editingLeaderId && (
                  <button type="button" onClick={cancelLeaderEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-bold transition ml-4">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {leaders.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">No leaders yet.</p>
              ) : (
                leaders.map((l) => (
                  <div key={l.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition">
                    <img
                      src={getImageUrl(l.image)}
                      alt={l.fullName}
                      className="w-full h-80 object-cover bg-gray-100"
                      onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                    />
                    <div className="p-8 text-center">
                      <h3 className="text-2xl font-bold text-gray-800">{l.fullName}</h3>
                      <p className="text-lg text-purple-600 font-semibold mt-2">{l.position}</p>
                      <p className="text-gray-700 mt-4 leading-relaxed">{l.bio || "No bio available"}</p>
                      <div className="flex justify-center gap-4 mt-8">
                        <button onClick={() => startEditLeader(l)} className={editBtn}>Edit</button>
                        <button onClick={() => deleteLeader(l.id)} className={deleteBtn}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mb-4"></div>
            <p className="text-xl text-gray-700">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}