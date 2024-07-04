// src/News.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './News.css'; // Make sure to create and import the CSS file

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [countryCode, setCountryCode] = useState('us');
  const [languageCode, setLanguageCode] = useState('es');
  const [loading, setLoading] = useState(false);

  const fetchNewsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/news', {
        params: {
          country_code: countryCode,
          language_code: languageCode,
        },
      });
      setNewsData(response.data);
    } catch (error) {
      console.error('Error fetching news data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchNews = (e) => {
    e.preventDefault();
    fetchNewsData();
  };

  useEffect(() => {
    if (newsData.length > 0) {
      const newsItems = document.querySelectorAll('.news-item');
      newsItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('loaded');
        }, index * 100);
      });
    }
  }, [newsData]);

  return (
    <div className="news-container">
      <h1>News</h1>
      <form onSubmit={handleFetchNews} className="news-form">
        <label>
          Country Code:
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          />
        </label>
        <label>
          Language Code:
          <input
            type="text"
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
          />
        </label>
        <button type="submit">Fetch News</button>
      </form>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="news-grid">
          {newsData.map((news, index) => (
            <div key={index} className="news-item">
              {news}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
