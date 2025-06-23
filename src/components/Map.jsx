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

    mapRef.current = L.map('map').setView([43.6532, -79.3832], 12); // Toronto
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    const addPinToMap = (pin) => {
      const marker = L.marker([pin.lat, pin.lng]).addTo(mapRef.current);
      const popupContent = `
        <b>${pin.type}</b><br/>
        ${pin.label ? `<b>📍 ${pin.label}</b><br/>` : ''}
        ${pin.description || ''}
        ${pin.image ? `<br/><img src="${pin.image}" alt="pin image" style="max-width:150px; max-height:150px;"/>` : ''}
      `;
      marker.bindPopup(popupContent);
    };

    savedPins.forEach((pin) => {
      if (selectedType === 'all' || pin.type === selectedType) {
        addPinToMap(pin);
      }
    });

    const onMapClick = async (e) => {
      const type = prompt('Type of animal? (cat, dog, other)');
      if (!type || !['cat', 'dog', 'other'].includes(type.toLowerCase())) return;

      const label = prompt('Enter nearest street/city name (optional):');
      const description = prompt('Describe the sighting (optional):');
      const image = prompt('Paste image URL (optional):');

      if (image) {
        const confirmPreview = window.confirm(`Preview image?\n${image}`);
        if (!confirmPreview) return;
      }

      const newPin = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: type.toLowerCase(),
        label,
        description,
        image,
      };

      const updatedPins = [...pins, newPin];
      localStorage.setItem('pinthetail_pins', JSON.stringify(updatedPins));
      setPins(updatedPins);

      const marker = L.marker([newPin.lat, newPin.lng]).addTo(mapRef.current);
      const popupContent = `
        <b>${newPin.type}</b><br/>
        ${newPin.label ? `<b>📍 ${newPin.label}</b><br/>` : ''}
        ${newPin.description || ''}
        ${newPin.image ? `<br/><img src="${newPin.image}" alt="pin image" style="max-width:150px; max-height:150px;"/>` : ''}
      `;
      marker.bindPopup(popupContent).openPopup();
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
