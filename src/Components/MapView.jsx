import React from 'react';
import MapGL from 'react-map-gl';
import MAPBOX_ACCESS_TOKEN from '../services/mapboxConfig';

function MapView() {
  const [viewport, setViewport] = React.useState({
    latitude: 43.6532, // Default to Toronto, Canada (
