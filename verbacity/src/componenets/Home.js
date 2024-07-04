import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleSearch = () => {
    setShowSearchResult(true);
  };

  return (
    <div className="home">
      <div className="content">
        <div className="flex-container">
          <div className="flex-item">Content 1</div>
          <div className="flex-item">Content 2</div>
          <div className="flex-item">Content 3</div>
          <div className="flex-item">Content 4</div>
        </div>
      </div>
      <div className={`search-box ${showSearchResult ? 'search-box-up' : ''}`}>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Enter prompt" 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {showSearchResult && <div className="search-results">Search results for: {searchTerm}</div>}
    </div>
  );
};

export default Home;
