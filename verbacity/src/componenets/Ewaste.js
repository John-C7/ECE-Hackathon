import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Ewaste.css';


const generateRandomCoords = (lat, lng) => {
  const r = 0.045; // 5km 
  const y0 = lat;
  const x0 = lng;
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  const newX = x / Math.cos(y0);

  return { lat: y + y0, lng: newX + x0 };
};


const mockData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  lat: 12.9716 + (Math.random() - 0.5) * 0.1,
  lng: 77.5946 + (Math.random() - 0.5) * 0.1,
  ward: `Ward ${i + 1}`,
  schedule: `Day ${i + 1} 9 AM - 12 PM`
}));


const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const Ewaste = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setVehicles(mockData);

    // Simulate live tracking by updating locations every 3 seconds
    const interval = setInterval(() => {
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle => {
          const { lat, lng } = generateRandomCoords(vehicle.lat, vehicle.lng);
          return {
            ...vehicle,
            lat: vehicle.lat + (lat - vehicle.lat) * 0.1,
            lng: vehicle.lng + (lng - vehicle.lng) * 0.1
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ewaste-container">
      <h1>E-Waste Collection Vehicle Tracker</h1>
      <MapContainer center={[12.9716, 77.5946]} zoom={12} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {vehicles.map(vehicle => (
          <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]} icon={customIcon}>
            <Popup>
              <div>
                <h3>Ward: {vehicle.ward}</h3>
                <p>Schedule: {vehicle.schedule}</p>
                <p>Current Location: [{vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}]</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Ewaste;
