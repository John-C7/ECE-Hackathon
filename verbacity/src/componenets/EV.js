

import React, { useState } from 'react';
import axios from 'axios';

function EV() {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default target language (Spanish)

  const handleTranslate = async () => {
    try {
      const response = await axios.post('http://localhost:5001/translate', {
        text,
        targetLanguage,
      });
      setTranslation(response.data.translation);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Speech to Speech Translation</h1>
      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <br />
      <label>
        Target Language:
        <input
          type="text"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          placeholder="Enter target language code (e.g., es for Spanish)"
        />
      </label>
      <br />
      <button onClick={handleTranslate}>Translate</button>
      <br />
      <h2>Translation:</h2>
      <p>{translation}</p>
    </div>
  );
}

export default EV;
