// Full upgraded FooterAdmin.jsx with full control matching frontend footer
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function FooterAdmin() {
  const [brand, setBrand] = useState({
    title: "Nigeria Customs Technical & Hangar Services Limited",
    description:
      "A premier aviation support and maintenance organization providing world-class engineering, operational support, and mission-critical aviation services for national security and civil aviation advancement.",
    logo: "../assets/logo.png",
  });

  const [office, setOffice] = useState({
    address: "Customs Technical Hangar, NAF Base, Kaduna, Nigeria",
    phone: "+234 903 578 3766",
    email: "info@ncthsl.gov.ng",
    hours: {
      monFri: "8:00 AM – 5:00 PM",
      sat: "10:00 AM – 3:00 PM",
      sun: "Closed",
    },
  });

  const [services, setServices] = useState([
    "Fixed Based Operations",
    "General Aviation Maintenance",
    "Technical Support & Engineering",
    "UAV Operations & Leasing",
  ]);

  const [socials, setSocials] = useState([
    { id: 1, platform: "Facebook", url: "https://web.facebook.com/profile.php?id=61581852695826" },
    { id: 2, platform: "Twitter", url: "https://x.com/CustomsHangar?s=20" },
    { id: 3, platform: "Instagram", url: "https://www.instagram.com/customshangarservices" },
    { id: 4, platform: "LinkedIn", url: "#" },
  ]);

  const [newsletter, setNewsletter] = useState({
    text: "Subscribe to receive aviation updates, technical insights, and announcements.",
  });

  const [legal, setLegal] = useState({
    rights: `© ${new Date().getFullYear()} Nigeria Customs Technical Hangar Services Limited. All Rights Reserved.`,
    authorization:
      "Authorized under the Federal Republic of Nigeria – Aviation Standards & Compliance Directorate.",
    credit: "Designed by NCTHSL ICT",
  });

  const editArrayItem = (arr, setArr, index) => {
    Swal.fire({
      title: "Edit Item",
      input: "text",
      inputValue: arr[index],
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        const updated = [...arr];
        updated[index] = res.value;
        setArr(updated);
        Swal.fire("Updated", "Item updated successfully", "success");
      }
    });
  };

  const deleteArrayItem = (arr, setArr, index) => {
    const updated = arr.filter((_, i) => i !== index);
    setArr(updated);
    Swal.fire("Deleted", "Item removed", "success");
  };

  const addService = () => {
    Swal.fire({
      title: "Add New Service",
      input: "text",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed && res.value.trim()) {
        setServices([res.value, ...services]);
      }
    });
  };

  const addSocial = () => {
    Swal.fire({
      title: "Add Social Platform",
      html: `
        <input id="platform" class="swal2-input" placeholder="Platform (e.g., Facebook)">
        <input id="url" class="swal2-input" placeholder="URL">`,
      preConfirm: () => ({
        platform: document.getElementById("platform").value,
        url: document.getElementById("url").value,
      }),
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        setSocials([{ id: Date.now(), ...res.value }, ...socials]);
      }
    });
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Footer Management (Full Control)</h1>

      {/* BRAND SECTION */}
      <div className="bg-white shadow p-5 rounded">
        <h2 className="text-xl font-semibold mb-4">Brand Info</h2>

        <div className="space-y-3">
          <input
            type="text"
            value={brand.title}
            onChange={(e) => setBrand({ ...brand, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            value={brand.description}
            onChange={(e) => setBrand({ ...brand, description: e.target.value })}
            className="w-full p-2 border rounded h-24"
          />
        </div>
      </div>

      {/* OFFICE SECTION */}
      <div className="bg-white shadow p-5 rounded">
        <h2 className="text-xl font-semibold mb-4">Office & Contact Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={office.address}
            onChange={(e) => setOffice({ ...office, address: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={office.phone}
            onChange={(e) => setOffice({ ...office, phone: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={office.email}
            onChange={(e) => setOffice({ ...office, email: e.target.value })}
            className="p-2 border rounded"
          />
        </div>

        <h3 className="font-semibold mt-4">Working Hours</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={office.hours.monFri}
            onChange={(e) => setOffice({ ...office, hours: { ...office.hours, monFri: e.target.value } })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={office.hours.sat}
            onChange={(e) => setOffice({ ...office, hours: { ...office.hours, sat: e.target.value } })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={office.hours.sun}
            onChange={(e) => setOffice({ ...office, hours: { ...office.hours, sun: e.target.value } })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div className="bg-white shadow p-5 rounded">
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <button onClick={addService} className="bg-green-600 text-white px-4 py-2 rounded mb-4">
          Add Service
        </button>

        <div className="space-y-2">
          {services.map((s, i) => (
            <div key={i} className="flex justify-between items-center p-2 border rounded">
              {s}
              <div className="space-x-3">
                <button onClick={() => editArrayItem(services, setServices, i)} className="text-blue-600 text-sm">
                  Edit
                </button>
                <button onClick={() => deleteArrayItem(services, setServices, i)} className="text-red-600 text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOCIAL LINKS SECTION */}
      <div className="bg-white shadow p-5 rounded">
        <h2 className="text-xl font-semibold mb-4">Social Links</h2>

        <button onClick={addSocial} className="bg-green-600 text-white px-4 py-2 rounded mb-4">
          Add Social Platform
        </button>

        <div className="space-y-2">
          {socials.map((s, i) => (
            <div key={s.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <p className="font-semibold">{s.platform}</p>
                <p className="text-sm text-gray-500">{s.url}</p>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => {
                    Swal.fire({
                      title: `Edit ${s.platform}`,
                      html: `
                        <input id="platform" class="swal2-input" value="${s.platform}">
                        <input id="url" class="swal2-input" value="${s.url}">`,
                      preConfirm: () => ({
                        platform: document.getElementById("platform").value,
                        url: document.getElementById("url").value,
                      }),
                    }).then((res) => {
                      if (res.isConfirmed) {
                        const updated = [...socials];
                        updated[i] = { ...updated[i], ...res.value };
                        setSocials(updated);
                      }
                    });
                  }}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteArrayItem(socials, setSocials, i)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEWSLETTER SECTION */}
      <div className="bg-white shadow p-5 rounded">
        <h2 className="text-xl font-semibold mb-4">Newsletter Text</h2>

        <textarea
          value={newsletter.text}
          onChange={(e) => setNewsletter({ text: e.target.value })}
          className="w-full p-2 border rounded h-24"
        />
      </div>

      {/* LEGAL SECTION */}
      <div className="bg-white shadow p-5 rounded">
        <h2 className="text-xl font-semibold mb-4">Legal Information</h2>

        <input
          type="text"
          value={legal.rights}
          onChange={(e) => setLegal({ ...legal, rights: e.target.value })}
          className="w-full p-2 border rounded mb-3"
        />

        <textarea
          value={legal.authorization}
          onChange={(e) => setLegal({ ...legal, authorization: e.target.value })}
          className="w-full p-2 border rounded h-20 mb-3"
        />

        <input
          type="text"
          value={legal.credit}
          onChange={(e) => setLegal({ ...legal, credit: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}
