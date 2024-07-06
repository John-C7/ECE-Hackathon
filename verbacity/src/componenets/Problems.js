import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Problems.css';

const Problems = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, (error) => {
        console.error('Error getting location:', error);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('location', `${location.lat},${location.lng}`);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/problems', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error reporting problem:', error);
      setMessage('Error reporting problem');
    }
  };

  return (
    <div className="problems-container">
      <h1>Report a Problem</h1>
      <form onSubmit={handleSubmit} className="problems-form">
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Upload Picture:
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Problems;
