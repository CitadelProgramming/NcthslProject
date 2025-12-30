// src/layout/GlassButton.jsx
import { Link } from "react-router-dom";

export default function GlassButton({ 
  text, 
  to, 
  onClick, 
  variant = "green", // default
  className = "" 
}) {
  const variants = {
    green: "from-emerald-600 to-green-700",
    red: "from-red-600 to-rose-700",
    gray: "from-gray-600 to-slate-700",
  };

  const glowColors = {
    green: "#10b981, #059669, #047857",
    red: "#dc2626, #b91c1c, #991b1b",
    gray: "#6b7280, #4b5563, #374151",
  };

  const glow = glowColors[variant] || glowColors.green;

  return (
    <button
      onClick={onClick}
      className={`ncthsl-glass-btn ncthsl-glass-btn--${variant} ${className}`}
      style={{
        '--glow-colors': glow,
      }}
    >
      <span className="relative z-10">{text}</span>
    </button>
  );
}