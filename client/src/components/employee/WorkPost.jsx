import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, CircularProgress, Box, Typography } from '@mui/material';

const WorkPost = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const siteId = user.siteId;
  if (!siteId) {
    throw new Error('User not found in localStorage');
  }
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedImage = acceptedFiles[0];
    if (!selectedImage.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    if (selectedImage.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
    setError(null);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleSubmit = async () => {
    if (image) {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64Image = reader.result.toString();
        const data = {
          image: base64Image,
          isProgressImage: true // Set this flag to true for progress images
        };

        try {
          const response = await fetch(`http://localhost:5000/sites/${siteId}/images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });

          if (!response.ok) {
            throw new Error('Failed to post progress image');
          }

          alert('Progress image posted successfully');
          setImage(null);
          setImagePreview(null);
        } catch (error) {
          setError('Failed to post progress image');
        } finally {
          setLoading(false);
        }
      };
    } else {
      setError('Please provide an image');
    }
  };

  return (
      <div>
      <h1>Post Progress Image</h1>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #cccccc',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          margin: '20px',
          height: '200px', // Increased height
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          '&:hover': {
            backgroundColor: '#f1f1f1',
            cursor: 'pointer'
          }
        }}
      >
        <input {...getInputProps()} disabled={loading} />
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              marginTop: '10px'
            }}
          />
        ) : (
          <>
            <img
              src="https://cdn1.iconfinder.com/data/icons/hawcons/32/698394-icon-130-cloud-upload-512.png" // Replace with your cloud image URL
              alt="Cloud Upload"
              style={{ width: '100px', height: '100px', marginBottom: '10px' }}
            />
            <Typography variant="body1" color="textSecondary">
              Drag & drop an image here, or click to select one
            </Typography>
          </>
        )}
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ margin: '10px' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Post Progress Image'}
      </Button>
    </div>
  );
};

export default WorkPost;