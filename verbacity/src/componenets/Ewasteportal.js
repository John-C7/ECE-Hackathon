import React, { useState, useRef } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

const EWasteSegregationPortal = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        recognizeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageCapture = () => {
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const dataUrl = canvas.toDataURL();
    setImage(dataUrl);
    recognizeImage(dataUrl);
  };

  const recognizeImage = async (img) => {
    setLoading(true);
    const imgElement = document.createElement('img');
    imgElement.src = img;
    const model = await mobilenet.load();
    const predictions = await model.classify(imgElement);
    setPrediction(predictions[0].className);
    setLoading(false);
    generateReport(predictions[0].className);
  };

  const generateReport = async (eWasteType) => {
    const reportContent = await callGeminiAPI(eWasteType);
    const doc = new jsPDF();
    doc.text('E-Waste Segregation Report', 14, 16);
    doc.autoTable({
      head: [['Field', 'Details']],
      body: [
        ['E-Waste Type', eWasteType],
        ['Collection Steps', reportContent.collection],
        ['Recycling Steps', reportContent.recycling],
        ['Disposal Steps', reportContent.disposal],
        ['Recycling Centers', reportContent.centers],
      ],
    });
    doc.save('e-waste-report.pdf');
  };

  const callGeminiAPI = async (eWasteType) => {
    const apiKey = 'AIzaSyAyr7vovEdSIPLK43soiSvtHzDAC-mG-UY';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `List all the steps and ways to segregate, dispose, and recycle ${eWasteType}. Also, provide a list of websites and Google Maps links to e-waste recycling centers in Bangalore.`
            }
          ]
        }
      ]
    };

    try {
      const response = await axios.post(apiUrl, requestBody);
      const content = response.data.candidates[0].content.parts[0].text;
      const reportContent = parseGeminiResponse(content);
      return reportContent;
    } catch (error) {
      console.error('Error:', error);
      return {
        collection: 'Error in fetching data',
        recycling: 'Error in fetching data',
        disposal: 'Error in fetching data',
        centers: 'Error in fetching data'
      };
    }
  };

  const parseGeminiResponse = (content) => {
    // Implement parsing logic based on the expected format of Gemini API response
    // This is a placeholder implementation
    const lines = content.split('\n');
    return {
      collection: lines[0] || 'No data available',
      recycling: lines[1] || 'No data available',
      disposal: lines[2] || 'No data available',
      centers: lines.slice(3).join('\n') || 'No data available'
    };
  };

  return (
    <div className="e-waste-portal">
      <h2>E-Waste Segregation Portal</h2>
      <div className="image-capture">
        <video autoPlay playsInline width="320" height="240"></video>
        <button onClick={handleImageCapture}>Capture Image</button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
        <button onClick={() => fileInputRef.current.click()}>Upload Image</button>
      </div>
      {loading ? <p>Loading...</p> : <p>{prediction ? `E-Waste Type: ${prediction}` : ''}</p>}
      {image && <img src={image} alt="Uploaded" width="320" />}
    </div>
  );
};

export default EWasteSegregationPortal;
