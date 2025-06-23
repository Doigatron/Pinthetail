import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function Map() {
  const [pins, setPins] = useState([]);
  const [newPin, setNewPin] = useState(null);
  const [formData, setFormData] = useState({ animal: 'cat', notes: '', image: '' });

  // Load pins from localStorage on start
  useEffect(() => {
    const saved = localStorage.getItem('pins');
    if (saved) setPins(JSON.parse(saved));
  }, []);

  // Save pins to localStorage
  useEffect(() => {
    localStorage.setItem('pins', JSON.stringify(pins));
  }, [pins]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setNewPin(e.latlng);
        setFormData({ animal: 'cat', notes: '', image: '' });
      }
    });
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPins([...pins, { ...formData, position: newPin }]);
    setNewPin(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  return (
    <MapContainer center={[43.7, -79.4]} zoom={11} style={{ height: '80vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />

      {pins.map((pin, idx) => (
        <Marker key={idx} position={pin.position}>
          <Popup>
            <strong>{pin.animal.toUpperCase()}</strong><br />
            {pin.notes}<br />
            {pin.image && <img src={pin.image} alt="Pet" style={{ width: '100%', marginTop: '8px' }} />}
          </Popup>
        </Marker>
      ))}

      {newPin && (
        <Marker position={newPin}>
          <Popup>
            <form onSubmit={handleSubmit}>
              <label>Animal:
                <select value={formData.animal} onChange={e => setFormData({ ...formData, animal: e.target.value })}>
                  <option value="cat">Cat</option>
                  <option value="dog">Dog</option>
                  <option value="other">Other</option>
                </select>
              </label><br />
              <label>Notes:
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </label><br />
              <label>Photo:
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label><br />
              <button type="submit">Add Pin</button>
            </form>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Map;
