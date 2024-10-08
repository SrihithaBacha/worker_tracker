import { useState } from 'react';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loginStatus,setLoginStatus]=useState('');
    const [role, setRole] = useState('employee');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log("id:"+id+" password:"+password+" role:"+role);
            const user = await login(email, password, role);
            setLoginStatus('');
            localStorage.setItem("id",user.id);
            if (user.role === 'employee') navigate('/employee');
            else if (user.role === 'superAdmin') navigate('/superAdmin');
            else if (user.role === 'siteAdmin') navigate('/siteAdmin');
        } catch (error) {
            setLoginStatus(localStorage.getItem('loginStatus'));
            console.error('Login failed', error);
        }
    };

    return (
        <>
        <h1 className="pagehead">Employee Work Tracking System</h1>
        <div className='main-login'>
            <img src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?size=626&ext=jpg&ga=GA1.1.1581672273.1719949994&semt=ais_hybrid"/>
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2 className='form-title'>Login</h2>
                <input
                className='input-field'
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                className='input-field'
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                {/* User Type Selection */}
                <div className="role-selection">
                    <label>
                        <input
                        className='radiogroup'
                            type="radio"
                            value="employee"
                            checked={role === 'employee'}
                            onChange={() => setRole('employee')}
                        />
                        Employee
                    </label>
                    <label>
                        <input
                         className='radiogroup'
                            type="radio"
                            value="superAdmin"
                            checked={role === 'superAdmin'}
                            onChange={() => setRole('superAdmin')}
                        />
                        Super Admin
                    </label>
                    <label>
                        <input
                         className='radiogroup'
                            type="radio"
                            value="siteAdmin"
                            checked={role === 'siteAdmin'}
                            onChange={() => setRole('siteAdmin')}
                        />
                        Site Admin
                    </label>
                </div>

                <button type="submit">Login as {role}</button>
            </form>
            <h3 className='loginStatus'>{loginStatus}</h3>
        </div>
        </div>
        </>
    );
}

export default Login;
