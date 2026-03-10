import React from "react";

const VehiclePanel = ({
  fare,
  selectVehicle,
  setConfirmRidePanel,
  setVehiclePanel,
}) => {
  console.log("VehiclePanel rendered with props:", {
    fare,
    selectVehicle,
    setConfirmRidePanel,
    setVehiclePanel,
  });

  // Fallback if fare is undefined or incomplete
  if (!fare || !fare.auto || !fare.car || !fare.moto) {
    console.warn("Fare data incomplete:", fare);
    return (
      <div className="relative bg-white rounded-t-3xl shadow-xl p-6 max-w-md w-full mx-auto transition-all duration-300">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={() => {
            console.log("Closing VehiclePanel");
            setVehiclePanel(false);
          }}
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Choose a Vehicle
        </h3>
        <p className="text-sm text-center animate-pulse duration-1000 text-gray-800 [animation: color-change 1.5s infinite]">
          Looking for ride...
        </p>
        <style>{`
          @keyframes color-change {
            0%, 100% { color: #1f2937; }
            50% { color: #6b7280; }
          }
        `}</style>
      </div>
    );
  }

  const handleSelectVehicle = (type) => {
    console.log("Selecting vehicle:", type);
    selectVehicle(type);
    setConfirmRidePanel(true);
    setVehiclePanel(false);
  };

  return (
    <div className="relative bg-white rounded-t-3xl shadow-xl p-6 max-w-md w-full mx-auto transition-all duration-300">
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        onClick={() => {
          console.log("Closing VehiclePanel");
          setVehiclePanel(false);
        }}
      >
        <i className="ri-close-line text-2xl"></i>
      </button>

      {/* Header */}
      <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
        Choose a Vehicle
      </h3>

      {/* Vehicle Options */}
      <div className="space-y-4">
        {/* UberGo */}
        <div
          onClick={() => handleSelectVehicle("car")}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        >
          <img
            className="h-11 w-16 object-cover rounded-lg"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt="RydeGo"
          />

          <div className="ml-4 flex-1">
            <h4 className="text-lg font-semibold text-gray-800">
              RydeGo{" "}
              <span className="text-gray-600 text-sm">
                <i className="ri-user-3-fill"></i> 4
              </span>
            </h4>
            <p className="text-sm text-gray-500">2 mins away</p>
            <p className="text-xs text-gray-400">Affordable, compact rides</p>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            ₹{fare.car || "N/A"}
          </h2>
        </div>

        {/* Moto */}
        <div
          onClick={() => handleSelectVehicle("moto")}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        >
          <img
            className="h-14 w-14 object-cover rounded-lg"
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
            alt="Moto"
          />
          <div className="ml-4 flex-1">
            <h4 className="text-lg font-semibold text-gray-800">
              Moto{" "}
              <span className="text-gray-600 text-sm">
                <i className="ri-user-3-fill"></i> 1
              </span>
            </h4>
            <p className="text-sm text-gray-500">3 mins away</p>
            <p className="text-xs text-gray-400">Affordable motorcycle rides</p>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            ₹{fare.moto || "N/A"}
          </h2>
        </div>

        {/* UberAuto */}
        <div
          onClick={() => handleSelectVehicle("auto")}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        >
          <img
            className="h-14 w-14 object-cover rounded-lg"
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
            alt="RydeAuto"
          />
          <div className="ml-4 flex-1">
            <h4 className="text-lg font-semibold text-gray-800">
              RydeAuto{" "}
              <span className="text-gray-600 text-sm">
                <i className="ri-user-3-fill"></i> 3
              </span>
            </h4>
            <p className="text-sm text-gray-500">3 mins away</p>
            <p className="text-xs text-gray-400">Affordable auto rides</p>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            ₹{fare.auto || "N/A"}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default VehiclePanel;
