import React from "react";

const LookingForDriver = (props) => {
  // Map vehicleType to corresponding image URLs
  const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

  // Map vehicleType to display names
  const vehicleNames = {
    car: "UberGo",
    moto: "Moto",
    auto: "UberAuto",
  };

  return (
    <div className="relative bg-white rounded-t-3xl shadow-xl p-6 max-w-md w-full mx-auto transition-all duration-300">
      {/* Close button */}
      <button
        className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        onClick={() => props.setVehicleFound(false)}
      >
        <i className="ri-arrow-down-wide-line text-2xl"></i>
      </button>

      {/* Header */}
      <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
        Looking for a Driver
      </h3>

      {/* Content */}
      <div className="space-y-6">
        {/* Vehicle Image and Name */}
        <div className="flex flex-col items-center">
          <img
            className="h-24 rounded-lg object-cover"
            src={vehicleImages[props.vehicleType] || vehicleImages.car} // Fallback to car image if vehicleType is invalid
            alt={vehicleNames[props.vehicleType] || "Vehicle"}
          />
          <h4 className="mt-2 text-lg font-semibold text-gray-800">
            {vehicleNames[props.vehicleType] || "Vehicle"}
          </h4>
        </div>

        {/* Ride Details */}
        <div className="space-y-4">
          {/* Pickup Location */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <i className="ri-map-pin-user-fill text-xl text-blue-500"></i>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">Pickup</h4>
              <p className="text-sm text-gray-500">{props.pickup}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <i className="ri-map-pin-2-fill text-xl text-red-500"></i>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Destination
              </h4>
              <p className="text-sm text-gray-500">{props.destination}</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <i className="ri-currency-line text-xl text-green-500"></i>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                ₹{props.fare[props.vehicleType] || "N/A"}
              </h4>
              <p className="text-sm text-gray-500">Cash Payment</p>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="text-center">
          <p className="text-sm text-gray-800 animate-pulse [animation: color-change 1.5s infinite]">
            Searching for a driver...
          </p>
          <style>{`
            @keyframes color-change {
              0%, 100% { color: #1f2937; }
              50% { color: #6b7280; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
