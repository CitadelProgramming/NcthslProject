// src/admin/pages/AboutAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE = "https://enchanting-expression-production.up.railway.app/api/v1";

export default function AboutAdmin() {
  const [aboutData, setAboutData] = useState(null);
  const [partners, setPartners] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewMap, setPreviewMap] = useState({});

  // Forms
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
  const [activeTab, setActiveTab] = useState("overview");

  const token = localStorage.getItem("adminToken");

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const getMultipartHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  // Secure image loader (same as NewsAdmin)
  const loadImageWithAuth = async (url, key) => {
    if (!url) return;
    try {
      const res = await fetch(`https://enchanting-expression-production.up.railway.app${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      setPreviewMap(prev => ({ ...prev, [key]: objUrl }));
    } catch (err) {
      console.error("Image load failed:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const config = getAuthHeaders();

      // About - GET
      const aboutRes = await axios.get(`${API_BASE}/about/all-about`, config);
      const about = aboutRes.data?.[0] || aboutRes.data || {};
      setAboutData(about);
      setAboutForm({
        overview: about.overview || "",
        mission: about.mission || "",
        vision: about.vision || "",
        corePillars: Array.isArray(about.corePillars) ? about.corePillars : [""],
      });

      // Partners
      const partnersRes = await axios.get(`${API_BASE}/partners/all-partners`, config);
      const partnerList = partnersRes.data || [];
      setPartners(partnerList);
      partnerList.forEach(p => p.logo && loadImageWithAuth(p.logo, `partner-${p.id}`));

      // Leadership
      const leadersRes = await axios.get(`${API_BASE}/leadership/leaders`, config);
      const leaderList = leadersRes.data || [];
      setLeaders(leaderList);
      leaderList.forEach(l => l.photo && loadImageWithAuth(l.photo, `leader-${l.id}`));

    } catch (err) {
      Swal.fire("Error", "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ABOUT: Pure JSON POST (your controller uses @RequestBody)
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire("Success", "About section saved!", "success");
      loadData();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save About", "error");
    }
  };

  // PARTNERS: Uses exact NewsAdmin pattern
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    if (!partnerForm.name.trim()) return Swal.fire("Error", "Name required", "error");

    const dataObj = { name: partnerForm.name, website: partnerForm.website || "" };
    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify(dataObj)], { type: "application/json" }));
    if (partnerForm.logoFile) fd.append("file", partnerForm.logoFile);

    try {
      if (editingPartnerId) {
        // No PUT endpoint → delete + recreate
        await axios.delete(`${API_BASE}/partners/delete/${editingPartnerId}`, getAuthHeaders());
        const res = await axios.post(`${API_BASE}/partners/create-partner`, fd, getMultipartHeaders());
        const newP = res.data?.data || res.data;
        setPartners(prev => prev.filter(p => p.id !== editingPartnerId));
        setPartners(prev => [newP, ...prev]);
        loadImageWithAuth(newP.logo, `partner-${newP.id}`);
        Swal.fire("Updated", "Partner replaced", "success");
      } else {
        const res = await axios.post(`${API_BASE}/partners/create-partner`, fd, getMultipartHeaders());
        const newP = res.data?.data || res.data;
        setPartners(prev => [newP, ...prev]);
        loadImageWithAuth(newP.logo, `partner-${newP.id}`);
        Swal.fire("Success", "Partner added!", "success");
      }

      setPartnerForm({ name: "", website: "", logoFile: null });
      setEditingPartnerId(null);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save partner", "error");
    }
  };

  const deletePartner = async (id) => {
    if (!(await Swal.fire({ title: "Delete?", icon: "warning", showCancelButton: true }).then(r => r.isConfirmed))) return;
    try {
      await axios.delete(`${API_BASE}/partners/delete/${id}`, getAuthHeaders());
      setPartners(prev => prev.filter(p => p.id !== id));
      Swal.fire("Deleted", "Partner removed", "success");
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  // LEADERSHIP: Exact same as NewsAdmin
  const handleLeaderSubmit = async (e) => {
    e.preventDefault();
    if (!leaderForm.fullName.trim()) return Swal.fire("Error", "Name required", "error");

    const dataObj = {
      name: leaderForm.fullName,
      role: leaderForm.position,
      bio: leaderForm.bio,
    };

    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify(dataObj)], { type: "application/json" }));
    if (leaderForm.photoFile) fd.append("file", leaderForm.photoFile);

    try {
      if (editingLeaderId) {
        await axios.put(`${API_BASE}/leadership/update/${editingLeaderId}`, fd, getMultipartHeaders());
        setLeaders(prev => prev.map(l => l.id === editingLeaderId ? { ...l, ...leaderForm } : l));
        Swal.fire("Updated", "Leader updated", "success");
      } else {
        const res = await axios.post(`${API_BASE}/leadership/register`, fd, getMultipartHeaders());
        const newL = res.data?.data || res.data;
        setLeaders(prev => [newL, ...prev]);
        loadImageWithAuth(newL.photo, `leader-${newL.id}`);
        Swal.fire("Success", "Leader added!", "success");
      }

      setLeaderForm({ fullName: "", position: "", bio: "", photoFile: null });
      setEditingLeaderId(null);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save leader", "error");
    }
  };

  const deleteLeader = async (id) => {
    if (!(await Swal.fire({ title: "Delete leader?", icon: "warning", showCancelButton: true }).then(r => r.isConfirmed))) return;
    try {
      await axios.delete(`${API_BASE}/leadership/delete/${id}`, getAuthHeaders());
      setLeaders(prev => prev.filter(l => l.id !== id));
      Swal.fire("Deleted", "Leader removed", "success");
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  const glassButton = "px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-md text-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-95";
  const editBtn = `${glassButton} text-blue-700 font-semibold`;
  const deleteBtn = `${glassButton} text-red-700 font-semibold`;

  if (loading) return <div className="p-8 text-center text-xl">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">About Administration</h1>

      <div className="mb-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="flex flex-wrap gap-2 p-4 border-b bg-gray-50">
          {["overview", "partners", "leadership"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-md font-medium transition ${activeTab === tab
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Company Overview</h2>
                <textarea
                  className="w-full p-3 border rounded h-32 resize-none"
                  value={aboutForm.overview}
                  onChange={e => setAboutForm({ ...aboutForm, overview: e.target.value })}
                  placeholder="Company overview..."
                />
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block font-semibold mb-2">Mission</label>
                    <textarea
                      className="w-full p-3 border rounded h-28 resize-none"
                      value={aboutForm.mission}
                      onChange={e => setAboutForm({ ...aboutForm, mission: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Vision</label>
                    <textarea
                      className="w-full p-3 border rounded h-28 resize-none"
                      value={aboutForm.vision}
                      onChange={e => setAboutForm({ ...aboutForm, vision: e.target.value })}
                    />
                  </div>
                </div>
                <button onClick={saveAbout} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                  Save About Section
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Core Pillars</h3>
                <div className="space-y-3">
                  {aboutForm.corePillars.map((p, i) => (
                    <div key={i} className="flex gap-3">
                      <input
                        className="flex-1 p-3 border rounded"
                        value={p}
                        onChange={e => {
                          const updated = [...aboutForm.corePillars];
                          updated[i] = e.target.value;
                          setAboutForm({ ...aboutForm, corePillars: updated });
                        }}
                      />
                      <button
                        onClick={() => setAboutForm({
                          ...aboutForm,
                          corePillars: aboutForm.corePillars.filter((_, idx) => idx !== i)
                        })}
                        className={deleteBtn}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setAboutForm({
                      ...aboutForm,
                      corePillars: [...aboutForm.corePillars, ""]
                    })}
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                  >
                    Add Pillar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Partners & Leadership — same beautiful UI as before */}
          {/* ... (rest of the UI is unchanged and perfect) */}
          {activeTab === "partners" && (
            <div>
              <form onSubmit={handlePartnerSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">{editingPartnerId ? "Edit (Replace)" : "Add"} Partner</h2>
                <input className="w-full p-3 border rounded mb-3" placeholder="Name" value={partnerForm.name}
                  onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} />
                <input className="w-full p-3 border rounded mb-3" placeholder="Website (optional)" value={partnerForm.website}
                  onChange={e => setPartnerForm({ ...partnerForm, website: e.target.value })} />
                <input type="file" accept="image/*" className="mb-4"
                  onChange={e => setPartnerForm({ ...partnerForm, logoFile: e.target.files?.[0] || null })} />
                <div className="flex gap-3">
                  <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg">
                    {editingPartnerId ? "Replace" : "Add"} Partner
                  </button>
                  {editingPartnerId && (
                    <button type="button" onClick={() => {
                      setEditingPartnerId(null);
                      setPartnerForm({ name: "", website: "", logoFile: null });
                    }} className="bg-gray-500 text-white px-6 py-3 rounded-lg">Cancel</button>
                  )}
                </div>
              </form>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {partners.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-lg shadow text-center">
                    {previewMap[`partner-${p.id}`] ? (
                      <img src={previewMap[`partner-${p.id}`]} alt={p.name} className="w-28 h-28 object-contain mx-auto mb-4" />
                    ) : <div className="w-28 h-28 bg-gray-200 rounded mx-auto mb-4" />}
                    <h3 className="font-bold text-xl">{p.name}</h3>
                    {p.website && <a href={p.website} target="_blank" rel="noreferrer" className="text-blue-600 text-sm block mb-4">{p.website}</a>}
                    <div className="flex justify-center gap-3">
                      <button onClick={() => {
                        setEditingPartnerId(p.id);
                        setPartnerForm({ name: p.name, website: p.website || "", logoFile: null });
                      }} className={editBtn}>Edit</button>
                      <button onClick={() => deletePartner(p.id)} className={deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "leadership" && (
            <div>
              <form onSubmit={handleLeaderSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">{editingLeaderId ? "Edit" : "Add"} Leader</h2>
                <input className="w-full p-3 border rounded mb-3" placeholder="Full Name" value={leaderForm.fullName}
                  onChange={e => setLeaderForm({ ...leaderForm, fullName: e.target.value })} />
                <input className="w-full p-3 border rounded mb-3" placeholder="Position" value={leaderForm.position}
                  onChange={e => setLeaderForm({ ...leaderForm, position: e.target.value })} />
                <textarea className="w-full p-3 border rounded h-32 mb-3" placeholder="Bio" value={leaderForm.bio}
                  onChange={e => setLeaderForm({ ...leaderForm, bio: e.target.value })} />
                <input type="file" accept="image/*" className="mb-4"
                  onChange={e => setLeaderForm({ ...leaderForm, photoFile: e.target.files?.[0] || null })} />
                <div className="flex gap-3">
                  <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg">
                    {editingLeaderId ? "Update" : "Add"} Leader
                  </button>
                  {editingLeaderId && (
                    <button type="button" onClick={() => {
                      setEditingLeaderId(null);
                      setLeaderForm({ fullName: "", position: "", bio: "", photoFile: null });
                    }} className="bg-gray-500 text-white px-6 py-3 rounded-lg">Cancel</button>
                  )}
                </div>
              </form>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {leaders.map(l => (
                  <div key={l.id} className="bg-white p-6 rounded-lg shadow text-center">
                    {previewMap[`leader-${l.id}`] ? (
                      <img src={previewMap[`leader-${l.id}`]} alt={l.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4" />
                    ) : <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4" />}
                    <h3 className="font-bold text-xl">{l.name}</h3>
                    <p className="text-gray-600 mb-2">{l.role}</p>
                    <p className="text-sm text-gray-700 mb-4">{l.bio}</p>
                    <div className="flex justify-center gap-3">
                      <button onClick={() => {
                        setEditingLeaderId(l.id);
                        setLeaderForm({ fullName: l.name, position: l.role, bio: l.bio || "", photoFile: null });
                      }} className={editBtn}>Edit</button>
                      <button onClick={() => deleteLeader(l.id)} className={deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}