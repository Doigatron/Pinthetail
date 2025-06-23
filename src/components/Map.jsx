import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapRef = useRef(null);
  const [selectedType, setSelectedType] = useState('all');
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const savedPins = JSON.parse(localStorage.getItem('pinthetail_pins')) || [];
    setPins(savedPins);

    mapRef.current = L.map('map').setView([43.6532, -79.3832], 12); // Toronto by default
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    const addPinToMap = (pin) => {
      const marker = L.marker([pin.lat, pin.lng]).addTo(mapRef.current);
      marker.bindPopup(`<b>${pin.type}</b><br/>${pin.description || ''}`);
    };

    savedPins.forEach((pin) => {
      if (selectedType === 'all' || pin.type === selectedType) {
        addPinToMap(pin);
      }
    });

    const onMapClick = (e) => {
      const type = prompt('Type of animal? (cat, dog, other)');
      if (!type || !['cat', 'dog', 'other'].includes(type.toLowerCase())) return;

      const description = prompt('Describe the sighting (optional):');

      const newPin = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: type.toLowerCase(),
        description,
      };

      const updatedPins = [...pins, newPin];
      localStorage.setItem('pinthetail_pins', JSON.stringify(updatedPins));
      setPins(updatedPins);

      const marker = L.marker([newPin.lat, newPin.lng]).addTo(mapRef.current);
      marker.bindPopup(`<b>${newPin.type}</b><br/>${newPin.description || ''}`).openPopup();
    };

    mapRef.current.on('click', onMapClick);

    return () => {
      mapRef.current.off();
      mapRef.current.remove();
    };
  }, [selectedType]);

  return (
    <>
      <div style={{ margin: '1rem' }}>
        <label htmlFor="filter">Filter pins: </label>
        <select
          id="filter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div id="map" style={{ height: '80vh', width: '100%' }}></div>

      <button
        onClick={() => {
          localStorage.removeItem('pinthetail_pins');
          window.location.reload();
        }}
        style={{
          margin: '1rem',
          padding: '0.5rem 1rem',
          background: '#f4694c',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Clear All Pins
      </button>
    </>
  );
};

export default Map;
