import React, { useState } from 'react';
import { Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './employee.css';

const Logout = () => {
  const [workStatus, setWorkStatus] = useState(''); // Hook must be at the top
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const employeeId = user?.empId.toString(); // Use optional chaining
  const siteId = user?.siteId?.toString(); // Ensure siteId is a string

  if (!user || !employeeId || !siteId) {
    console.error('User not found or incomplete data in localStorage');
    alert('User not found, please log in.');
    navigate('/login'); // Redirect to login if user is missing
    return null; // Don't render the component
  }

  const handleChange = (event) => {
    setWorkStatus(event.target.value);
  };

  const handleSubmitLogout = async () => {
    if (workStatus) {
      const data = {
        empId: employeeId,
        siteId: siteId,
        workStatus: workStatus, // Selected work status
      };

      console.log('Submitting logout data:', data);

      try {
        const response = await fetch('http://localhost:5000/api/signOut', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          alert('Failed to log out. Please try again.');
          return;
        }

        const responseData = await response.json();
        console.log('Response data:', responseData);

        alert('Logout Submitted');
        // navigate(`/attendance-table`);
      } catch (error) {
        console.error('Error submitting logout:', error);
        alert('Failed to submit logout due to a network error.');
      }
    } else {
      console.error('Work status is missing');
      alert('Please select the work status');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Logout</h1>
      <FormControl variant="outlined" style={{ minWidth: 200, marginBottom: '20px' }}>
        <InputLabel id="work-status-label">Work Status</InputLabel>
        <Select
          labelId="work-status-label"
          id="work-status"
          value={workStatus}
          onChange={handleChange}
          label="Work Status"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </Select>
      </FormControl>
      <br />
      <Button variant="contained" onClick={handleSubmitLogout} style={{margin:'20px'}}>
        Update Status
      </Button>
      <br />
      <Button variant="contained" onClick={() => navigate('/login')}>
        Logout
      </Button>
    </div>
  );
};

export default Logout;