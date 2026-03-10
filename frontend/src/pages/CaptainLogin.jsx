import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("➡️ Attempting login with:", { email, password });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/login`,
        { email, password },
        {
          withCredentials: true, // Send & receive cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Login successful. Server response:", response.data);

      // Don't setCaptain here — just navigate and let context check
      navigate("/captain-home");
    } catch (error) {
      console.error("❌ Login failed:", error?.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div className="absolute top-5 left-5">
        <h1 className="text-2xl font-semibold text-black">Ryde</h1>
      </div>

      <div className="mt-16">
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-3 w-full text-lg placeholder:text-base border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-3 w-full text-lg placeholder:text-base border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="password"
            placeholder="password"
          />

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-lg hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600">
          Join a fleet?{" "}
          <Link to="/captain-signup" className="text-blue-600 hover:underline">
            Register as a Captain
          </Link>
        </p>
      </div>

      <div>
        <Link
          to="/login"
          className="bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-3 w-full text-lg hover:bg-orange-600 transition-colors"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
