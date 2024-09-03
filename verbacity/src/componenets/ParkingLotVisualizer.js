import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './ParkingLotVisualizer.css';

const ParkingLotVisualizerCSV = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    fetch('/EVchargers1.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (result) => {
            const sortedStations = result.data.sort((a, b) => b.Slots - a.Slots);
            setStations(sortedStations);
            setFilteredStations(sortedStations);
          }
        });
      });
  }, []);

  const handleSlotClick = (stationId, slotIndex) => {
    const station = stations.find(s => s.uid === stationId);
    if (station['Available Slots'] <= 0) {
      alert('No slots available.');
      return;
    }

    if (station.slots[slotIndex].isBooked) {
      alert('This slot is already booked.');
      return;
    }

    // Update slot status locally
    station.slots[slotIndex].isBooked = true;
    station['Available Slots'] -= 1;
    setStations([...stations]);
  };

  const selectStation = (station) => {
    const totalSlots = parseInt(station['Slots']);
    const availableSlots = parseInt(station['Available Slots']);
    const slots = Array(totalSlots).fill().map((_, i) => ({
      isBooked: i >= availableSlots
    }));
    shuffleArray(slots);
    station.slots = slots;
    setSelectedStation(station);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleSearchCity = (e) => {
    setSearchCity(e.target.value);
    const filtered = stations.filter(station => station.city.toLowerCase().includes(e.target.value.toLowerCase()));
    setFilteredStations(filtered);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const stationsWithDistance = stations.map(station => ({
          ...station,
          distance: getDistanceFromLatLonInKm(latitude, longitude, station.latitude, station.longitude)
        }));
        const sortedByDistance = stationsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 10);
        setFilteredStations(sortedByDistance);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  return (
    <div className="parking-lot-visualizer">
      <h2>EV Charging Stations</h2>
      {selectedStation ? (
        <>
          <h3>{selectedStation.name}</h3>
          <p>{selectedStation.address}</p>
          <div className="slots-container">
            {selectedStation.slots.map((slot, index) => (
              <div
                key={index}
                className={`slot ${slot.isBooked ? 'booked' : 'available'}`}
                onClick={() => handleSlotClick(selectedStation.uid, index)}
              >
                Slot {index + 1}
              </div>
            ))}
          </div>
          <button onClick={() => setSelectedStation(null)}>Back to Stations List</button>
        </>
      ) : (
        <>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by city"
              value={searchCity}
              onChange={handleSearchCity}
            />
            <button onClick={handleUseLocation}>Use My Location</button>
          </div>
          <div className="stations-list">
            {filteredStations.map(station => (
              <div key={station.uid} className="station-card" onClick={() => selectStation(station)}>
                <h4>{station.name}</h4>
                <p>{station.address}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ParkingLotVisualizerCSV;
