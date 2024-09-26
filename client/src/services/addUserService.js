
import axios from 'axios';
export const addUser = async (userData) => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post('http://localhost:5000/api/users', userData, config);
  return response.data;
};
