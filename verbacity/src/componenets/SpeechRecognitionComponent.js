import React, { useState } from 'react';
import axios from 'axios';
import './SpeechRecognitionComponent.css'; 
const SpeechRecognitionComponent = () => {
    const [targetLanguage, setTargetLanguage] = useState('hi'); // Default to Hindi
    const [audioUrl, setAudioUrl] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleMicClick = async () => {
        setIsListening(true);
        setFeedbackMessage('Listening... Please speak now.');
    
        try {
            const response = await axios.post('http://127.0.0.1:5000/recognize_and_translate_speech', {
                target_language: targetLanguage
            });
    
            const audioUrl = URL.createObjectURL(response.data);
            setAudioUrl(audioUrl);
            setFeedbackMessage('Translation complete. Playing audio...');
        } catch (error) {
            console.error('Error recognizing and translating speech:', error);
            setFeedbackMessage('An error occurred. Please try again.');
        } finally {
            setIsListening(false);
        }
    };
    

    return (
        <div className="speech-recognition-container">
            <h1>Speech Recognition and Translation</h1>
            <button className={`mic-button ${isListening ? 'listening' : ''}`} onClick={handleMicClick} disabled={isListening}>
                Start Speech Recognition
            </button>
            <select value={targetLanguage} onChange={e => setTargetLanguage(e.target.value)}>
                <option value="hi">Hindi</option>
                <option value="kn">Kannada</option>
                <option value="te">Telugu</option>
                <option value="ta">Tamil</option>
                <option value="ml">Malayalam</option>
                <option value="gu">Gujarati</option>
                <option value="mr">Marathi</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
                {/* Add more language options as needed */}
            </select>
            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
            {audioUrl && (
                <div>
                    <h3>Translated Speech:</h3>
                    <audio controls src={audioUrl}></audio>
                </div>
            )}
            {isListening && (
                <div className="wave-container">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                </div>
            )}
        </div>
    );
};

export default SpeechRecognitionComponent;
