import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Employee from './components/employee/employee';
import Login from './components/login/login'; 
import SuperAdmin from './components/superAdmin/superAdmin'; 
import SiteAdmin from './components//siteAdmin/siteAdmin'; 
import { getUserFromStorage } from './services/authService';
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
  const employeeId = '66f645e5b11fe15eb98ae94b';
  const siteId = '66f64661b11fe15eb98ae952';
  // make the above values dynamic by fetching from the user object from the local storage 
  // the values are from dailyRecords schema in the server side 
  // the values are the _id of the user dailyrecoreds in the dailyrecords collection in the database

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Login Page Route */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
          
          {/* Employee Routes */}
          <Route path="/employee" element={<PrivateRoute allowedRoles={['employee']} element={<Employee />} />}>
            <Route index element={<WorkerInfo employeeId={employeeId} />} />
            <Route path="worker-info" element={<WorkerInfo employeeId={employeeId} />} />
            <Route path="attendance" element={<Attendance employeeId={employeeId} siteId={siteId} />} />
            <Route path="attendance-table" element={<AttendanceTable employeeId={employeeId} />} />
            <Route path="work-post" element={<WorkPost employeeId={employeeId} siteId={siteId} />} />
            <Route path="logout" element={<Logout employeeId={employeeId} siteId={siteId} />} />
          </Route>

          {/* SuperAdmin and SiteAdmin Routes */}
          <Route path="/superAdmin" element={<PrivateRoute allowedRoles={['superAdmin']} element={<SuperAdmin />} />} />
          <Route path="/siteAdmin" element={<PrivateRoute allowedRoles={['siteAdmin']} element={<SiteAdmin />} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;