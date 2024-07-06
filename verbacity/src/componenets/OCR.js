import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import './ocr.css'; 

const OCR = () => {
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [report, setReport] = useState('');
  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    performOCR(imageSrc);
  };

  const uploadImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      performOCR(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const performOCR = (img) => {
    Tesseract.recognize(
      img,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      setOcrResult(text);
      sendToGemini(text);
    });
  };

  const sendToGemini = (text) => {
    const apiKey = 'AIzaSyAyr7vovEdSIPLK43soiSvtHzDAC-mG-UY';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Explain the following electricity bill details and provide steps to pay it: ${text}`
            }
          ]
        }
      ]
    };

    axios.post(apiUrl, requestBody)
      .then(response => {
        const reportData = response.data.candidates[0].content.parts[0].text;
        setReport(reportData);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="container">
      <h1>Smart City OCR App</h1>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={captureImage}>Capture from Webcam</button>
      <input type="file" accept="image/*" onChange={uploadImage} />
      {image && <img src={image} alt="Captured" />}
      <h2>OCR Result:</h2>
      <pre>{ocrResult}</pre>
      {report && (
        <div className="report">
          <h2>Gemini Report:</h2>
          <pre>{report}</pre>
        </div>
      )}
    </div>
  );
};

export default OCR;
