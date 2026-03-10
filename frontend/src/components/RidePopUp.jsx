import React from "react";
import { Socket } from "socket.io-client";

const RidePopUp = (props) => {
  const user = props.ride?.user;

  // Improved username handling with fallbacks
  // Improved username handling with the new API response structure
  const getUsername = () => {
    if (!user) return "Passenger";
    if (user.fullName) return user.fullName; // Using fullName from API
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.email) return user.email.split("@")[0]; // Fallback to email prefix
    return "Passenger";
  };

  const confirmRide = async () => {
    const response = await axios.post
  }

  const fullname = getUsername();

  // Fallback for profile image with error handling
  const profileImage =
    user?.profileImage ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <div className="p-5 bg-white rounded-t-2xl shadow-lg max-w-md mx-auto">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">New Ride Request</h3>
        <button
          onClick={() => props.setRidePopupPanel(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close ride popup"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      {/* Rider info card */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                className="h-14 w-14 rounded-full object-cover border-2 border-yellow-400"
                src={profileImage}
                alt={fullname}
                onError={(e) => {
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
              />
              {user?.rating && (
                <div className="absolute -bottom-1 -right-1 bg-white px-1.5 py-0.5 rounded-full shadow-xs flex items-center text-xs font-medium">
                  <i className="ri-star-fill text-yellow-400 mr-0.5"></i>
                  {user.rating.toFixed(1)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {fullname}
              </h2>
              <p className="text-sm text-gray-500">2.2 KM away</p>
            </div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium min-w-[60px] text-center">
            ₹{props.ride?.fare || "--"}
          </div>
        </div>
      </div>

      {/* Trip details */}
      <div className="space-y-4 mb-8">
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

      {/* Payment method */}
      <div className="bg-blue-50 rounded-lg p-3 mb-8 flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg shrink-0">
          <i className="ri-wallet-3-line text-blue-500 text-xl"></i>
        </div>
        <div>
          <p className="text-sm text-gray-500">Payment method</p>
          <p className="font-medium">Cash</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => props.setRidePopupPanel(false)}
          className="flex-1 bg-red-500 border border-red-500 text-white font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={() => {
            props.setConfirmRidePopupPanel(true);
            props.confirmRide();
          }}
          className="flex-1 bg-green-600 text-white font-medium py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          Accept Ride
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
