import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import LRM from 'leaflet-routing-machine';
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
  const [userLocation, setUserLocation] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  useEffect(() => {
    fetch('/evchargers.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            results.data.forEach(station => {
              station.latitude = parseFloat(station.latitude); 
              station.longitude = parseFloat(station.longitude); 
            });

            setChargingStations(results.data);
            setFilteredStations(results.data);
          },
        });
      });
  }, []);

  useEffect(() => {
    if (userLocation && filteredStations.length) {
      const nearest = findNearestStation(userLocation, filteredStations);
      setNearestStation(nearest);
    }
  }, [userLocation, filteredStations]);

  const findNearestStation = (location, stations) => {
    let nearest = null;
    let minDistance = Infinity;

    stations.forEach(station => {
      const distance = calculateDistance(location, [station.latitude, station.longitude]);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    return nearest;
  };

  const calculateDistance = ([lat1, lon1], [lat2, lon2]) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleSearch = () => {
    let filtered = chargingStations.filter((station) =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filter === 'radius') {
      // Implement radius filter logic here
    }

    if (filter === 'availability') {
      filtered = filtered.filter((station) =>
        availability === 'yes' ? station.Available > 0 : station.Available === 0
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

  const handleFindLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);
    }, (error) => {
      console.error("Error getting location:", error);
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      if (routingControlRef.current) {
        routingControlRef.current.remove(); // Remove previous routing control if it exists
      }

      if (userLocation && nearestStation) {
        routingControlRef.current = LRM.control({
          waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(nearestStation.latitude, nearestStation.longitude)
          ],
          createMarker: () => null,
          lineOptions: { styles: [{ color: 'blue', weight: 4 }] }
        }).addTo(mapRef.current);
      }
    }
  }, [userLocation, nearestStation]);

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
          whenCreated={mapInstance => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredStations.map((station) => (
            <Marker
              key={station.name}
              position={[station.latitude || 0, station.longitude || 0]} 
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

          {userLocation && nearestStation && (
            <>
              <Marker position={userLocation} icon={icon}>
                <Popup>Your Location</Popup>
              </Marker>
              <Marker
                position={[nearestStation.latitude, nearestStation.longitude]}
                icon={icon}
              >
                <Popup>{nearestStation.name}</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
        <button onClick={handleFindLocation} className="location-button">
          Find Nearest Station
        </button>
      </div>
    </div>
  );
};

export default Navigation;
