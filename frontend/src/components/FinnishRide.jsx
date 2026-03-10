import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaMapMarker,
  FaMoneyBillWave,
  FaTimes,
} from "react-icons/fa";

const FinishRide = ({ ride, setFinishRidePanel }) => {
  const navigate = useNavigate();

  const endRide = async () => {
    try {
      if (!ride?.id) {
        alert("Ride ID is missing. Cannot end the ride.");
        console.error("❌ ride.id is missing:", ride);
        return;
      }

      console.log("🚗 rideId being sent:", ride.id);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/end-ride`,
        { rideId: ride.id },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/captain-home");
      }
    } catch (error) {
      console.error(
        "❌ Error ending ride:",
        error.response?.data || error.message
      );
      alert("Failed to end ride. Please try again.");
    }
  };

  return (
    <div className="relative bg-white rounded-t-3xl shadow-xl p-6 max-w-md w-full mx-auto transition-all duration-300">
      {/* Close button */}
      <button
        className="absolute top right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        onClick={() => setFinishRidePanel(false)}
      >
        <FaTimes className="text-xl" />
      </button>

      {/* Header */}
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-left">
        Finish Ride
      </h3>

      {/* Passenger Info */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover border-2 border-green-500"
            src={
              ride?.user?.profileImage ||
              "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            }
            alt="Passenger"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {`${ride?.user?.firstname || ""} ${
                ride?.user?.lastname || ""
              }`.trim() || "Passenger"}
            </h2>
            <p className="text-sm text-gray-500">2.2 KM</p>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="space-y-4 mb-8">
        {/* Pickup */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <FaMapMarkerAlt className="text-xl text-blue-500" />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Pickup</h4>
            <p className="text-sm text-gray-500">
              {ride?.pickup || "Location not specified"}
            </p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <FaMapMarker className="text-xl text-red-500" />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Destination</h4>
            <p className="text-sm text-gray-500">
              {ride?.destination || "Location not specified"}
            </p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <FaMoneyBillWave className="text-xl text-green-500" />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              ₹{ride?.fare || "0"}
            </h4>
            <p className="text-sm text-gray-500">Razorpay</p>
          </div>
        </div>
      </div>

      {/* Finish Ride Button */}
      <button
        onClick={endRide}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
      >
        Finish Ride
      </button>
    </div>
  );
};

export default FinishRide;
