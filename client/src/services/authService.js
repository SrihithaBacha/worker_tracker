import axios from 'axios';
export const login = async (email, password,role) => {
    try {
        console.log("email:"+email+" password:"+password+" role:"+role);
        const response = await axios.post(`http://localhost:5000/api/login`, { email, password ,role});
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
