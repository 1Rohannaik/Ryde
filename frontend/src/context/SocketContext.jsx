// SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
    // Extract the origin (e.g., http://localhost:3000) from the full base URL
    const socketUrl = new URL(import.meta.env.VITE_BASE_URL).origin;

    const newSocket = io(socketUrl, {
=======
    const newSocket = io("https://ryde-x7ux.onrender.com", {
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Properly disconnect on unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketProvider;
