import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ParkingLotVisualizer.css';

const ParkingLotVisualizerCSV = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [searchVehicleType, setSearchVehicleType] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetch('/EVchargers11.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (result) => {
            const sortedStations = result.data.sort((a, b) => b.Slots - a.Slots);
            setStations(sortedStations);
            setFilteredStations(sortedStations);
            setTimeout(() => setLoading(false), 1000); // Delay to show loading state
          }
        });
      });
  }, []);

  const handleSlotClick = (stationId, slotIndex) => {
    const station = stations.find(s => s.uid === stationId);
    
    if (!station) {
      console.error(`Station with id ${stationId} not found.`);
      return;
    }
  
    if (!station.slots || !station.slots[slotIndex]) {
      console.error(`Slot with index ${slotIndex} does not exist for station ${stationId}.`);
      return;
    }
  
    if (station['Available Slots'] <= 0) {
      alert('No slots available.');
      return;
    }
  
    if (station.slots[slotIndex].isBooked) {
      alert('This slot is already booked.');
      return;
    }
  
    // Pass cost_per_unit to booking page
    navigate('/booking', { state: { 
      slotDetails: { id: `${stationId}-${slotIndex}`, station, index: slotIndex },
      costPerUnit: station['cost_per_unit'] || '₹12.5 per unit' // Default value
    } });
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
  };

  const handleSearchVehicleType = (e) => {
    setSearchVehicleType(e.target.value);
  };

  const handleSearch = () => {
    const filtered = stations.filter(station => {
      const matchesCity = station.city?.toLowerCase().includes(searchCity.toLowerCase());
      const matchesVehicleType = station['vehicle_type']?.toLowerCase().includes(searchVehicleType.toLowerCase());
      return matchesCity && matchesVehicleType;
    });
    setFilteredStations(filtered);
    setSearchPerformed(true);
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
        setSearchPerformed(true);
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
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by city"
          value={searchCity}
          onChange={handleSearchCity}
        />
        <select value={searchVehicleType} onChange={handleSearchVehicleType}>
          <option value="">All Vehicle Types</option>
          <option value="2W">2 Wheeler</option>
          <option value="3W">3 Wheeler</option>
          <option value="4W">4 Wheeler</option>
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleUseLocation}>Use My Location</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : selectedStation ? (
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
      ) : searchPerformed ? (
        <div className="stations-list">
          {filteredStations.length > 0 ? (
            filteredStations.map(station => (
              <div key={station.uid} className="station-card" onClick={() => selectStation(station)}>
                <h4>{station.name}</h4>
                <p>{station.address}</p>
              </div>
            ))
          ) : (
            <p>No stations found.</p>
          )}
        </div>
      ) : (
        <p>Please perform a search or use your location to find EV charging stations.</p>
      )}
    </div>
  );
};

export default ParkingLotVisualizerCSV;
