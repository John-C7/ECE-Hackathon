import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const MapWithRouting = () => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    // Initialize map and store its reference
    mapRef.current = L.map(mapContainerRef.current, {
      center: [51.505, -0.09],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(51.5, -0.09),
        L.latLng(51.51, -0.1),
      ],
      routeWhileDragging: true,
    }).addTo(mapRef.current);

    // Cleanup on component unmount
    return () => {
      if (mapRef.current) {
        if (routingControlRef.current) {
          routingControlRef.current.remove(); // Remove the routing control
          routingControlRef.current = null;
        }
        mapRef.current.remove(); // Remove the map
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} style={{ height: '500px' }}></div>;
};

export default MapWithRouting;
