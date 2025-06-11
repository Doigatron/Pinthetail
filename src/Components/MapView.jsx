import React from 'react';
import MapGL from 'react-map-gl';
import MAPBOX_ACCESS_TOKEN from '../services/mapboxConfig';

function MapView() {
  const [viewport, setViewport] = React.useState({
    latitude: 43.6532, // Default to Toronto, Canada (feel free to change)
    longitude: -79.3832,
    zoom: 10
  });

  return (
    <div style={{ height: '90vh' }}>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      />
    </div>
  );
}

export default MapView;
