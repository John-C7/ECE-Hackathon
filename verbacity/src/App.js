import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";



import Home from "./componenets/Home";
import Parking from "./componenets/Parking";
import NavBar from "./componenets/Navbar";
import Gemini from "./componenets/ChatBot/Gemini";
import Navigation from "./componenets/Navigation";
import News from "./componenets/News";
import Problems from "./componenets/Problems";
import SpeechRecognitionComponent from "./componenets/SpeechRecognitionComponent";
import OCR from "./componenets/OCR";
import EV from "./componenets/EV";
import Weather from "./componenets/Weather";
import Ewaste from "./componenets/Ewaste";

const App = () => {
  return (
    
    <Router>
      <AppRoutes />
    </Router>
  );
};

const AppRoutes = () => {
  // const location = useLocation();



  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Gemini />} />
        <Route path="/Parking" element={<Parking />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/OCR" element={<OCR />} />
        <Route path="/News" element={<News />} />
        <Route path="/Problems" element={<Problems />} />
        <Route path="/Speech" element={<SpeechRecognitionComponent />} />
        <Route path="/ev" element={<EV />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/ewaste" element={<Ewaste />} />
      </Routes>
    </>
  );
};

export default App;