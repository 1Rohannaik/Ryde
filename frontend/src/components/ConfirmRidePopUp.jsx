import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!props.ride?.id) {
      // Changed from _id to id to match your API
      alert("Ride data is missing. Please try again.");
      console.error("Ride object is null or undefined:", props.ride);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ride/start-ride`,
        {
          params: {
            rideId: props.ride.id, // Changed from _id to id
            otp: otp,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate("/captain-riding", { state: { ride: props.ride } });
      }
    } catch (error) {
      console.error("Error starting ride:", error);
      alert("Failed to start ride. Please check the OTP and try again.");
    }
  };

  // Get user data from ride object
  const user = props.ride?.user;

  // Handle name display with fallbacks
  const getUsername = () => {
    if (!user) return "Passenger";
    if (user.fullName) return user.fullName;
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    return "Passenger";
  };

  // Handle profile image with fallback
  const profileImage =
    user?.profileImage ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  // If ride is not available, don't render the popup
  if (!props.ride) {
    return null;
  }

  return (
    <div className="bg-white rounded-t-3xl p-6 shadow-xl max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Confirm Ride</h2>
        <button
          onClick={() => props.setConfirmRidePopupPanel(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close confirmation popup"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      {/* Rider Card */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="h-12 w-12 rounded-full object-cover border-2 border-yellow-400"
              src={profileImage}
              alt={getUsername()}
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{getUsername()}</h3>
            <p className="text-sm text-gray-500">2.2 km away</p>
          </div>
        </div>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          ₹{props.ride?.fare || "N/A"}
        </span>
      </div>

      {/* Trip Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center pt-1">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <div className="w-0.5 h-10 bg-gray-300"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">Pickup Location</h3>
            <p className="text-gray-600 line-clamp-2">
              {props.ride?.pickup || "Location not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="pt-1">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">Destination</h3>
            <p className="text-gray-600 line-clamp-2">
              {props.ride?.destination || "Location not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-blue-50 rounded-lg p-3 mb-6 flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
          <i className="ri-wallet-3-line text-blue-500 text-xl"></i>
        </div>
        <div>
          <p className="text-sm text-gray-500">Payment method</p>
          <p className="font-medium">Cash</p>
        </div>
      </div>

      {/* OTP Form */}
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter OTP
          </label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter 6-digit OTP"
            required
            maxLength="6"
            pattern="\d{6}"
            title="Please enter a 6-digit OTP"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              props.setConfirmRidePopupPanel(false);
              props.setRidePopupPanel(false);
            }}
            className="flex-1 bg-red-500 border border-red-500 text-white font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Confirm Ride
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmRidePopUp;
