// src/services/siteService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sites';

export const getSites = async () => {
  const response = await axios.get(API_URL);
  console.log(response);
  return response.data;
};

export const addSite = async (site) => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  
  const response = await axios.post('http://localhost:5000/api/sites', site, config);
  return response.data;
};
