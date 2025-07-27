import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutCaptain = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captain/logout`,
          {
            withCredentials: true, // send cookies with the request
          }
        );

        if (response.status === 200) {
          // Only clear this if you're actually using it elsewhere
          localStorage.removeItem("captain-token");
          navigate("/captain-login");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        navigate("/captain-login");
      }
    };

    logoutCaptain();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      Logging you out...
    </div>
  );
};

export default CaptainLogout;
