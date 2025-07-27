import React, { useEffect, useRef, useState, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPannel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { socket } = useSocket();
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (user?.id && socket && !hasJoinedRef.current) {
      console.log("🔗 Emitting join:", user.id);
      socket.emit("join", { userId: user.id, userType: "user" });
      hasJoinedRef.current = true;
    }
  }, [user, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = (ride) => {
      setRide(ride);
      setWaitingForDriver(true);
    };

    socket.on("ride-confirmed", handleRideConfirmed);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
    };
  }, [socket]);


useEffect(() => {
  socket.on("ride-started", (ride) => {
    console.log("Ride started:", ride); // Optional: Debug
    setWaitingForDriver(false);
    navigate("/riding", { state: { ride } });
  });

  // Cleanup to avoid duplicate listeners
  return () => {
    socket.off("ride-started");
  };
}, []);


  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/autocomplete`,
        {
          params: { input: value },
          withCredentials: true,
        }
      );
      setPickupSuggestions(response.data);
    } catch (error) {
      console.error("Pickup suggestion error:", error);
      setPickupSuggestions([]);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/autocomplete`,
        {
          params: { input: value },
          withCredentials: true,
        }
      );
      setDestinationSuggestions(response.data);
    } catch (error) {
      console.error("Destination suggestion error:", error);
      setDestinationSuggestions([]);
    }
  };

  const findTrip = async () => {
    if (!pickup || !destination) {
      console.warn("Pickup or destination is empty");
      return;
    }

    // Immediately show vehicle panel without animation
    gsap.killTweensOf(vehiclePanelRef.current);
    vehiclePanelRef.current.style.transform = "translateY(0)";
    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ride/get-fare`,
        {
          params: {
            pickup: encodeURIComponent(pickup),
            destination: encodeURIComponent(destination),
          },
          withCredentials: true,
        }
      );
      setFare(response.data.fare || response.data || {});
    } catch (error) {
      console.error("Get fare error:", error);
      setVehiclePanel(false);
    }
  };

  const createRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/create`,
        {
          pickup,
          destination,
          vehicleType,
        },
        { withCredentials: true }
      );
      setRide(response.data);
    } catch (error) {
      console.error("Create ride error:", error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // GSAP Animations
  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "60%" : "0%",
      padding: panelOpen ? 24 : 0,
      duration: 0.3,
    });
    gsap.to(panelCloseRef.current, {
      opacity: panelOpen ? 1 : 0,
      duration: 0.3,
    });
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanel) {
      // Skip animation when opening
      vehiclePanelRef.current.style.transform = "translateY(0)";
    } else {
      // Keep animation when closing
      gsap.to(vehiclePanelRef.current, {
        y: "100%",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      y: confirmRidePanel ? 0 : "100%",
      duration: 0.2,
      ease: "power2.out",
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      y: vehicleFound ? 0 : "100%",
      duration: 0.2,
      ease: "power2.out",
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      y: waitingForDriver ? 0 : "100%",
      duration: 0.2,
      ease: "power2.out",
    });
  }, [waitingForDriver]);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Header with logo and profile icon */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-5">
        <h1 className="text-2xl font-semibold text-black tracking-wide select-none">
          Ryde
        </h1>
        <button
          onClick={() => navigate("/user-profile")}
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <i className="ri-user-line text-2xl"></i>
        </button>
      </div>

      <div className="h-screen w-screen">{/* <LiveTracking /> */}</div>

      {/* Bottom Sliding Panels */}
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 right-6 top-5 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>

          <form className="relative py-3" onSubmit={submitHandler}>
            <div className="absolute h-16 w-1 top-1/2 -translate-y-1/2 left-5 flex flex-col items-center justify-between">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1 w-full bg-gradient-to-b from-green-500 to-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>

          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>

        {/* Location Search Panel */}
        <div ref={panelRef} className="bg-white h-0">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      {/* Vehicle Panel - Will appear instantly */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-20 bottom-0 bg-white px-3 py-10 pt-12 shadow-lg"
        style={{ transform: "translateY(100%)" }}
      >
        <VehiclePanel
          fare={fare}
          selectVehicle={setVehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      {/* Other panels (keep their animations) */}
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-20 bottom-0 bg-white px-3 py-6 pt-12 shadow-lg"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-20 bottom-0 bg-white px-3 py-6 pt-12 shadow-lg"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-20 bottom-0 bg-white px-3 py-6 pt-12 shadow-lg"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
