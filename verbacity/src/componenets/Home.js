import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [answer, setAnswer] = useState('');
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleSearch = async () => {
    setGeneratingAnswer(true);
    setShowSearchResult(true);
    setAnswer("Loading your answer... \n It might take up to 10 seconds");

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAyr7vovEdSIPLK43soiSvtHzDAC-mG-UY`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: searchTerm }] }],
        },
      });

      console.log(response); 

  
      const generatedText = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedText);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  };

  return (
    <div className="home">
      <div className="content">
        <div className="flex-container">
          <Link to="https://www.karnatakaone.gov.in/Public/CenterDetails" className="flex-item">
            <img src="/Karnataka-One.jpg"  />
            <div>Karnataka One</div>
          </Link>
          <Link to="https://appointments.uidai.gov.in/easearch.aspx?AspxAutoDetectCookieSupport=1" className="flex-item">
            <img src="./Images/Aadhar.jpg" />
            <div>Aadhar Centers</div>
          </Link>
          <Link to="/Weather" className="flex-item">
            <img src="/path_to_image3.jpg"  />
            <div>Weather</div>
          </Link>
          <Link to="/ew" className="flex-item">
            <img src="/path_to_image4.jpg"  />
            <div>E-Waste Collection</div>
          </Link>
        </div>
      </div>
      <div className={`search-box ${showSearchResult ? 'search-box-up' : ''}`}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter prompt"
          disabled={generatingAnswer}
        />
        <button onClick={handleSearch} disabled={generatingAnswer}>
          {generatingAnswer ? 'Generating...' : 'Search'}
        </button>
      </div>
      {showSearchResult && (
        <div className="search-results">
          <ReactMarkdown className="p-3">{answer}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Home;
