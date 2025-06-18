import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Sample pins with different types
const samplePins = [
  { id: 1, lat: 43.65107, lng: -79.347015, type: 'cat', description: 'Orange tabby seen near park' },
  { id: 2, lat: 43.6532, lng: -79.3832, type: 'dog', description: 'Small black dog, no collar' },
  { id: 3, lat: 43.656, lng: -79.35, type: 'other', description: 'Parrot sighted in tree' },
];

export default function Map() {
  const [filter, setFilter] = useState('all');

  const filteredPins = filter === 'all' ? samplePins : samplePins.filter(pin => pin.type === filter);

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="filter" className="text-white font-semibold mr-2">Filter by Animal:</label>
        <select
          id="filter"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="p-2 rounded bg-white text-black"
        >
          <option value="all">All</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Map container with height */}
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={[43.65107, -79.347015]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredPins.map(pin => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]}>
              <Popup>{pin.description}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
