import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 HARD-CODED ADMIN CREDENTIALS
    const ADMIN_EMAIL = "admin@ncthsl.com";
    const ADMIN_PASSWORD = "Ncthsl@123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store fake token
      localStorage.setItem("adminToken", "FAKE_ADMIN_TOKEN");

      Swal.fire("Success", "Login Successful!", "success");

      // Redirect to dashboard
      window.location.href = "/admin/dashboard";
    } else {
      Swal.fire("Error", "Invalid email or password", "error");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <input
          type="email"
          className="w-full p-3 border rounded mb-4"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-3 border rounded mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
