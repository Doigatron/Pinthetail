import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const samplePins = [
  { id: 1, lat: 43.7, lng: -79.4, type: 'Cat', color: 'Black', location: 'Toronto', description: 'Small black cat near Queen St.' },
  { id: 2, lat: 43.65, lng: -79.38, type: 'Dog', color: 'Brown', location: 'Toronto', description: 'Brown dog near the park.' },
  { id: 3, lat: 43.68, lng: -79.42, type: 'Other', color: 'White', location: 'Toronto', description: 'White bunny spotted downtown.' },
];

const Map = () => {
  const getInitialFilter = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || '';
  };

  const [selectedType, setSelectedType] = useState(getInitialFilter('type'));
  const [selectedColor, setSelectedColor] = useState(getInitialFilter('color'));
  const [locationQuery, setLocationQuery] = useState(getInitialFilter('location'));

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedType) params.set('type', selectedType);
    if (selectedColor) params.set('color', selectedColor);
    if (locationQuery) params.set('location', locationQuery);
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [selectedType, selectedColor, locationQuery]);

  const filteredPins = samplePins.filter(pin => {
    const matchType = selectedType ? pin.type === selectedType : true;
    const matchColor = selectedColor ? pin.color === selectedColor : true;
    const matchLocation = locationQuery
      ? pin.location.toLowerCase().includes(locationQuery.toLowerCase())
      : true;
    return matchType && matchColor && matchLocation;
  });

  const clearFilters = () => {
    setSelectedType('');
    setSelectedColor('');
    setLocationQuery('');
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ padding: '1rem', background: '#f2f2f2' }}>
        <label>Animal Type: </label>
        <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
          <option value="">All</option>
          <option value="Cat">Cat</option>
          <option value="Dog">Dog</option>
          <option value="Other">Other</option>
        </select>

        <label style={{ marginLeft: '1rem' }}>Color: </label>
        <select onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor}>
          <option value="">All</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Brown">Brown</option>
          <option value="Mixed">Mixed</option>
        </select>

        <label style={{ marginLeft: '1rem' }}>Location: </label>
        <input
          type="text"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          placeholder="Enter city or area"
        />

        <button onClick={clearFilters} style={{ marginLeft: '1rem' }}>Clear Filters</button>
      </div>

      <MapContainer center={[43.7, -79.4]} zoom={12} style={{ height: '90%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {filteredPins.map(pin => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <strong>{pin.type}</strong><br />
              Color: {pin.color}<br />
              Location: {pin.location}<br />
              {pin.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
