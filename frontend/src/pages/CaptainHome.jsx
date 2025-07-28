import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { useCaptain } from "../context/CaptainContext";
import { useSocket } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { captain } = useCaptain();
  const { socket } = useSocket();

  // Emit 'join' event when captain is available
  useEffect(() => {
    if (captain && socket) {
      console.log("Emitting join for captain:", captain.id);
      socket.emit("join", { userId: captain.id, userType: "captain" });
    }
  }, [captain, socket]);

  // Send location every 10 seconds
  useEffect(() => {
    let intervalId;

    const sendLocation = () => {
      if (!navigator.geolocation || !captain || !socket) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log("📍 Sending captain location:", latitude, longitude);

          socket.emit("update-location-captain", {
            userId: captain.id,
            location: { latitude, longitude },
          });
        },
        (error) => {
          console.error("❌ Error getting location:", error);
        }
      );
    };

    if (captain && socket) {
      sendLocation(); // Send immediately
      intervalId = setInterval(sendLocation, 10000); // every 10s
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [captain, socket]);

  // Listen for new ride via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log("🚖 New ride received via socket:", data);
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  // Debug captain context
  useEffect(() => {
    console.log("Captain from context:", captain);
  }, [captain]);

  async function confirmRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/confirm`,
        { rideId: ride?.id },
        { withCredentials: true }
      );

      if (response.data?.ride) {
        setRide(response.data.ride);
      }

      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error("Ride confirmation failed:", error);
    }
  }

  useGSAP(() => {
    gsap.to(ridePopupPanelRef.current, {
      y: ridePopupPanel ? 0 : "100%",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [ridePopupPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopupPanelRef.current, {
      y: confirmRidePopupPanel ? 0 : "100%",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [confirmRidePopupPanel]);

  if (!captain) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading captain data...
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-black tracking-wide select-none">
          Ryde
        </h1>
        <Link
          to="/captain-profile"
          className="h-12 w-12 bg-white flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <i className="text-xl font-medium ri-user-line"></i>
        </Link>
      </div>

      {/* Map Section with proper pointer events handling */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
        <div style={{ height: "60%", width: "100%", pointerEvents: "auto" }}>
          <LiveTracking />
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-10 h-2/5 p-6 bg-white rounded-t-3xl shadow-lg">
        <CaptainDetails />
      </div>

      {/* Ride Popup */}
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-20 bottom-0 bg-white px-3 py-10 pt-12 shadow-lg"
        style={{ transform: "translateY(100%)" }}
      >
        {ride && (
          <RidePopUp
            ride={ride}
            setRidePopupPanel={setRidePopupPanel}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            confirmRide={confirmRide}
          />
        )}
      </div>

      {/* Confirm Ride Popup */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full z-20 bottom-0 bg-white px-3 py-10 pt-12 shadow-lg"
        style={{ transform: "translateY(100%)" }}
      >
        {ride && (
          <ConfirmRidePopUp
            ride={ride}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            setRidePopupPanel={setRidePopupPanel}
          />
        )}
      </div>
    </div>
  );
};

export default CaptainHome;
