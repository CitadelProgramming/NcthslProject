import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = {
      email: email,
      password: password,
    };

    try {
      setLoading(true);

      const response = await axios.post(
        "https://enchanting-expression-production.up.railway.app/api/v1/auth/authenticate",
        payload
      );

      //backend returns JWT tokens in "token" or "accessToken"
      const token = response.data?.token || response.data?.accessToken;

      if (!token) {
        Swal.fire("Error", "Invalid response from server", "error");
        return;
      }

      // Save token to localStorage
      localStorage.setItem("adminToken", token);

      Swal.fire("Success", "Login Successful!", "success");

      // Redirect to admin dashboard
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error("Login error:", error);

      Swal.fire(
        "Login Failed",
        error.response?.data?.message || "Invalid email or password",
        "error"
      );
    } finally {
      setLoading(false);
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
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
