import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";



import Home from "./componenets/Home";
import Parking from "./componenets/Parking";
import NavBar from "./componenets/Navbar";
import Gemini from "./componenets/ChatBot/Gemini";

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
        
      </Routes>
    </>
  );
};

export default App;
