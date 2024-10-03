import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import './styles/Home.css';
import Navbar from './Navbar';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const Home = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentEmployees, setPresentEmployees] = useState(0);
  const [siteDetails, setSiteDetails] = useState({
    siteId: '',
    name: '',
    location: '',
    siteImage: '',
    siteInfo: '',
    progress: 0,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve siteId from localStorage
  const site_id = localStorage.getItem('siteId');

  useEffect(() => {
    if (!site_id) {
      setError('Site ID not found. Please log in again.');
      setFetching(false);
      return;
    }
    fetchData();
  }, [site_id]);

  const fetchData = async () => {
    try {
      const siteResponse = await axios.get(`http://localhost:5000/sites/${site_id}`);
      const siteData = siteResponse.data.site;
      setSiteDetails({
        siteId: siteData.siteId,
        name: siteData.name,
        location: siteData.location,
        siteImage: siteData.siteImage || '',
        siteInfo: siteData.siteInfo || 'No additional information provided.',
        progress: siteData.progress || 0,
      });

      // Fetch total employees
      const employeesResponse = await axios.get(`http://localhost:5000/employee/undersite/${site_id}`
      );
      const employees = employeesResponse.data.employees;
      setTotalEmployees(employees.length);

      
  

      const dailyRecordsResponse = await axios.get(`http://localhost:5000/dailyrecords/${site_id}`);

      // Filter records for today and count unique employees who have checked in
      const presentEmpIds =dailyRecordsResponse.data.presentees;
    
      setPresentEmployees(presentEmpIds);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setFetching(false);
    }
  };

  const handleProgressChange = async (event) => {
    const updatedProgress = Number(event.target.value);
    setSiteDetails(prevDetails => ({ ...prevDetails, progress: updatedProgress }));

    try {
      await axios.put(`http://localhost:5000/sites/${site_id}`, { progress: updatedProgress });
      // Optionally, you can show a success message or toast here
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Reverting to previous value.');
      // Revert progress change if update fails
      fetchData();
    }
  };

 
  const attendanceData = {
    labels: ['Employees Present', 'Total Employees'],
    datasets: [
      {
        label: 'Attendance',
        data: [presentEmployees, totalEmployees],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverOffset: 4,
      },
    ],
  };

  const progressData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: 'Site Progress',
        data: [siteDetails.progress, 100 - siteDetails.progress],
        backgroundColor: ['#4BC0C0', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  if (fetching) {
    return (
      <>
        <Navbar />
        <div className="home-container loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="home-container error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="site-info">
          <h2>Site Information</h2>
          <div className="site-details">
            <div className="image-upload">
              <img
                src={siteDetails.siteImage ? `${siteDetails.siteImage}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt="Site"
                className="site-image"
              />
              {loading && <div className="spinner-small"></div>}
            </div>
            <div className="site-text">
              <p><strong>Name:</strong> {siteDetails.name}</p>
              <p><strong>Location:</strong> {siteDetails.location}</p>
              <p><strong>Info:</strong> {siteDetails.siteInfo}</p>
            </div>
          </div>
        </div>

        {/* Attendance Overview Section */}
        <div className="attendance-info">
          <h2>Attendance Overview</h2>
          <div className="chart-container">
            <Pie data={attendanceData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Employee Attendance',
                },
              },
            }} />
          </div>
          <div className="attendance-stats">
            <p><strong>Total Employees:</strong> {totalEmployees}</p>
            <p><strong>Employees Present:</strong> {presentEmployees}</p>
          </div>
        </div>
      </div>

      {/* Site Progress Section */}
      <div className="site-progress">
        <h2>Site Progress</h2>
        <div className="progress-bar">
          <input
            type="range"
            min="0"
            max="100"
            value={siteDetails.progress}
            onChange={handleProgressChange}
          />
          <span>{siteDetails.progress}% complete</span>
        </div>
        <div className="progress-chart">
          <Pie data={progressData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Site Progress',
              },
            },
          }} />
        </div>
      </div>
    </>
  );
};

export default Home;
