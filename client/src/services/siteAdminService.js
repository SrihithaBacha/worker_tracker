
import axios from 'axios';
export const addSiteAdmin = async (siteAdminData) => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post('http://localhost:5000/api/siteadmins', siteAdminData, config);
  return response.data;
};
