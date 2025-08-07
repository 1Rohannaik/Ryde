// src/api/captainApi.jsx
import axios from "axios";

const BASE_URL = "http://localhost:4000/api/v1/captain";

// SIGNUP
export const signupCaptain = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "captain signup failed" };
  }
};

// LOGIN
export const loginCaptain = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "captain login failed" };
  }
};

// CHECK SESSION
export const checkCaptain = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/check`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "captain session check failed" };
  }
};

// LOGOUT
export const logoutCaptain = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "captain logout failed" };
  }
};

// GET CAPTAIN PROFILE
export const getCaptainProfile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get captain profile" };
  }
};

// UPLOAD PROFILE IMAGE
export const uploadCaptainProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", imageFile);

    const response = await axios.post(
      `${BASE_URL}/upload-profile-image`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Image upload failed" };
  }
};
