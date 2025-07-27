import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCaptain } from "../context/CaptainContext";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { setCaptain } = useCaptain();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      firstname: firstName,
      lastname: lastName,
      email,
      password,
      vehicleColor,
      vehiclePlate,
      vehicleCapacity: Number(vehicleCapacity),
      vehicleType,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/signup`,
        captainData,
        {
          withCredentials: true, // ✅ Required for cookie-based auth
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain); // ✅ Set context
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Signup failed. Please try again.";
      alert(errorMsg);
    }

    // Clear form
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="py-5 px-5 h-screen flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-black tracking-wide select-none pb-5">
          Ryde
        </h1>

        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">
            What's our Captain's name
          </h3>
          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 text-lg placeholder:text-base"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 text-lg placeholder:text-base"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <h3 className="text-lg font-medium mb-2">
            What's our Captain's email
          </h3>
          <input
            required
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 text-lg placeholder:text-base"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 text-lg placeholder:text-base"
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>

          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 text-lg placeholder:text-base"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
            <select
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 text-lg"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="auto">Auto</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#111] text-white mb-3 rounded-lg px-4 py-2 w-full font-medium"
          >
            Create Captain Account
          </button>
        </form>

        <p className="text-center">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>

      <div>
        <p className="text-[10px] mt-6 leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
