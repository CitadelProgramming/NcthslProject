import React from "react";
import { FiAirplay, FiLayers, FiGlobe } from "react-icons/fi";

export default function OurPartners() {
  const partners = [
    { name: "Quorum Aviation", icon: <FiAirplay className="text-5xl text-[#0A4D2D]" /> },
    { name: "Sea Jewel Energy Ltd", icon: <FiLayers className="text-5xl text-[#0A4D2D]" /> },
    { name: "Mounthill Aviation Ltd", icon: <FiGlobe className="text-5xl text-[#0A4D2D]" /> },
  ];

  return (
    <div className="w-full">

      {/* Header */}
      <section className="bg-[#0A4D2D] text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Our Trusted Partners</h1>
        <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
          We collaborate with leading aviation and energy organizations to drive excellence,
          technical innovation, and operational reliability.
        </p>
      </section>

      {/* Partners Grid */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-8 flex flex-col items-center 
                         justify-center border border-gray-200 hover:shadow-xl 
                         hover:-translate-y-1 transition-all duration-300"
            >
              {partner.icon}
              <h3 className="text-center text-lg font-semibold text-[#0A4D2D] mt-4">
                {partner.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
