import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/SiteProgress.css';
import Navbar from './Navbar';

const SiteProgress = () => {
  // Retrieve siteId from localStorage
  const siteId = localStorage.getItem('siteId');

  // State variables
  const [progressImages, setProgressImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch progress images on component mount
  useEffect(() => {
    if (!siteId) {
      setErrorMessage('Site ID not found. Please log in again.');
      return;
    }

    const fetchProgressImages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/sites/${siteId}`);
        setProgressImages(response.data.site.progressImages);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching progress images:', error);
        setErrorMessage('Failed to load progress images.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressImages();
  }, [siteId]);

  // Handle image file selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle adding a new progress image
  const handleAddImage = async () => {
    if (!imageFile) {
      setErrorMessage('Please select an image to upload.');
      return;
    }

    // Validate file type (only images)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(imageFile.type)) {
      setErrorMessage('Only JPEG, PNG, and GIF files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('siteId', siteId);

    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:5000/sites/progressImages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update progress images from the response
      setProgressImages(response.data.progressImages);
      setSuccessMessage('Progress image added successfully.');
      setErrorMessage('');
      setImageFile(null);
      setShowDialog(false);
    } catch (error) {
      console.error('Error adding progress image:', error);
      setErrorMessage('Failed to add progress image.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle the add image dialog
  const toggleDialog = () => {
    setShowDialog(!showDialog);
    setErrorMessage('');
    setSuccessMessage('');
    setImageFile(null);
  };

  // Render loading spinner
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="site-progress-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="site-progress-container">
        <h2>Site Progress Images</h2>

        {/* Display error or success messages */}
        {errorMessage && <div className="message error-message">{errorMessage}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}

        {/* Progress Images Gallery */}
        <div className="progress-images-list">
          {progressImages.length > 0 ? (
            progressImages.map((image, index) => (
              <div key={index} className="image-item">
                {/* Render image directly from assets */}
                <img src={`http://localhost:5000/assets/${image}`} alt={`Progress ${index + 1}`} />
              </div>
            ))
          ) : (
            <p>No progress images available.</p>
          )}
        </div>

        {/* Add Image Button */}
        <button className="add-image-btn" onClick={toggleDialog}>
          Add Progress Image
        </button>

        {/* Add Image Dialog */}
        {showDialog && (
          <div className="dialog-box">
            <div className="dialog-content">
              <h3>Add New Progress Image</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <div className="dialog-buttons">
                <button onClick={handleAddImage} className="dialog-add-btn">
                  Add
                </button>
                <button onClick={toggleDialog} className="dialog-cancel-btn">
                  Cancel
                </button>
              </div>
              {imageFile && <p>Selected File: {imageFile.name}</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SiteProgress;
