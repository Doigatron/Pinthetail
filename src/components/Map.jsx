import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const AddMarkerOnClick = ({ setNewPin }) => {
  useMapEvents({
    click(e) {
      setNewPin({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: "cat",
        description: "",
      });
    },
  });
  return null;
};

const Map = ({ filter }) => {
  const [pins, setPins] = useState([
    {
      lat: 43.65,
      lng: -79.38,
      type: "cat",
      description: "Grey cat near Queen St.",
    },
    {
      lat: 43.66,
      lng: -79.4,
      type: "dog",
      description: "Lost golden retriever",
    },
    {
      lat: 43.67,
      lng: -79.36,
      type: "other",
      description: "Parrot spotted in tree",
    },
  ]);

  const [newPin, setNewPin] = useState(null);

  const handleSave = () => {
    if (!newPin.description.trim()) return;
    setPins((prev) => [...prev, newPin]);
    setNewPin(null);
  };

  return (
    <div className="h-[600px] w-full z-0">
      <MapContainer
        center={[43.65, -79.38]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        <AddMarkerOnClick setNewPin={setNewPin} />

        {/* Existing Pins */}
        {pins
          .filter((pin) => filter === "all" || pin.type === filter)
          .map((pin, index) => (
            <Marker key={index} position={[pin.lat, pin.lng]}>
              <Popup>
                <strong>{pin.type}</strong>: {pin.description}
              </Popup>
            </Marker>
          ))}

        {/* New Pin Form */}
        {newPin && (
          <Marker position={[newPin.lat, newPin.lng]}>
            <Popup
              closeOnClick={false}
              onClose={() => setNewPin(null)}
              autoClose={false}
            >
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Animal Type:</label>
                <select
                  value={newPin.type}
                  onChange={(e) =>
                    setNewPin({ ...newPin, type: e.target.value })
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option value="cat">Cat</option>
                  <option value="dog">Dog</option>
                  <option value="other">Other</option>
                </select>

                <label className="text-sm font-medium">Description:</label>
                <textarea
                  value={newPin.description}
                  onChange={(e) =>
                    setNewPin({ ...newPin, description: e.target.value })
                  }
                  className="border px-2 py-1 rounded"
                  rows={3}
                />

                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
