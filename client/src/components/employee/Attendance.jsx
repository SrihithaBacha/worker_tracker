import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './employee.css';

const Attendance = () => {
  const user= JSON.parse(localStorage.getItem('user'));
  const employeeId=user.empId;
  const siteId=user.siteId;
  if (!employeeId) {
      throw new Error('User not found in localStorage');
  }
  console.log(`Employee ID: ${employeeId}, Site ID: ${siteId}`);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
      }
    );
  };

  const startVideo = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } catch (error) {
        console.error('Error starting video:', error);
      }
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      if (stream instanceof MediaStream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    getLocation();
    startVideo();

    return () => {
      stopVideo();
    };
  }, []);

  const captureImage = () => {
    setIsCapturing(true);
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const resizedCanvas = document.createElement('canvas');
        const maxSize = 500; // Adjust the max size as needed
        let width = canvas.width;
        let height = canvas.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height *= maxSize / width));
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width *= maxSize / height));
            height = maxSize;
          }
        }

        resizedCanvas.width = width;
        resizedCanvas.height = height;
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.drawImage(canvas, 0, 0, width, height);
        setImage(resizedCanvas.toDataURL('image/png'));
      }

      // Stop the video stream
      stopVideo();
    }
  };

  const handleSubmitAttendance = async () => {
    if (image && location) {
      const data = {
        employee: employeeId,
        site:  siteId, // Send siteId as a string
        checkInTime: new Date().toISOString(),
        checkInImage: image,
        location: {
          latitude: location.lat,
          longitude: location.lng
        },
        workStatus: 'pending' // Default work status, adjust as needed
      };
      console.log(typeof(data.site), data.site);

      console.log('Submitting attendance data:', data);

      try {
        const response = await fetch('http://localhost:5000/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Response data:', responseData);

        alert('Attendance Submitted');
        navigate(`/attendance-table`);
      } catch (error) {
        console.error('Error submitting attendance:', error);
        alert('Failed to submit attendance');
      }
    } else {
      console.error('Image or location is missing');
      alert('Please capture an image and ensure location is available');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Take Attendance</h1>
      <div className={image ? 'hidden' : ''}>
        <video ref={videoRef} style={{ width: '100%', maxHeight: '400px', marginBottom: '10px' }} />
      </div>
      {image && <img src={image} alt="Captured" style={{ marginBottom: '10px' }} />}
      <br />
      <p>Latitude: {loading ? 'loading...' : location?.lat}</p>
      <p>Longitude: {loading ? 'loading...' : location?.lng}</p>
      <Button variant="contained" onClick={captureImage} style={{ margin: '10px' }} disabled={isCapturing}>
        Capture Image
      </Button>
      <br />
      <Button variant="contained" onClick={handleSubmitAttendance}>
        Submit Attendance
      </Button>
    </div>
  );
};

export default Attendance;