import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="navbar">
      <ul>
        <li>
          <Link to="/parking" className="nav-link">Parking</Link>
        </li>
        
      </ul>
    </div>
  );
}

export default NavBar;

