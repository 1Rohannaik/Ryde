// src/context/CaptainContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { checkCaptain } from "../utils/CaptainApi";

const CaptainContext = createContext();

export const CaptainAuthProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [captainChecked, setCaptainChecked] = useState(false);

  useEffect(() => {
    const fetchCaptain = async () => {
      try {
        const fetchedCaptain = await checkCaptain();
        setCaptain(fetchedCaptain);
        setError(null);
      } catch (err) {
        console.error("Captain check failed:", err);
        setCaptain(null);
        setError("Captain authentication failed");
      } finally {
        setIsLoading(false);
        setCaptainChecked(true);
      }
    };

    fetchCaptain();
  }, []);

  const updateCaptain = (captainData) => {
    setCaptain(captainData);
  };

  return (
    <CaptainContext.Provider
      value={{
        captain,
        setCaptain,
        isLoading,
        error,
        updateCaptain,
        captainChecked,
      }}
    >
      {children}
    </CaptainContext.Provider>
  );
};

export const useCaptain = () => useContext(CaptainContext);
