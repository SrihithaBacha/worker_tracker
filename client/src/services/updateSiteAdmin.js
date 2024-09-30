
import axios from 'axios';
export const updateSiteAdmin = async (siteData) => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  console.log("data submitted to update: "+typeof(siteData));
  const response = await axios.put(`http://localhost:5000/api/sites/${siteData.siteId}`, siteData);
  console.log(response.data);
  return response.data;
};
