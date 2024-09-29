import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './siteAdmin.css'; 
import { useNavigate } from 'react-router-dom';
 // Adjust the path as necessary
import fetchSiteAdmin from '../../services/siteAdminServices'; // Adjust the path as necessary

const WelcomeSiteAdmin = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    // Define an async function inside useEffect
    const getAdminAndSites = async () => {
      try {
        // Await the fetchSiteAdmin function to get the site admin details
        const siteAdmin = await fetchSiteAdmin();

        if (siteAdmin) {
          setAdminName(siteAdmin.name);
          await fetchSites(siteAdmin.siteadminId);
        } else {
          // Handle case where siteAdmin is not found
          console.error('Site Admin not found');
          setError('Site Admin not found. Please log in again.');
        }
      } catch (err) {
        // Handle any errors that occur during fetchSiteAdmin or fetchSites
        console.error('Error fetching site admin or sites:', err);
        setError('Failed to load site admin details. Please try again later.');
      } finally {
        // Set loading to false after fetching is complete
        setLoading(false);
      }
    }

    // Call the async function
    getAdminAndSites();
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to fetch sites based on siteadminId
  const fetchSites = async (siteadminId) => {
    try {
      const response = await axios.get(`http://localhost:5000/sites/undersiteadmin/${siteadminId}`, {
        headers: {
          // Include any necessary headers, e.g., Authorization if required
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSites(response.data.sites);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setError('Failed to load sites. Please try again later.');
    }
  };

  // Function to handle site card click
  const handleCardClick = (siteId) => {
    localStorage.setItem('siteId', siteId);
    navigate('/siteAdmin/site-home');
  };

  // Function to retry fetching data
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Re-run the effect by calling getAdminAndSites again
    const getAdminAndSites = async () => {
      try {
        const siteAdmin = await fetchSiteAdmin();

        if (siteAdmin) {
          setAdminName(siteAdmin.name);
          await fetchSites(siteAdmin.siteadminId);
        } else {
          console.error('Site Admin not found');
          setError('Site Admin not found. Please log in again.');
        }
      } catch (err) {
        console.error('Error fetching site admin or sites:', err);
        setError('Failed to load site admin details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    getAdminAndSites();
  };

  // Render loading state
  if (loading) {
    return (
      <>
        <nav className="navbar">
      <div className="navbar-logo">Worker's Tracker</div>
      <ul className="nav-links">
    
      </ul>
    </nav>
        <div className="welcome-container loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <nav className="navbar">
      <div className="navbar-logo">Worker's Tracker</div>
      <ul className="nav-links">
    
      </ul>
    </nav>
        <div className="welcome-container error">
          <p>{error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      </>
    );
  }

  // Render the main content
  return (
    <>
      <nav className="navbar">
      <div className="navbar-logo">Worker's Tracker</div>
      <ul className="nav-links">
    
      </ul>
    </nav>
      <div className="welcome-container">
        <h1>Welcome, {adminName}!</h1>
        <div className="sites-section">
          <h2>Your Sites</h2>
          {sites.length > 0 ? (
            <div className="sites-grid">
              {sites.map((site) => (
                <div
                  key={site.siteId}
                  className="site-card"
                  onClick={() => handleCardClick(site.siteId)}
                >
                  <img 
                    src={site.siteImage || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={site.name} 
                    className="site-image" 
                  />
                  <div className="site-details">
                    <h3>{site.name}</h3>
                    <p><strong>Location:</strong> {site.location}</p>
                    <p>{site.siteInfo}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No sites found under your administration.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default WelcomeSiteAdmin;
