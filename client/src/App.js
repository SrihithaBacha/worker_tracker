import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/login';
import SiteAdmin from './components/siteAdmin/siteAdmin';
import SuperAdmin from './components/superAdmin/superAdmin';
import Employee from './components/employee/employee';
import { getUserFromStorage } from './services/authService';

const PrivateRoute = ({ element: Component, allowedRoles }) => {
  const user = getUserFromStorage();
  return user && allowedRoles.includes(user.role) 
      ? Component 
      : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="App">
      <Router>
            <Routes>
                {/* Login Page Route */}
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />

                <Route path="/employee" element={<PrivateRoute allowedRoles={['employee']} element={<Employee />} />} />
                <Route path="/superAdmin" element={<PrivateRoute allowedRoles={['superAdmin']} element={<SuperAdmin />} />} />
                <Route path="/siteAdmin" element={<PrivateRoute allowedRoles={['siteAdmin']} element={<SiteAdmin />} />} />


            </Routes>
        </Router>
    </div>
  );
}

export default App;
