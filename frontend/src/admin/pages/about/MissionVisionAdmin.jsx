import React, { useState } from "react";
import Swal from "sweetalert2";

export default function MissionVisionAdmin() {
  // Mock initial mission & vision
  const [mission, setMission] = useState(
    "To deliver world-class aviation technical services with excellence, integrity, and innovation."
  );

  const [vision, setVision] = useState(
    "To become Africa’s leading aviation maintenance and technical support provider."
  );

  const [missionInput, setMissionInput] = useState(mission);
  const [visionInput, setVisionInput] = useState(vision);

  const handleSave = (e) => {
    e.preventDefault();

    if (!missionInput.trim() || !visionInput.trim()) {
      Swal.fire("Error", "Both Mission and Vision fields are required", "error");
      return;
    }

    setMission(missionInput);
    setVision(visionInput);

    Swal.fire("Success", "Mission & Vision updated successfully!", "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mission & Vision Management</h1>

      {/* Mission & Vision Form */}
      <form
        onSubmit={handleSave}
        className="bg-white p-4 shadow rounded max-w-3xl space-y-4"
      >
        {/* Mission */}
        <div>
          <label className="font-semibold block mb-1">Edit Mission</label>
          <textarea
            value={missionInput}
            onChange={(e) => setMissionInput(e.target.value)}
            className="w-full p-3 border rounded h-32"
            placeholder="Enter mission..."
          />
        </div>

        {/* Vision */}
        <div>
          <label className="font-semibold block mb-1">Edit Vision</label>
          <textarea
            value={visionInput}
            onChange={(e) => setVisionInput(e.target.value)}
            className="w-full p-3 border rounded h-32"
            placeholder="Enter vision..."
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded w-full"
        >
          Save Changes
        </button>
      </form>

      {/* Preview Section */}
      <div className="bg-white p-4 shadow rounded mt-6 max-w-3xl space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Current Mission</h2>
          <p className="whitespace-pre-line">{mission}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Current Vision</h2>
          <p className="whitespace-pre-line">{vision}</p>
        </div>
      </div>
    </div>
  );
}
