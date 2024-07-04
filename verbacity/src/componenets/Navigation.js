import React, { useState } from 'react';
import './Navigation.css';

const Navigation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [radius, setRadius] = useState('');
  const [availability, setAvailability] = useState('');
  const [chargerType, setChargerType] = useState('');
  const [resultsVisible, setResultsVisible] = useState(false);

  const handleSearch = () => {
    // Add your search logic here
    setResultsVisible(true);
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    setRadius('');
    setAvailability('');
    setChargerType('');
  };

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

        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div className={`search-results ${resultsVisible ? 'visible' : ''}`}>
        {/* Display search results here */}
      </div>
    </div>
  );
};

export default Navigation;
