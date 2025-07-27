import React, { useState, useEffect, useRef } from "react";
import {
  LogOut,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getUserProfile, uploadProfileImage } from "../utils/Api";

const UserProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    profileImageUrl: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getUserProfile();
        setUserData({
          fullName: response.fullName,
          email: response.email,
          profileImageUrl: response.profileImage || "",
        });
        setProfileImage(response.profileImage || "");
      } catch (error) {
        setApiError(error.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Trigger hidden file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Upload Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadStatus("Uploading profile image...");

      // Upload to server
      const response = await uploadProfileImage(file);

      // Check if server returned a valid image URL
      if (response.profileImage && typeof response.profileImage === "string") {
        // Append timestamp to image URL to prevent caching
        const timestamp = new Date().getTime();
        const newImageUrl = `${response.profileImage}?t=${timestamp}`;

        // Update state with the new image URL
        setProfileImage(newImageUrl);
        setUserData((prev) => ({
          ...prev,
          profileImageUrl: newImageUrl,
        }));

        setUploadStatus("Image uploaded successfully!");
      } else {
        // Fallback: refetch profile if server response is invalid
        const profileResponse = await getUserProfile();
        const newImageUrl = profileResponse.profileImage
          ? `${profileResponse.profileImage}?t=${new Date().getTime()}`
          : "";
        setProfileImage(newImageUrl);
        setUserData((prev) => ({
          ...prev,
          profileImageUrl: newImageUrl,
        }));
        setUploadStatus("Image uploaded, but had to refetch profile.");
      }

      // Clear success message after 3 seconds
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Error state
  if (apiError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-4 font-medium">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-md border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
        <div className="w-6"></div>
      </div>

      {/* Body */}
      <div className="p-6 max-w-md mx-auto">
        {/* Profile Picture */}
        <div className="relative flex flex-col items-center mb-8">
          <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white to-gray-100 z-0"></div>
          <div className="relative z-10 mb-4">
            <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl bg-gray-200 overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-300">
                  <ImageIcon className="h-12 w-12 text-gray-500" />
                </div>
              )}
              {/* Edit Icon Overlay */}
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-all duration-200 shadow-md"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Upload Status Message */}
          {uploadStatus && (
            <div
              className={`text-center text-sm mt-3 flex items-center justify-center gap-1 ${
                uploadStatus.includes("success") ||
                uploadStatus.includes("refetch")
                  ? "text-green-500"
                  : "text-red-500"
              } animate-fade-in`}
            >
              <span className="flex items-center gap-1 animate-pulse">
                <CheckCircle className="h-4 w-4" />
                {uploadStatus}
              </span>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Personal Info */}
        <div className="mb-6 bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Full Name</p>
              <p className="text-gray-900 font-medium">{userData.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
              <p className="text-gray-900 font-medium">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          <LogOut className="h-5 w-5" />
          {isLoggingOut ? "Signing Out..." : "Sign Out"}
        </button>

        {/* Privacy & Security */}
        <div className="text-center text-xs text-gray-500 pt-8">
          <h4 className="font-semibold mb-1 flex items-center justify-center gap-1">
            <span>🔒</span> Privacy & Security
          </h4>
          <p>
            Your information is secure with us. We never share your data with
            third parties, and all details are encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
