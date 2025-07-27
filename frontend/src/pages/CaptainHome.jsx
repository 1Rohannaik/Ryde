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
      transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [ridePopupPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopupPanelRef.current, {
      transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
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
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-full">
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

      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Background"
        />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      {/* Only show RidePopUp if there's a valid ride */}
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
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
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
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

