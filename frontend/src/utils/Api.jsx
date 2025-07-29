import axios from "axios";

const BASE_URL = "https://ryde-backend-mr2s.onrender.com/api/v1/users";

// SIGNUP
export const signupUser = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

// LOGIN
export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// CHECK SESSION
export const checkUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/check`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Session check failed" };
  }
};

// LOGOUT
export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
};

// ✅ UPLOAD PROFILE IMAGE
export const uploadProfileImage = async (imageFile) => {
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

// ✅ GET PROFILE INFO
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};
