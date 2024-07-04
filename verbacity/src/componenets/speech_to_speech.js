import React, { useState } from 'react';
import axios from 'axios';
import { ReactMic } from 'react-mic';

const SpeechToSpeech = () => {
  const [record, setRecord] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  const onStop = async (recordedBlob) => {
    const formData = new FormData();
    formData.append('file', recordedBlob.blob, 'audio.wav');

    try {
      const response = await axios.post('http://localhost:5000/speech_to_text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRecognizedText(response.data.text);
    } catch (error) {
      console.error('Error recognizing speech:', error.response ? error.response.data : error.message);
    }
  };

  const handleTranslateText = async () => {
    try {
      const response = await axios.post('http://localhost:5000/translate_text', {
        text: recognizedText,
        target_language: targetLanguage,
      });
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error('Error translating text:', error.response ? error.response.data : error.message);
    }
  };

  const handleTextToSpeech = async () => {
    try {
      const response = await axios.post('http://localhost:5000/text_to_speech', {
        text: translatedText,
        language: targetLanguage,
      }, {
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const audio = new Audio(url);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error('Error converting text to speech:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>Speech to Speech Translation</h1>
      <button onMouseDown={startRecording} onMouseUp={stopRecording}>Hold to Speak</button>
      <ReactMic
        record={record}
        className="sound-wave"
        onStop={onStop}
        mimeType="audio/wav"
        strokeColor="#000000"
        backgroundColor="#FF4081" />
      <div>
        <p>Recognized Text: {recognizedText}</p>
        <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
          <option value="">Select Target Language</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          {/* Add more language options as needed */}
        </select>
        <button onClick={handleTranslateText}>Translate Text</button>
        <p>Translated Text: {translatedText}</p>
        <button onClick={handleTextToSpeech} disabled={isPlaying}>Play Translated Speech</button>
      </div>
    </div>
  );
};

export default SpeechToSpeech;
