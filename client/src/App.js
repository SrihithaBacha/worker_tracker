import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Employee from './components/employee/employee';
import Login from './components/login/login'; 
import SuperAdmin from './components/superAdmin/superAdmin'; 
import SiteAdmin from './components//siteAdmin/siteAdmin'; 
import { getUserFromStorage } from './services/authService';
import Home from './components/siteAdmin/Home';
import AddEmployee from './components/siteAdmin/AddEmployee';
import ViewEmployees from './components/siteAdmin/ViewEmployees';
import SiteProgress from './components/siteAdmin/SiteProgress';
import Attendance from './components/employee/Attendance';
import WorkerInfo from './components/employee/WorkerInfo';
import AttendanceTable from './components/employee/AttendanceTable';
import WorkPost from './components/employee/WorkPost';
import Logout from './components/employee/Logout';




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
          
          {/* Employee Routes */}
          <Route path="/employee" element={<PrivateRoute allowedRoles={['employee']} element={<Employee />} />}>
            <Route index element={<WorkerInfo />} />
            <Route path="worker-info" element={<WorkerInfo/>} />
            <Route path="attendance" element={<Attendance  />} />
            <Route path="attendance-table" element={<AttendanceTable />} />
            <Route path="work-post" element={<WorkPost/>} />
            <Route path="logout" element={<Logout  />} />
          </Route>

                <Route path="/employee" element={<Employee />} />
                <Route path="/superAdmin" element={<SuperAdmin />} />
                <Route path="/siteAdmin" element={<SiteAdmin />} />

                {/* site-admin routes */}

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