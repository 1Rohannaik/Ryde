import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const UserLogout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/logout`,
          {
            withCredentials: true, // ⬅️ Important for cookies
          }
        );

        if (response.status === 200) {
          setUser(null); // ⬅️ Clear user context
          navigate("/login"); // ⬅️ Redirect after logout
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    logout();
  }, [navigate, setUser]);

  return (
    <div className="text-center mt-10 text-lg font-medium">Logging out...</div>
  );
};

export default UserLogout;
