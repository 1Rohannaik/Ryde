// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { checkUser } from "../utils/Api";

// Create and export context
export const UserContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await checkUser(); // should call your backend `/check` endpoint
        setUser(fetchedUser);
        setError(null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
        setError("Authentication failed");
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, authLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};


