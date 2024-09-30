import React, { useState } from 'react';
import './styles/AddEmployee.css';
import Navbar from './Navbar';

const AddEmployee = () => {
  const siteId=localStorage.getItem('siteId');

  const [formData, setFormData] = useState({
    siteId: localStorage.getItem('siteId'), // Get site admin ID from local storage
    name: '',
    email: '',
    contact: '',
    dp: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, contact, dp } = formData;

    if ( !name || !email || !contact) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteId, name, email, contact, dp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setFormData({
          siteId,
          name: '',
          email: '',
          contact: '',
          dp: '',
        });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred while adding the employee.');
      console.error('Error:', error);
    }
  };

  return (
    <><Navbar />
    <div className="add-employee-container">
      <h2 className='form-title'>Add Employee</h2>
      <form onSubmit={handleSubmit} className="add-employee-form">
        <div className="form-group">
      
          <input
            type="text"
            id="name"
            name="name"
            className='input-field'
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            className='input-field'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="contact"
            placeholder='Contact'
            className='input-field'
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
  
          <input
            type="text"
            id="dp"
            className='input-field'
            placeholder='Display Picture URL'
            name="dp"
            value={formData.dp}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button" >Add Employee</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div></>
  );
};

export default AddEmployee;
