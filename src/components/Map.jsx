import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LOCAL_STORAGE_KEY = "pinthetail-pins";

function LocationMarker({ onAdd }) {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const type = prompt("What type of animal? (cat, dog, other)");
      const desc = prompt("Describe the sighting:");

      if (type && desc) {
        onAdd({ lat, lng, type, desc });
      }
    },
  });
  return null;
}

export default function Map() {
  const [pins, setPins] = useState([]);

  // Load saved pins from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setPins(JSON.parse(saved));
    }
  }, []);

  // Save pins to localStorage when they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pins));
  }, [pins]);

  const addPin = (newPin) => {
    setPins([...pins, newPin]);
  };

  return (
    <MapContainer center={[43.7, -79.4]} zoom={10} style={{ height: "80vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker onAdd={addPin} />
      {pins.map((pin, index) => (
        <Marker key={index} position={[pin.lat, pin.lng]}>
          <Popup>
            <b>{pin.type.toUpperCase()}</b><br />
            {pin.desc}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
