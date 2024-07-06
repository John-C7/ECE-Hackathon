import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const center = [12.9716, 77.5946];

const Parking = () => {
  const [parkingData, setParkingData] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [bookingHours, setBookingHours] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:5000/parking')
      .then(response => {
        setParkingData(response.data);
      })
      .catch(error => {
        console.error('Error fetching parking data:', error);
      });
  }, []);

  const handleBook = (id) => {
    axios.post('http://localhost:5000/book', { id, hours: bookingHours })
      .then(response => {
        alert(response.data.message);
        
        axios.get('http://localhost:5000/parking')
          .then(response => {
            setParkingData(response.data);
          });
      })
      .catch(error => {
        console.error('Error booking parking:', error);
        alert('Booking failed');
      });
  };

  return (
    <div className="App">
      <h1>Smart Parking Management System - Bangalore</h1>
      <MapContainer center={center} zoom={12} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {parkingData.map((parking, index) => (
          <Marker key={index} position={[parking.latitude, parking.longitude]}>
            <Popup>
              <h2>{parking.name}</h2>
              <p>Available Spots: {parking.available_spots}</p>
              <input
                type="number"
                min="1"
                value={bookingHours}
                onChange={(e) => setBookingHours(Number(e.target.value))}
                placeholder="Enter hours"
              />
              <button onClick={() => handleBook(parking.id)}>Book</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Parking;
