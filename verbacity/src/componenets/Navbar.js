import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <style>
        {`
          .navbar {
            background-color: blue;
            overflow: hidden;
          }

          .navbar ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: space-around;
          }

          .navbar1 {
            display: block;
            color: blue;
            text-align: center;
            padding: 14px 16px;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .navbar1:hover {
            background-color: #ddd;
            color: black;
            transform: scale(1.1);
          }

          .navbar1:active {
            transform: scale(1.05);
          }
        `}
      </style>
      <ul>
        <li>
          <Link to="/" className="navbar1">Home</Link>
        </li>
        <li>
          <Link to="/problems" className="navbar1">Raise an Issue</Link>
        </li>
        <li>
          <Link to="/navigation" className="navbar1">EV Locator</Link>
        </li>
        <li>
          <Link to="/OCR" className="navbar1">OCR</Link>
        </li>
        {/* <li><Link to="/News" className="navbar1">News</Link></li> */}
        <li>
          <Link to="/Parking" className="navbar1">Parking</Link>
        </li>
        <li>
          <Link to="/parking-lot-csv" className="navbar1">Booking</Link>
        </li>
        <li>
          <Link to="/portal" className="navbar1">Portal</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
