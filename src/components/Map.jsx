import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons in some setups
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function Map() {
  const [pins, setPins] = useState([
    { lat: 43.65107, lng: -79.347015, type: "cat", description: "Grey cat near park" },
    { lat: 43.6532, lng: -79.3832, type: "dog", description: "Small white dog running on street" },
  ]);

  const [newPin, setNewPin] = useState(null);
  const [formData, setFormData] = useState({ type: "cat", description: "" });

  const popupRef = useRef();

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current._source.openPopup();
    }
  }, [newPin]);

  function handleMapClick(latlng) {
    setNewPin(latlng);
    setFormData({ type: "cat", description: "" });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newPin) return;

    const newEntry = {
      lat: newPin.lat,
      lng: newPin.lng,
      type: formData.type,
      description: formData.description,
    };

    setPins(prev => [...prev, newEntry]);
    setNewPin(null); // Clear form after submission
  }

  return (
    <MapContainer
      center={[43.6532, -79.3832]}
      zoom={13}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <ClickHandler onMapClick={handleMapClick} />

      {pins.map((pin, index) => (
        <Marker key={index} position={[pin.lat, pin.lng]}>
          <Popup>
            <strong>{pin.type.toUpperCase()}</strong><br />
            {pin.description}
          </Popup>
        </Marker>
      ))}

      {newPin && (
        <Marker position={[newPin.lat, newPin.lng]}>
          <Popup ref={popupRef}>
            <form onSubmit={handleSubmit}>
              <label>
                Type:<br />
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="cat">Cat</option>
                  <option value="dog">Dog</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <br />
              <label>
                Description:<br />
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <br />
              <button type="submit">Add Pin</button>
            </form>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
