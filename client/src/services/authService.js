import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const login = async (id, password,role) => {
    try {
        console.log("id:"+id+" password:"+password+" role:"+role);
        const response = await axios.post(`${API_URL}/login`, { id, password ,role});
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error; // Rethrow to handle in your UI
    }
};

export const getUserFromStorage = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const logout = () => {
    localStorage.removeItem('user');
};
