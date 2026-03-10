import React, { useState, useEffect } from "react";
import { useCaptain } from "../context/CaptainContext";
import axios from "axios";
import { FaCar, FaUserAlt, FaUsers, FaStar, FaPhoneAlt } from "react-icons/fa";

const CaptainDetails = () => {
  const { captain } = useCaptain();
  const [captainData, setCaptainData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch captain profile data
  useEffect(() => {
    const fetchCaptainProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captain/profile`,
          {
            withCredentials: true,
          }
        );
        setCaptainData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch captain details");
        setIsLoading(false);
      }
    };

    fetchCaptainProfile();
  }, []);

  // Loading state
  if (isLoading || !captain || !captainData) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  // Safely access fields with fallbacks
  const fullName = captainData.fullName || "Unknown Captain";
  const profileImage = captainData.profileImage || null;
  const vehiclePlate = captainData.vehiclePlate || "ABC-1234";
  const vehicleCapacity = captainData.vehicleCapacity || 4;
  const rating = captainData.rating || 4.8;
  const email = captainData.email || "";
  const vehicleType = captainData.vehicleType || "SUV"; // Fallback to "SUV" if not provided

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between">
        {/* Left: Captain Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="text-lg font-semibold text-gray-800 capitalize">
              {fullName}
            </h4>
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-xs font-medium text-gray-700">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FaCar className="mr-2 text-gray-400" />
              <span className="uppercase font-medium">{vehiclePlate}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaUsers className="mr-2 text-gray-400" />
              <span>{vehicleCapacity} seats</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaPhoneAlt className="mr-2 text-gray-400" />
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* Right: Captain Photo */}
        <div className="ml-4">
          {profileImage ? (
            <div className="relative">
              <img
                className="h-16 w-16 rounded-full object-cover border-2 border-green-500"
                src={profileImage}
                alt={fullName}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaUserAlt className="text-white text-xs" />
              </div>
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-100 border-2 border-green-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">
                {fullName.charAt(0) || "C"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-xs text-gray-500">Total Rides</p>
          <p className="font-semibold text-gray-800">247</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Years Driving</p>
          <p className="font-semibold text-gray-800">5</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Vehicle Type</p>
          <p className="font-semibold text-gray-800 capitalize">
            {vehicleType.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
