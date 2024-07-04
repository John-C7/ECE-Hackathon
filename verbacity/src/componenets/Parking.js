import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 12.9716,
  lng: 77.5946
};

const Parking = () => {
  const [parkingData, setParkingData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/parking')
      .then(response => {
        setParkingData(response.data);
      })
      .catch(error => {
        console.error('Error fetching parking data:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Smart Parking Management System - Bangalore</h1>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
        >
          {parkingData.map((parking, index) => (
            <Marker
              key={index}
              position={{ lat: parking.latitude, lng: parking.longitude }}
              onClick={() => setSelected(parking)}
            />
          ))}
          {selected && (
            <InfoWindow
              position={{ lat: selected.latitude, lng: selected.longitude }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <h2>{selected.name}</h2>
                <p>Available Spots: {selected.available_spots}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Parking;
