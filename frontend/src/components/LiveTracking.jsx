import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issues in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons
const createColorIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const pickupIcon = createColorIcon('green');
const destinationIcon = createColorIcon('red');
const captainIcon = createColorIcon('blue'); // We'll use blue for captain for now

// Component to handle map bounds and recentering
const MapController = ({ position, route, pickup, destination, captainLocation, showRoute }) => {
  const map = useMap();

  useEffect(() => {
    if (showRoute && route && route.length > 0) {
      // Fit bounds to route
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickup && destination) {
       // Fit bounds to pickup and destination
       const bounds = L.latLngBounds([pickup, destination]);
       map.fitBounds(bounds, { padding: [50, 50] });
    } else if (captainLocation) {
       map.setView(captainLocation, 15);
    } else if (position) {
      map.setView(position, 15);
    }
  }, [position, route, pickup, destination, captainLocation, showRoute, map]);

  return null;
};

const LiveTracking = ({ 
  pickupCoords, 
  destinationCoords, 
  routeCoords, 
  captainLocation, 
  showRoute = false 
}) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // Some browsers (like desktop Chrome) violently reject watchPosition if highAccuracy 
    // or tight timeouts are used incorrectly. The safest fallback is a simple watch.
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error(`LiveTracking Geolocation Error (${err.code}):`, err.message);
      },
      { 
        enableHighAccuracy: true,
        maximumAge: 0,
        // Remove timeout entirely. If the browser can't get it, let it wait indefinitely.
        // A timeout simply throws an error and stops trying on some devices.
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore instead of [0,0] ocean
  const center = position || defaultCenter;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={13} // Slightly wider initial zoom
        scrollWheelZoom={true}
        zoomControl={true}
        style={{ height: "80%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User's current position (if no other markers are specified) */}
        {!pickupCoords && !destinationCoords && !captainLocation && (
          <Marker position={center} icon={captainIcon} />
        )}

        {/* Pickup Marker */}
        {pickupCoords && (
          <Marker position={pickupCoords} icon={pickupIcon} />
        )}

        {/* Destination Marker */}
        {destinationCoords && (
          <Marker position={destinationCoords} icon={destinationIcon} />
        )}

        {/* Captain Marker */}
        {captainLocation && (
          <Marker position={captainLocation} icon={captainIcon} />
        )}

        {/* Route Polyline */}
        {showRoute && routeCoords && routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords} 
            color="#111" // Dark color like Uber
            weight={4}
            opacity={0.8}
          />
        )}

        <MapController 
          position={position} 
          route={routeCoords} 
          pickup={pickupCoords} 
          destination={destinationCoords} 
          captainLocation={captainLocation}
          showRoute={showRoute}
        />
      </MapContainer>
    </div>
  );
};

export default LiveTracking;
