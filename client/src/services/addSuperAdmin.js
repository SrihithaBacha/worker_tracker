
import axios from 'axios';
export const addSuperAdmin = async (superAdminData) => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  console.log(superAdminData);
  const response = await axios.post('http://localhost:5000/api/superadmins', superAdminData);
  console.log(response.data);
  return response.data;
};
