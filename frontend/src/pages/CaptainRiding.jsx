<<<<<<< HEAD
import React, { useRef, useState, useEffect } from "react";
=======
import React, { useRef, useState } from "react";
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinnishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiveTracking from "../components/LiveTracking";
<<<<<<< HEAD
import { useSocket } from "../context/SocketContext";
import axios from "axios";
=======
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;
<<<<<<< HEAD
  const { socket } = useSocket();
  const [captainLocation, setCaptainLocation] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
=======
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );
<<<<<<< HEAD
  
  useEffect(() => {
    // Get captain coordinates and route on mount
    const fetchRouteData = async () => {
       if (!rideData) return;
       try {
         // Get the token from localStorage or context if you have it.
         // Assuming it's in localStorage under "token"
         const token = localStorage.getItem("token");

         // Geocode pickup
         const pRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/coordinates`, {
           params: { address: rideData.pickup },
           headers: { Authorization: `Bearer ${token}` },
           withCredentials: true,
         });
         const pCoords = pRes.data;
         setPickupCoords(pCoords);
         
         // Add delay for Nominatim rate limits (max 1 hit per second)
         await new Promise(resolve => setTimeout(resolve, 1000));

         // Geocode destination
         const dRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/coordinates`, {
           params: { address: rideData.destination },
           headers: { Authorization: `Bearer ${token}` },
           withCredentials: true,
         });
         const dCoords = dRes.data;
         setDestinationCoords(dCoords);

         // Add delay for ORS rate limits
         await new Promise(resolve => setTimeout(resolve, 1000));

         // Fetch Route
         if (pCoords && dCoords) {
           const rRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/route`, {
             params: { 
               origin: `${pCoords.lat},${pCoords.lng}`, 
               destination: `${dCoords.lat},${dCoords.lng}` 
             },
             headers: { Authorization: `Bearer ${token}` },
             withCredentials: true,
           });
           setRouteCoords(rRes.data);
           setShowRoute(true);
         }
       } catch (error) {
         console.error("Error fetching route block in CaptainRiding:", error);
       }
    };
    
    fetchRouteData();
  }, [rideData]);

  useEffect(() => {
    // Some browsers (like desktop Chrome) violently reject watchPosition if highAccuracy 
    // or tight timeouts are used incorrectly. The safest fallback is a simple watch.
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCaptainLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error(`CaptainRiding Geolocation Error (${err.code}):`, err.message);
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 0,
        // Remove timeout entirely. If the browser can't get it, let it wait indefinitely.
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
=======
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed

  return (
    <div className="h-screen relative flex flex-col justify-end z-10">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <h1 className="text-3xl font-semibold text-black tracking-wide select-none pb-5">
          Ryde
        </h1>
        <Link
          to="/captain-profile"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-user-line"></i>
        </Link>
      </div>

      <div
        className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5
          className="p-1 text-center w-[90%] absolute top-0"
          onClick={() => {}}
        >
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">{"4 KM away"}</h4>
        <button className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>

      <div className="h-screen fixed w-screen top-0 z-[-1]">
<<<<<<< HEAD
        <LiveTracking 
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          routeCoords={routeCoords}
          showRoute={showRoute}
          captainLocation={captainLocation}
        />
=======
        <LiveTracking />
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed
      </div>
    </div>
  );
};

export default CaptainRiding;
