import React, { useState } from 'react';

const samplePins = [
  { id: 1, lat: 43.65107, lng: -79.347015, type: 'cat', description: 'Orange tabby seen near park' },
  { id: 2, lat: 43.6532, lng: -79.3832, type: 'dog', description: 'Small black dog, no collar' },
  { id: 3, lat: 43.656, lng: -79.35, type: 'other', description: 'Parrot sighted in tree' }
];

export default function Map() {
  const [filter, setFilter] = useState('all');

  const filteredPins = filter === 'all'
    ? samplePins
    : samplePins.filter(pin => pin.type === filter);

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 text-white font-semibold">Filter by Animal:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded text-black"
        >
          <option value="all">All</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Fake Map Background */}
      <div className="w-full h-[500px] bg-blue-100 border border-blue-400 rounded relative overflow-hidden shadow-inner">
        <p className="absolute top-2 left-2 text-sm text-gray-600">Map Placeholder</p>

        {filteredPins.map((pin, i) => (
          <div
            key={pin.id}
            className="absolute px-2 py-1 bg-red-500 text-white text-xs rounded shadow"
            style={{
              top: `${(i + 1) * 80}px`,
              left: `${(i + 1) * 100}px`
            }}
            title={pin.description}
          >
            {pin.type.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
