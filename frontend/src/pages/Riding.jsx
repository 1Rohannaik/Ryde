import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Load Stripe publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleRideEnded = () => {
      navigate("/home");
    };

    socket.on("ride-ended", handleRideEnded);

    return () => {
      socket.off("ride-ended", handleRideEnded);
    };
  }, [socket]);

  const handlePayment = async () => {
    const stripe = await stripePromise;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/payment/payment-ride",
        {
          amount: ride?.fare * 100, // in paise
          rideId: ride?.id,
          captainId: ride?.captain?.id,
        }
      );

      const session = res.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Stripe redirect error:", result.error.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full"
        >
          <i className="ri-arrow-left-line text-xl text-gray-700"></i>
        </button>
        <div className="w-10"></div>
      </div>

      {/* Map Section */}
      <div className="h-2/5 bg-gray-200">
        <LiveTracking />
      </div>

      {/* Ride Info Section */}
      <div className="h-3/5 p-6 rounded-t-3xl bg-white shadow-lg -mt-6 relative z-10">
        {/* Captain Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl shadow-sm mb-6">
          <div className="relative">
            <img
              className="h-14 w-14 object-cover rounded-full border-2 border-white shadow-md"
              src={
                ride?.captain?.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Driver"
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-white px-1.5 py-0.5 rounded-full shadow-xs flex items-center text-xs font-medium">
              <i className="ri-star-fill text-yellow-400 mr-0.5"></i>
              4.9
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 capitalize">
              {`${ride?.captain?.firstname || ""} ${
                ride?.captain?.lastname || ""
              }`.trim()}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {ride?.captain?.vehiclePlate || "XX00 XX0000"}
              </span>
              <span className="text-gray-500 text-sm">
                {ride?.captain?.vehicleType || "Vehicle"}
              </span>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-4 mb-6">
          <div className="relative pl-8">
            <div className="relative pb-6 opacity-0 h-0">
              <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white -ml-2.5 z-10"></div>
              <div className="absolute left-0 top-4 h-full w-0.5 bg-gray-300 ml-1.5"></div>
              <div className="pl-4">
                <h3 className="font-medium text-gray-800">Pickup Location</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {ride?.pickup || "Location not specified"}
                </p>
              </div>
            </div>

            {/* Destination */}
            <div className="relative">
              <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-red-500 border-2 border-white -ml-2.5 z-10"></div>
              <div className="pl-4">
                <h3 className="font-medium text-gray-800">Drop-off Point</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {ride?.destination || "Location not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Fare and Payment */}
          <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Trip Fare</p>
              <p className="text-xl font-bold text-gray-800">
                ₹{ride?.fare ?? "--"}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <i className="ri-wallet-3-line text-green-500"></i>
                <span className="text-sm font-medium">Stripe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePayment}
            className="flex-1 bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Riding;
