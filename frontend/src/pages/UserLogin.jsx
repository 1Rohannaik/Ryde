import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please check your credentials.");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      {/* Logo positioned at top left */}
      <div className="absolute top-5 left-5">
        <h1 className="text-3xl font-semibold text-black tracking-wide select-none pb-5">
          Ryde
        </h1>
      </div>

      <div className="mt-16">
        {" "}
        {/* Added margin to prevent content overlap */}
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-3 w-full text-lg placeholder:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-3 w-full text-lg placeholder:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-lg hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600">
          New here?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create new Account
          </Link>
        </p>
      </div>

      <div>
        <Link
          to="/captain-login"
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-3 w-full text-lg hover:bg-green-600 transition-colors"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
