import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapRef = useRef(null);
  const markerGroupRef = useRef(null);
  const [selectedType, setSelectedType] = useState('all');
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const savedPins = JSON.parse(localStorage.getItem('pinthetail_pins')) || [];
    setPins(savedPins);

    mapRef.current = L.map('map').setView([43.6532, -79.3832], 12); // Toronto
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    markerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    displayPins(savedPins);

    mapRef.current.on('click', handleMapClick);

    return () => {
      mapRef.current.off();
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    displayPins(pins);
  }, [selectedType]);

  const displayPins = (pinList) => {
    markerGroupRef.current.clearLayers();

    pinList.forEach((pin) => {
      if (selectedType !== 'all' && pin.type !== selectedType) return;

      const marker = L.marker([pin.lat, pin.lng]);
      const popupContent = `
        <b>${pin.type}</b><br/>
        ${pin.label ? `<b>📍 ${pin.label}</b><br/>` : ''}
        ${pin.description || ''}
        ${pin.image ? `<br/><img src="${pin.image}" alt="pin image" style="max-width:150px; max-height:150px;"/>` : ''}
      `;
      marker.bindPopup(popupContent);
      marker.addTo(markerGroupRef.current);
    });
  };

  const handleMapClick = async (e) => {
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
    setPins(updatedPins);
    localStorage.setItem('pinthetail_pins', JSON.stringify(updatedPins));
    displayPins(updatedPins);
  };

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
          setPins([]);
          displayPins([]);
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
