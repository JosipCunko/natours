"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
const DefaultIcon = () => {
  useEffect(() => {
    // Only execute this code client-side
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  return null;
};

const calculateCenterPoint = (locations) => {
  // If no locations or empty array, return default USA center
  if (!locations || locations.length === 0) {
    return [39.8283, -98.5795]; // Default center of USA
  }

  // Initialize sums for calculating average
  let sumLat = 0;
  let sumLng = 0;

  // Sum up all latitude and longitude values
  locations.forEach((location) => {
    const [lng, lat] = location.coordinates;
    sumLat += lat;
    sumLng += lng;
  });

  // Calculate average to find the center point
  const centerLat = sumLat / locations.length;
  const centerLng = sumLng / locations.length;

  return [centerLat, centerLng];
};

const MapClientSide = ({ locations }) => {
  const centerPoint = calculateCenterPoint(locations);
  const defaultZoom = 6;

  return (
    <div
      id="map"
      style={{
        height: "800px",
        width: "100%",
        marginTop: "0px",
      }}
    >
      {/* Render the map only on client-side */}
      <MapContainer
        center={centerPoint}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <DefaultIcon />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => {
          const [lng, lat] = location.coordinates;

          return (
            <Marker key={location._id} position={[lat, lng]}>
              <Popup>
                <div>
                  <h1>
                    Day {location.day}: {location.description}
                  </h1>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapClientSide;
