import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import './employee.css';
import '../../App';

const WorkerInfo = (workerId) => {
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  console.log('Worker ID:', workerId);
  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!workerId) {
        setError('Worker ID is not provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/employees/employee/${workerId.employeeId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWorkerData(data);

        // Fetch site information
        if (data.site && data.site.$oid) {
          const siteResponse = await fetch(`http://localhost:5000/api/sites/${data.site.$oid}`);
          if (!siteResponse.ok) {
            throw new Error('Network response was not ok');
          }
          const siteData = await siteResponse.json();
          setWorkerData((prevData) => prevData ? { ...prevData, siteName: siteData.name } : null);
        }
      } catch (error) {
        setError('Failed to fetch worker data');
        console.error('Error fetching worker data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [workerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkerData((prevData) => prevData ? { ...prevData, [name]: value } : null);
  };

  const handleEmployeeInfoChange = (e) => {
    const { name, value } = e.target;
    setWorkerData((prevData) => prevData ? { ...prevData, employeeInfo: { ...prevData.employeeInfo, [name]: value } } : null);
  };

  const handleSave = async () => {
    if (workerData) {
      try {
        const response = await fetch(`http://localhost:5000/api/employees/employee/${workerId.employeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workerData),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWorkerData(data);
        setIsEditing(false);
      } catch (error) {
        setError('Failed to update worker data');
        console.error('Error updating worker data:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='worker-info'>
      <h2>Worker Information</h2>
      <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="Static Image" style={{ height: '150px' }} />
      {isEditing ? (
        <>
          <TextField
            label="Name"
            name="name"
            value={workerData?.name}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={workerData?.email}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '16px' }}>
            Save
          </Button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {workerData?.name}</p>
          <p><strong>Email:</strong> {workerData?.email}</p>

          <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} style={{ marginTop: '16px' }}>
            Edit
          </Button>
        </>
      )}
    </div>
  );
};

export default WorkerInfo;