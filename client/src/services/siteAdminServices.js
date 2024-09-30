import axios from 'axios';

const fetchSiteAdmin = async () => {
    try {
        // Retrieve user data from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
            throw new Error('User not found in localStorage');
        }

        const user = JSON.parse(userString);
        const email = user.email;

        if (!email) {
            throw new Error('User email not found');
        }

        // Make a GET request with email as a query parameter
        const response = await axios.get('http://localhost:5000/sites-email', {
            params: { email: email }
        });

        // Access the siteAdmin from the response data
        return response.data.siteAdmin;

    } catch (error) {
        console.error('Error fetching site admin:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export default fetchSiteAdmin;
