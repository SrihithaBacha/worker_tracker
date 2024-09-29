import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/login';
import SiteAdmin from './components/siteAdmin/siteAdmin';
import SuperAdmin from './components/superAdmin/superAdmin';
import Employee from './components/employee/employee';
import { getUserFromStorage } from './services/authService';
import Home from './components/siteAdmin/Home';
import AddEmployee from './components/siteAdmin/AddEmployee';
import ViewEmployees from './components/siteAdmin/ViewEmployees';
import SiteProgress from './components/siteAdmin/SiteProgress';



// const PrivateRoute = ({ element: Component, allowedRoles }) => {
//   const user = getUserFromStorage();
//   return user && allowedRoles.includes(user.role) 
//       ? Component 
//       : <Navigate to="/login" />;
// };

function App() {
  return (
    <div className="App">
      <Router>
            <Routes>
                {/* Login Page Route */}
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />

                <Route path="/employee" element={<Employee />} />
                <Route path="/superAdmin" element={<SuperAdmin />} />
                <Route path="/siteAdmin" element={<SiteAdmin />} />

                <Route path="/siteAdmin/site-home" element={<Home />} />
                <Route path="/siteAdmin/add-employee" element={<AddEmployee />} />
               <Route path="/siteAdmin/view-employees" element={<ViewEmployees />} />
              <Route path="/siteAdmin/site-progress" element={<SiteProgress />} />

            </Routes>
        </Router>
    </div>
  );
}

export default App;
