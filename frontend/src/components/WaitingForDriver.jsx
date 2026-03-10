import React from "react";

const WaitingForDriver = ({ ride, waitingForDriver }) => {
  const captain = ride?.captain;

  return (
    <div className="bg-white rounded-t-3xl shadow-lg p-6 pt-4 relative">
      {/* Close Button */}
      <button
        onClick={() => waitingForDriver(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        aria-label="Close"
      >
        {/* <i className="ri-close-line text-2xl"></i> */}
      </button>

      {/* Driver Info Card */}
      <div className="flex items-center justify-between">
        {/* Left Section: Info */}
        <div className="flex flex-col gap-1">
          {/* Name + Rating */}
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 capitalize">
              {`${captain?.firstname || ""} ${
                captain?.lastname || ""
              }`.trim() || "Driver Name"}
            </h2>
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              <i className="ri-star-fill text-yellow-500 text-sm" />
              4.8
            </div>
          </div>

          {/* Vehicle Plate */}
          <div className="text-sm text-gray-700 flex items-center gap-2">
            <i className="ri-car-line text-gray-500"></i>
            {captain?.vehiclePlate || "KA123"}
          </div>

          {/* Seats */}
          <div className="text-sm text-gray-700 flex items-center gap-2">
            <i className="ri-group-line text-gray-500"></i>
            {captain?.seats || "4"} seats
          </div>

          {/* Email */}
          <div className="text-sm text-gray-700 flex items-center gap-2">
            <i className="ri-mail-line text-gray-500"></i>
            {captain?.email || "example@gmail.com"}
          </div>
        </div>

        {/* Profile Image */}
        <div className="relative">
          <img
            src={
              captain?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Driver"
            className="h-16 w-16 object-cover rounded-full border-2 border-green-500 shadow-md"
            onError={(e) => {
              e.target.src =
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
            }}
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
      </div>

      {/* Ride Info */}
      <div className="mt-6 space-y-4">
        {/* Pickup */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md shadow-sm">
          <i className="ri-map-pin-user-fill text-xl text-blue-500 mt-1"></i>
          <div>
            <h3 className="font-medium text-sm text-gray-800">
              Pickup Location
            </h3>
            <p className="text-gray-600 text-sm">
              {ride?.pickup || "Not Available"}
            </p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md shadow-sm">
          <i className="ri-map-pin-2-fill text-xl text-red-500 mt-1"></i>
          <div>
            <h3 className="font-medium text-sm text-gray-800">Drop Location</h3>
            <p className="text-gray-600 text-sm">
              {ride?.destination || "Not Available"}
            </p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md shadow-sm">
          <i className="ri-currency-line text-xl text-green-600 mt-1"></i>
          <div>
            <h3 className="text-md font-semibold text-gray-900">
              ₹{ride?.fare ?? "--"}
            </h3>
            <p className="text-sm text-gray-600">Cash Payment</p>
          </div>
        </div>

        {/* OTP */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
          <p className="text-sm font-medium text-gray-700">OTP</p>
          <span className="text-xl font-bold text-green-600 tracking-wider">
            {ride?.otp || "****"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
