import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import Map from "./componenets/Map";
import BookingPage from "./componenets/BookingPage";
import ParkingLotVisualizer from "./componenets/ParkingLotVisualizer";
import ParkingLotVisualizerCSV from "./componenets/ParkingLotVisualizerCSV";
import BookingForm from "./componenets/BookingForm";
import EWasteSegregationPortal from "./componenets/Ewasteportal";
import MapWithRouting from "./componenets/Map";

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

const AppRoutes = () => {
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
        <Route path="/map12" element={<MapWithRouting />} />
        <Route path="/booking/:uuid" element={<BookingPage />} />
        <Route path="/parking-lot/:stationId" element={<ParkingLotVisualizer />} />
        <Route path="/parking-lot-csv" element={<ParkingLotVisualizerCSV />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/portal" element={<EWasteSegregationPortal />} />
      </Routes>
    </>
  );
};

export default App;
