// src/admin/pages/AboutAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API_BASE = "https://enchanting-expression-production.up.railway.app";

// Endpoints
const ABOUT_GET = `${API_BASE}/api/v1/about/all-about`;
const ABOUT_POST = `${API_BASE}/api/v1/about/register`;

// Partners
const PARTNERS_GET = `${API_BASE}/api/v1/partners/all-partners`;
const PARTNERS_POST = `${API_BASE}/api/v1/partners/register`;

// Regulatory / compliance
const COMPLIANCE_GET = `${API_BASE}/api/v1/compliance/records`;
const COMPLIANCE_POST = `${API_BASE}/api/v1/compliance/register`;

// Leadership
const LEADERS_GET = `${API_BASE}/api/v1/leadership/leaders`;
const LEADERS_POST = `${API_BASE}/api/v1/leadership/leaders`;
const LEADERS_BASE = `${API_BASE}/api/v1/leadership/leaders`;

export default function AboutAdmin() {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  // --- COMPANY OVERVIEW (About)
  const [overview, setOverview] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [pillars, setPillars] = useState([]); // array of {id,title,description}
  const [aboutLoading, setAboutLoading] = useState(false);

  // --- PARTNERS
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);

  // --- REGULATORY / COMPLIANCE
  const [records, setRecords] = useState([]);
  const [complianceLoading, setComplianceLoading] = useState(false);

  // --- LEADERSHIP
  const [leaders, setLeaders] = useState([]);
  const [leadersLoading, setLeadersLoading] = useState(false);

  // UI tab state
  const [activeTab, setActiveTab] = useState("overview"); // overview | pillars | compliance | partners | leadership

  // General fetch helper that includes token when provided
  const authHeaders = (isJson = true) => {
    const h = {};
    if (isJson) h["Content-Type"] = "application/json";
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  };

  // ---------- LOAD initial data ----------
  useEffect(() => {
    // ABOUT: attempt to load mission/vision/pillars/overview
    (async () => {
      setAboutLoading(true);
      try {
        const res = await fetch(ABOUT_GET);
        if (res.ok) {
          const data = await res.json();
          // API might return array(s) or object — try to be flexible
          if (Array.isArray(data) && data.length > 0) {
            // pick the first record as canonical overview if API returns array
            const item = data[0];
            setOverview(item.overview || item.description || overview);
            setMission(item.mission || "");
            setVision(item.vision || "");
            setPillars(item.corePillars?.map((p, i) => ({ id: i + 1, title: p, description: "" })) || []);
          } else if (data && typeof data === "object") {
            setOverview(data.overview || "");
            setMission(data.mission || "");
            setVision(data.vision || "");
            setPillars(data.corePillars?.map((p, i) => ({ id: i + 1, title: p, description: "" })) || []);
          }
        } else {
          // server returned non-OK — fallback silently, admin can edit locally
          console.warn("About GET failed:", res.status);
        }
      } catch (err) {
        console.error("About GET error:", err);
      } finally {
        setAboutLoading(false);
      }
    })();

    // PARTNERS
    (async () => {
      setPartnersLoading(true);
      try {
        const res = await fetch(PARTNERS_GET);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setPartners(data);
          else if (data && data.partners) setPartners(data.partners);
        } else {
          console.warn("Partners GET failed:", res.status);
        }
      } catch (err) {
        console.error("Partners GET error:", err);
      } finally {
        setPartnersLoading(false);
      }
    })();

    // COMPLIANCE
    (async () => {
      setComplianceLoading(true);
      try {
        const res = await fetch(COMPLIANCE_GET);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setRecords(data);
          else if (data && data.records) setRecords(data.records);
        } else {
          console.warn("Compliance GET failed:", res.status);
        }
      } catch (err) {
        console.error("Compliance GET error:", err);
      } finally {
        setComplianceLoading(false);
      }
    })();

    // LEADERS
    (async () => {
      setLeadersLoading(true);
      try {
        const res = await fetch(LEADERS_GET);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setLeaders(data);
          else if (Array.isArray(data?.data)) setLeaders(data.data);
        } else {
          console.warn("Leaders GET failed:", res.status);
        }
      } catch (err) {
        console.error("Leaders GET error:", err);
      } finally {
        setLeadersLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Company Overview / Mission & Vision handlers ----------
  const [overviewEdit, setOverviewEdit] = useState("");
  const [missionEdit, setMissionEdit] = useState("");
  const [visionEdit, setVisionEdit] = useState("");
  useEffect(() => {
    setOverviewEdit(overview);
    setMissionEdit(mission);
    setVisionEdit(vision);
  }, [overview, mission, vision]);

  const saveAbout = async (e) => {
    e?.preventDefault();
    // prefer not to block if no token — show warning
    if (!token) {
      Swal.fire("Unauthorized", "No admin token found. Changes will remain local.", "warning");
      // still update local state
      setOverview(overviewEdit);
      setMission(missionEdit);
      setVision(visionEdit);
      return;
    }

    try {
      const payload = {
        overview: overviewEdit,
        mission: missionEdit,
        vision: visionEdit,
        corePillars: pillars.map((p) => p.title),
      };
      const res = await fetch(ABOUT_POST, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("About save error:", res.status, text);
        throw new Error(`About save failed: ${res.status}`);
      }
      const data = await res.json();
      Swal.fire("Saved", "Company About saved successfully.", "success");
      // reflect locally
      setOverview(overviewEdit);
      setMission(missionEdit);
      setVision(visionEdit);
      // if API returns pillars or updated record, adjust
      if (Array.isArray(data.corePillars)) {
        setPillars(data.corePillars.map((p, i) => ({ id: i + 1, title: p, description: "" })));
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not save About. See console.", "error");
    }
  };

  // Core pillars CRUD (local-first)
  const addPillar = (title, desc) => {
    if (!title?.trim()) return Swal.fire("Error", "Pillar title required", "error");
    const p = { id: Date.now(), title: title.trim(), description: desc || "" };
    setPillars((s) => [p, ...s]);
    Swal.fire("Added", "Pillar added locally.", "success");
  };
  const updatePillar = (id, title, desc) => {
    setPillars((s) => s.map((p) => (p.id === id ? { ...p, title, description: desc } : p)));
    Swal.fire("Updated", "Pillar updated.", "success");
  };
  const deletePillar = (id) => {
    setPillars((s) => s.filter((p) => p.id !== id));
    Swal.fire("Deleted", "Pillar removed.", "success");
  };

  // ---------- Partners handlers ----------
  const addPartner = async (partner) => {
    // partner: { name, website, logoPreview }
    if (!partner?.name?.trim()) return Swal.fire("Error", "Partner name required", "error");

    // local optimistic add
    const created = { id: Date.now(), ...partner };
    setPartners((s) => [created, ...s]);

    // if token and partner endpoint defined, try to persist
    if (token) {
      try {
        const res = await fetch(PARTNERS_POST, {
          method: "POST",
          headers: authHeaders(true),
          body: JSON.stringify({
            name: partner.name,
            website: partner.website,
            logo: partner.logoPreview || "",
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("Partners POST failed:", res.status, text);
        } else {
          const serverObj = await res.json();
          // replace local optimistic item with server item if id returned
          setPartners((s) => s.map((p) => (p.id === created.id ? (serverObj || p) : p)));
        }
      } catch (err) {
        console.error("Partners POST error:", err);
      }
    } else {
      Swal.fire("Notice", "Partner added locally. Provide adminToken to persist.", "info");
    }
  };

  const updatePartner = async (id, payload) => {
    setPartners((s) => s.map((p) => (p.id === id ? { ...p, ...payload } : p)));
    if (token) {
      try {
        const res = await fetch(`${PARTNERS_POST}/${id}`, {
          method: "PUT",
          headers: authHeaders(true),
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("Partners PUT failed:", res.status, text);
          Swal.fire("Error", "Failed to update partner on server", "error");
        } else {
          Swal.fire("Success", "Partner updated.", "success");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deletePartner = async (id) => {
    const ok = await Swal.fire({
      title: "Delete partner?",
      text: "This will remove the partner.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!ok.isConfirmed) return;

    setPartners((s) => s.filter((p) => p.id !== id));
    if (token) {
      try {
        const res = await fetch(`${PARTNERS_POST}/${id}`, {
          method: "DELETE",
          headers: authHeaders(false),
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("Partners DELETE failed:", res.status, text);
          Swal.fire("Error", "Server delete failed", "error");
        } else {
          Swal.fire("Deleted", "Partner removed.", "success");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      Swal.fire("Notice", "Partner removed locally. Provide adminToken to delete on server.", "info");
    }
  };

  // ---------- Compliance handlers ----------
  const addRecord = async (record) => {
    // record = { title, description, file (File), imagePreview }
    if (!record?.title?.trim()) return Swal.fire("Error", "Title required", "error");

    const created = { id: Date.now(), ...record };
    setRecords((s) => [created, ...s]);

    if (token) {
      try {
        // If backend expects multipart/form-data (likely for file), send FormData
        const form = new FormData();
        form.append("title", record.title);
        form.append("description", record.description || "");
        if (record.file) form.append("file", record.file);
        if (record.image) form.append("image", record.image);

        const res = await fetch(COMPLIANCE_POST, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form,
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("Compliance POST failed:", res.status, text);
        } else {
          const serverObj = await res.json();
          setRecords((s) => s.map((r) => (r.id === created.id ? (serverObj || r) : r)));
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      Swal.fire("Notice", "Record added locally. Provide adminToken to persist.", "info");
    }
  };

  const updateRecord = async (id, payload) => {
    setRecords((s) => s.map((r) => (r.id === id ? { ...r, ...payload } : r)));
    if (token) {
      try {
        const form = new FormData();
        if (payload.title) form.append("title", payload.title);
        if (payload.description) form.append("description", payload.description);
        if (payload.file) form.append("file", payload.file);
        if (payload.image) form.append("image", payload.image);

        const res = await fetch(`${COMPLIANCE_POST}/${id}`, {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form,
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("Compliance PUT failed:", res.status, text);
        } else {
          Swal.fire("Success", "Record updated.", "success");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteRecord = async (id) => {
    const ok = await Swal.fire({
      title: "Delete record?",
      text: "This will remove the record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!ok.isConfirmed) return;

    setRecords((s) => s.filter((r) => r.id !== id));
    if (token) {
      try {
        const res = await fetch(`${COMPLIANCE_POST}/${id}`, {
          method: "DELETE",
          headers: authHeaders(false),
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("Compliance DELETE failed:", res.status, text);
        } else {
          Swal.fire("Deleted", "Record removed.", "success");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ---------- Leadership handlers ----------
  const addLeader = async (payload) => {
    if (!payload?.fullName?.trim()) return Swal.fire("Error", "Name required", "error");
    const created = { id: Date.now(), name: payload.fullName, role: payload.position, bio: payload.bio, photo: payload.photo };
    setLeaders((s) => [created, ...s]);

    if (!token) {
      Swal.fire("Notice", "Leader added locally. Provide adminToken to persist.", "info");
      return;
    }

    try {
      const res = await fetch(LEADERS_POST, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({
          name: payload.fullName,
          role: payload.position,
          bio: payload.bio,
          photo: payload.photo || "",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Leaders POST failed:", res.status, text);
        throw new Error("Leader create failed");
      }
      const serverObj = await res.json();
      setLeaders((s) => s.map((l) => (l.id === created.id ? serverObj : l)));
      Swal.fire("Success", "Leader created.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not create leader on server.", "error");
    }
  };

  const updateLeader = async (id, payload) => {
    setLeaders((s) => s.map((l) => (l.id === id ? { ...l, ...payload } : l)));
    if (!token) {
      Swal.fire("Notice", "Leader updated locally. Provide adminToken to persist.", "info");
      return;
    }
    try {
      const res = await fetch(`${LEADERS_BASE}/${id}`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify({
          name: payload.fullName,
          role: payload.position,
          bio: payload.bio,
          photo: payload.photo || "",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Leaders PUT failed:", res.status, text);
        Swal.fire("Error", "Could not update leader on server.", "error");
      } else {
        Swal.fire("Success", "Leader updated.", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLeader = async (id) => {
    const ok = await Swal.fire({
      title: "Delete leader?",
      text: "This will remove the leader permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!ok.isConfirmed) return;

    setLeaders((s) => s.filter((l) => l.id !== id));
    if (!token) {
      Swal.fire("Notice", "Leader removed locally. Provide adminToken to remove on server.", "info");
      return;
    }
    try {
      const res = await fetch(`${LEADERS_BASE}/${id}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Leaders DELETE failed:", res.status, text);
        Swal.fire("Error", "Could not delete leader on server.", "error");
      } else {
        Swal.fire("Deleted", "Leader removed.", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- UI: small subcomponents for forms (inline) ----------
  // NOTE: these are simple forms using local state; they call the above handlers.

  // Company Overview form JSX
  const OverviewPanel = () => {
    const [localOverview, setLocalOverview] = useState(overviewEdit || "");
    const [localMission, setLocalMission] = useState(missionEdit || "");
    const [localVision, setLocalVision] = useState(visionEdit || "");
    useEffect(() => {
      setLocalOverview(overviewEdit);
      setLocalMission(missionEdit);
      setLocalVision(visionEdit);
    }, [overviewEdit, missionEdit, visionEdit]);

    return (
      <div className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOverviewEdit(localOverview);
            setMissionEdit(localMission);
            setVisionEdit(localVision);
            saveAbout();
          }}
        >
          <label className="font-semibold block mb-1">Company Overview</label>
          <textarea
            value={localOverview}
            onChange={(e) => setLocalOverview(e.target.value)}
            className="w-full p-3 border rounded h-28"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="font-semibold block mb-1">Mission</label>
              <textarea
                value={localMission}
                onChange={(e) => setLocalMission(e.target.value)}
                className="w-full p-3 border rounded h-24"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Vision</label>
              <textarea
                value={localVision}
                onChange={(e) => setLocalVision(e.target.value)}
                className="w-full p-3 border rounded h-24"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Save About
            </button>
            <button
              type="button"
              onClick={() => {
                setLocalOverview(overview);
                setLocalMission(mission);
                setLocalVision(vision);
              }}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Core Pillars */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Core Pillars</h3>
          <PillarsEditor pillars={pillars} onAdd={addPillar} onUpdate={updatePillar} onDelete={deletePillar} />
        </div>
      </div>
    );
  };

  function PillarsEditor({ pillars, onAdd, onUpdate, onDelete }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [editing, setEditing] = useState(null);
    useEffect(() => {
      setTitle("");
      setDesc("");
    }, [pillars]);

    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editing) {
              onUpdate(editing, title, desc);
              setEditing(null);
            } else onAdd(title, desc);
            setTitle("");
            setDesc("");
          }}
        >
          <div className="flex gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Pillar title"
              className="flex-1 p-2 border rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 rounded">
              {editing ? "Update" : "Add"}
            </button>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-2 border rounded mt-2"
          />
        </form>

        <div className="mt-4 space-y-2">
          {pillars.length === 0 ? (
            <p className="text-sm text-gray-500">No pillars defined.</p>
          ) : (
            pillars.map((p) => (
              <div key={p.id} className="bg-white p-3 rounded shadow flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{p.title}</h4>
                  {p.description && <p className="text-sm text-gray-600">{p.description}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setEditing(p.id);
                      setTitle(p.title);
                      setDesc(p.description || "");
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button onClick={() => onDelete(p.id)} className="text-red-600 text-sm">
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

  // Partners panel - local form state and handler
  const PartnersPanel = () => {
    const [q, setQ] = useState("");
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");

    const onLogo = (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setLogoFile(f);
      setLogoPreview(URL.createObjectURL(f));
    };

    const submitPartner = (e) => {
      e.preventDefault();
      addPartner({ name, website, logoPreview, logoFile });
      setName("");
      setWebsite("");
      setLogoFile(null);
      setLogoPreview("");
    };

    const filtered = partners.filter((p) => p.name?.toLowerCase().includes(q.toLowerCase()));

    return (
      <div>
        <form onSubmit={submitPartner} className="bg-white p-4 rounded shadow space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Partner name" className="p-2 border rounded col-span-2" />
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website (optional)" className="p-2 border rounded" />
          </div>

          <div>
            <input type="file" accept="image/*" onChange={onLogo} />
            {logoPreview && <img src={logoPreview} alt="logo" className="h-20 mt-2 object-contain" />}
          </div>

          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Partner</button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setWebsite("");
                setLogoFile(null);
                setLogoPreview("");
              }}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mt-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search partners..." className="w-full p-2 border rounded mb-3" />
          <div className="space-y-3">
            {partnersLoading && <p>Loading partners…</p>}
            {filtered.length === 0 && !partnersLoading ? (
              <p className="text-sm text-gray-500">No partners found.</p>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{p.name}</h4>
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600">
                        {p.website}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    {p.logo && <img src={p.logo} alt={p.name} className="h-12 object-contain" />}
                    <button onClick={() => updatePartner(p.id, p)} className="text-blue-600 text-sm">
                      Edit
                    </button>
                    <button onClick={() => deletePartner(p.id)} className="text-red-600 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Compliance panel
  const CompliancePanel = () => {
    // local new record state
    const [q, setQ] = useState("");
    const [newRec, setNewRec] = useState({ title: "", description: "", file: null, image: null, imagePreview: "" });
    const [editingId, setEditingId] = useState(null);
    const [editRec, setEditRec] = useState(null);

    const onFile = (e) => {
      const f = e.target.files?.[0];
      if (!f) return setNewRec((s) => ({ ...s, file: null }));
      setNewRec((s) => ({ ...s, file: f, fileName: f.name }));
    };
    const onImage = (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setNewRec((s) => ({ ...s, image: f, imagePreview: URL.createObjectURL(f) }));
    };

    const submit = (e) => {
      e.preventDefault();
      addRecord(newRec);
      setNewRec({ title: "", description: "", file: null, image: null, imagePreview: "" });
    };

    const filtered = records.filter((r) => r.title?.toLowerCase().includes(q.toLowerCase()));

    return (
      <div>
        <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
          <input value={newRec.title} onChange={(e) => setNewRec((s) => ({ ...s, title: e.target.value }))} placeholder="Title" className="w-full p-2 border rounded" />
          <textarea value={newRec.description} onChange={(e) => setNewRec((s) => ({ ...s, description: e.target.value }))} placeholder="Description" className="w-full p-2 border rounded" />
          <div>
            <label className="font-semibold">Upload Document (PDF)</label>
            <input type="file" accept=".pdf" onChange={onFile} />
            <label className="font-semibold block mt-2">Upload Image</label>
            <input type="file" accept="image/*" onChange={onImage} />
            {newRec.imagePreview && <img src={newRec.imagePreview} alt="preview" className="h-24 mt-2 object-contain" />}
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Record</button>
            <button type="button" onClick={() => setNewRec({ title: "", description: "", file: null, image: null, imagePreview: "" })} className="bg-gray-200 px-4 py-2 rounded">
              Reset
            </button>
          </div>
        </form>

        <div className="mt-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search records..." className="w-full p-2 border rounded mb-3" />
          <div className="space-y-3">
            {complianceLoading && <p>Loading records…</p>}
            {filtered.length === 0 && !complianceLoading ? (
              <p className="text-sm text-gray-500">No records.</p>
            ) : (
              filtered.map((r) => (
                <div key={r.id} className="bg-white p-3 rounded shadow flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{r.title}</h4>
                    {r.description && <p className="text-sm text-gray-600">{r.description}</p>}
                    {r.fileName && <p className="text-sm text-blue-600">📄 {r.fileName}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      className="text-blue-600 text-sm"
                      onClick={() => {
                        setEditingId(r.id);
                        setEditRec(r);
                      }}
                    >
                      Edit
                    </button>
                    <button className="text-red-600 text-sm" onClick={() => deleteRecord(r.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Leadership panel
  const LeadershipPanel = () => {
    const [q, setQ] = useState("");
    const [form, setForm] = useState({ fullName: "", position: "", bio: "", photo: "" });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
      // reset when leaders change
      setForm({ fullName: "", position: "", bio: "", photo: "" });
      setEditId(null);
    }, [leaders]);

    const onPhoto = (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onloadend = () => setForm((s) => ({ ...s, photo: reader.result }));
      reader.readAsDataURL(f);
    };

    const submit = (e) => {
      e.preventDefault();
      if (editId) {
        updateLeader(editId, { fullName: form.fullName, position: form.position, bio: form.bio, photo: form.photo });
      } else {
        addLeader(form);
      }
      setForm({ fullName: "", position: "", bio: "", photo: "" });
      setEditId(null);
    };

    const startEdit = (l) => {
      setEditId(l.id);
      setForm({ fullName: l.name || l.fullName || "", position: l.role || l.position || "", bio: l.bio || "", photo: l.photo || "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const filtered = leaders.filter((l) => (l.name || l.fullName || "").toLowerCase().includes(q.toLowerCase()));

    return (
      <div>
        <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
          <input value={form.fullName} onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))} placeholder="Full name" className="w-full p-2 border rounded" required />
          <input value={form.position} onChange={(e) => setForm((s) => ({ ...s, position: e.target.value }))} placeholder="Position / Role" className="w-full p-2 border rounded" required />
          <textarea value={form.bio} onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))} placeholder="Short bio" className="w-full p-2 border rounded" required />
          <div>
            <label className="block text-sm">Upload photo</label>
            <input type="file" accept="image/*" onChange={onPhoto} />
            {form.photo && <img src={form.photo} alt="preview" className="h-20 mt-2 object-cover rounded" />}
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded">{editId ? "Update Leader" : "Add Leader"}</button>
            <button
              type="button"
              onClick={() => {
                setForm({ fullName: "", position: "", bio: "", photo: "" });
                setEditId(null);
              }}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mt-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leaders..." className="w-full p-2 border rounded mb-3" />
          <div className="space-y-3">
            {leadersLoading && <p>Loading leaders…</p>}
            {filtered.length === 0 && !leadersLoading ? (
              <p className="text-sm text-gray-500">No leaders found.</p>
            ) : (
              filtered.map((l) => (
                <div key={l.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {l.photo ? <img src={l.photo} alt={l.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded-full" />}
                    <div>
                      <h4 className="font-semibold">{l.name || l.fullName}</h4>
                      <p className="text-sm text-gray-600">{l.role || l.position}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => startEdit(l)} className="text-blue-600 text-sm">
                      Edit
                    </button>
                    <button onClick={() => deleteLeader(l.id)} className="text-red-600 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---------- Render with premium tabs/cards (no accordion) ----------
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">About Administration</h1>

      {/* Tabs */}
      <div className="mb-6 bg-white shadow rounded">
        <div className="flex flex-wrap items-center gap-2 p-3 border-b">
          <TabButton label="Overview" id="overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <TabButton label="Core Pillars" id="pillars" active={activeTab === "pillars"} onClick={() => setActiveTab("pillars")} />
          <TabButton label="Compliance" id="compliance" active={activeTab === "compliance"} onClick={() => setActiveTab("compliance")} />
          <TabButton label="Partners" id="partners" active={activeTab === "partners"} onClick={() => setActiveTab("partners")} />
          <TabButton label="Leadership" id="leadership" active={activeTab === "leadership"} onClick={() => setActiveTab("leadership")} />
          <div className="ml-auto text-sm text-gray-500">Premium admin panel — clean & fast</div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (aboutLoading ? <p>Loading…</p> : <OverviewPanel />)}
          {activeTab === "pillars" && <PillarsEditor pillars={pillars} onAdd={addPillar} onUpdate={updatePillar} onDelete={deletePillar} />}
          {activeTab === "compliance" && <CompliancePanel />}
          {activeTab === "partners" && <PartnersPanel />}
          {activeTab === "leadership" && <LeadershipPanel />}
        </div>
      </div>
    </div>
  );
}

/* Small TabButton component for premium look */
function TabButton({ label, id, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-selected={active}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}
