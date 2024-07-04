import React from "react";
import { Link } from "react-router-dom";
import './Home.css';

function NavBar() {
  return (
    <nav className="navbar">
    <ul>
      <li>
        <Link to="/" className="navbar1">Home</Link></li>
      <li><Link to="/Booking" className="navbar1">Booking</Link></li>
      <li><Link to="/navigation" className="navbar1">Navigation</Link></li>
      <li><Link to="/OCR" className="navbar1">OCR</Link></li>
      <li><Link to="/News" className="navbar1">News</Link></li>
      <li><Link to="/Parking" className="navbar1">Parking</Link></li>
    </ul>
  </nav>
  );
}

export default NavBar;

