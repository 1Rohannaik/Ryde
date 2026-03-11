import React from "react";

const ConfirmRide = (props) => {
  const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    moto: "https://res.cloudinary.com/dn2hxlyql/image/upload/v1773238923/RydeMoto.webp",
    auto: "https://res.cloudinary.com/dn2hxlyql/image/upload/v1773239616/Uber_Auto_312x208_pixels_Mobile_o8xxrq.png",
  };

  // Map vehicleType to display names
  const vehicleNames = {
    car: "RydeGo",
    moto: "Moto",
    auto: "RydeAuto",
  };

  return (
    <div className="relative bg-white rounded-t-3xl shadow-xl p-6 max-w-md w-full mx-auto transition-all duration-300">
      {/* Close button */}
      <button
        className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        onClick={() => props.setConfirmRidePanel(false)}
      >
        <i className="ri-arrow-down-wide-line text-2xl"></i>
      </button>

      {/* Header */}
      <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
        Confirm Your Ride
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

        {/* Confirm Button */}
        <button
          onClick={() => {
            props.setVehicleFound(true);
            props.setConfirmRidePanel(false);
            props.createRide();
          }}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors duration-200 shadow-md"
        >
          Confirm Ride
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
