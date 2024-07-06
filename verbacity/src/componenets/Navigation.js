import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import './Navigation.css';

const Navigation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [radius, setRadius] = useState('');
  const [availability, setAvailability] = useState('');
  const [chargerType, setChargerType] = useState('');
  const [resultsVisible, setResultsVisible] = useState(false);
  const [chargingStations, setChargingStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);

  useEffect(() => {
    fetch('/evchargers.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            // Ensure correct property names
            results.data.forEach(station => {
              station.latitude = parseFloat(station.latitude); // Convert to float
              station.longitude = parseFloat(station.longitude); // Convert to float
            });

            setChargingStations(results.data);
            setFilteredStations(results.data);
          },
        });
      });
  }, []);

  const handleSearch = () => {
    let filtered = chargingStations.filter((station) =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filter === 'radius') {
      // Add radius filtering logic here
    }

    if (filter === 'availability') {
      filtered = filtered.filter((station) =>
        availability === 'yes' ? station.Available > 0 : station.Available == 0
      );
    }

    if (filter === 'charger-type') {
      filtered = filtered.filter(
        (station) => station.Type.toLowerCase() === chargerType
      );
    }

    setFilteredStations(filtered);
    setResultsVisible(true);
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    setRadius('');
    setAvailability('');
    setChargerType('');
  };

  const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="navigation">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setResultsVisible(false)}
          className="search-input"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="filter-dropdown"
        >
          <option value="">Filter by</option>
          <option value="radius">Radius</option>
          <option value="charger-type">Charger type</option>
          <option value="availability">Availability</option>
        </select>

        {filter === 'radius' && (
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">Select radius</option>
            <option value="<5">Less than 5 miles</option>
            <option value="<15">Less than 15 miles</option>
            <option value="<50">Less than 50 miles</option>
          </select>
        )}

        {filter === 'availability' && (
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">Select availability</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        )}

        {filter === 'charger-type' && (
          <select
            value={chargerType}
            onChange={(e) => setChargerType(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">Select charger type</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
            <option value="ccs">CCS</option>
          </select>
        )}

        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="results-container">
        {resultsVisible &&
          filteredStations.map((station) => (
            <div key={station.name} className="result-item">
              {station.name}
            </div>
          ))}
      </div>

      <div className="map-container">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredStations.map((station) => (
            <Marker
              key={station.name}
              position={[station.latitude || 0, station.longitude || 0]} // Use default value if latitude or longitude is undefined
              icon={icon}
            >
              <Popup>
                <strong>{station.name}</strong>
                <br />
                {station.address}
                <br />
                Slots: {station.Slots}
                <br />
                Type: {station.Type}
                <br />
                Available: {station.Available}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Navigation;
