import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issues in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = () => {
  const [streetsData, setStreetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreetsData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/streets");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStreetsData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStreetsData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }

  return (
    <MapContainer
      center={[33.6844, 73.0479]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {streetsData.map((street, index) => {
        const { coordinates, name, location } = street;
        const positions = coordinates.map((coord) => [coord.lat, coord.lng]);

        // Only keep the first and last position for markers
        const startPosition = positions[0];
        const endPosition = positions[positions.length - 1];

        return (
          <React.Fragment key={index}>
            <Marker position={startPosition}>
              <Popup>
                <b>{name}</b>
                <br />
                Start - {location}
              </Popup>
            </Marker>
            <Marker position={endPosition}>
              <Popup>
                <b>{name}</b>
                <br />
                End - {location}
              </Popup>
            </Marker>
            <Polyline positions={positions} color="blue" />
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
