import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Worker's Tracker</div>
      <ul className="nav-links">
        <li><button onClick={() => handleNavigation('/siteAdmin/site-home')}>Home</button></li>
        <li><button onClick={() => handleNavigation('/siteAdmin/add-employee')}>Add Employee</button></li>
        <li><button onClick={() => handleNavigation('/siteAdmin/view-employees')}>View Employees</button></li>
        <li><button onClick={() => handleNavigation('/siteAdmin/site-progress')}>Site Progress</button></li>
        <li><button onClick={() => handleNavigation('/')}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
