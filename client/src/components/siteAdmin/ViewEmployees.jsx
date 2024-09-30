import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ViewEmployee.css'; // Corrected import path
import Navbar from './Navbar';

const ViewEmployee = () => {
  // Retrieve siteId from localStorage
  const siteId = localStorage.getItem('siteId');

  // State variables
  const [employees, setEmployees] = useState([]);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch employees and daily records on component mount
  useEffect(() => {
    if (!siteId) {
      setErrorMessage('Site ID not found. Please log in again.');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch employees under the site
        const employeesResponse = await axios.get(`http://localhost:5000/employee/undersite/${siteId}`);
        // Filter out deleted employees
        const activeEmployees = employeesResponse.data.employees.filter(emp => !emp.isDeleted);
        setEmployees(activeEmployees);
        setFilteredEmployees(activeEmployees);

        // Fetch all daily records for the site up to today
        const recordsResponse = await axios.get(`http://localhost:5000/dailyrecords/${siteId}`);
        setDailyRecords(recordsResponse.data.records);

        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load employees or daily records.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [siteId]);

  // Handle search query
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(query.toLowerCase()) ||
      emp.empId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  // Handle clicking on employee name to open dialog
  const handleNameClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDialog(true);
  };

  // Handle deleting an employee
  const handleDelete = async (empId) => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      // Delete employee via PUT /employee/delete/:empId
      await axios.put(`http://localhost:5000/employee/delete/${empId}`);
      // Delete user via DELETE /users/:empId
    
      // Remove employee from state
      const updatedEmployees = employees.filter(emp => emp.empId !== empId);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.empId.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setSuccessMessage('Employee deleted successfully.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting employee:', error);
      setErrorMessage('Error deleting employee.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total days from joiningDate to today
  const calculateTotalDays = (joiningDate) => {
    const startDate = new Date(joiningDate);
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including today
    return diffDays;
  };

  // Calculate number of present days
  const calculatePresentDays = (empId, joiningDate) => {
    const startDate = new Date(joiningDate);
    const today = new Date();
    // Filter daily records for the employee from joining date to today
    const presentRecords = dailyRecords.filter(record => {
      const recordDate = new Date(record.checkIn);
      return record.empId === empId && recordDate >= startDate && recordDate <= today;
    });
    return presentRecords.length;
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = (presentDays, totalDays) => {
    if (totalDays === 0) return '0.00%';
    const percentage = (presentDays / totalDays) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  // Check if employee is present today
  const isEmployeePresentToday = (empId) => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return dailyRecords.some(record => 
      record.empId === empId &&
      record.checkIn >= todayStart &&
      record.checkIn < todayEnd
    );
  };

  // Get today's daily record for the employee
  const getTodaysRecord = (empId) => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return dailyRecords.find(record => 
      record.empId === empId &&
      record.checkIn >= todayStart &&
      record.checkIn < todayEnd
    );
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return 'Absent';
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Navbar />
      <div className="employee-table-container">
        <h2>Employee Management</h2>

        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Employee ID or Name"
          className="search-bar"
        />

        {/* Display Error or Success Messages */}
        {errorMessage && <div className="message error-message">{errorMessage}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}

        {/* Loading Spinner */}
        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {/* Employee Table */}
        {!loading && (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Attendance</th>
                <th>Total Attendance</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
                <th>Work Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => {
                  const totalDays = calculateTotalDays(employee.joiningDate);
                  const presentDays = calculatePresentDays(employee.empId, employee.joiningDate);
                  const attendancePercentage = calculateAttendancePercentage(presentDays, totalDays);
                  const isPresentTodayFlag = isEmployeePresentToday(employee.empId);
                  const todaysRecord = isPresentTodayFlag ? getTodaysRecord(employee.empId) : null;

                  return (
                    <tr key={employee.empId}>
                      <td className="employee-name">
                        <span className="name-link" onClick={() => handleNameClick(employee)}>
                          {employee.dp ? (
                            <img src={employee.dp} alt={`${employee.name} DP`} className="dp-image" />
                          ) : (
                            <div className="dp-placeholder">No Image</div>
                          )}
                          {employee.name}
                        </span>
                      </td>
                      <td>{isPresentTodayFlag ? '✅' : '❌'}</td>
                      <td>
                        {presentDays} / {totalDays} ({attendancePercentage})
                      </td>
                      <td>{todaysRecord ? formatTime(todaysRecord.checkIn) : 'Absent'}</td>
                      <td>{todaysRecord ? formatTime(todaysRecord.checkOut) : 'Absent'}</td>
                      <td>{todaysRecord ? todaysRecord.work.workStatus : 'Absent'}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(employee.empId)}
                          aria-label={`Delete ${employee.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Employee Details Dialog */}
        {showDialog && selectedEmployee && (
          <div className="employee-dialog-overlay">
            <div className="employee-dialog">
              <h3>Employee Details</h3>
              <div className="dialog-content">
                <p><strong>ID:</strong> {selectedEmployee.empId}</p>
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Contact:</strong> {selectedEmployee.contact}</p>
                <p><strong>Work Type:</strong> {selectedEmployee.workertype || 'N/A'}</p>
                <p><strong>Joining Date:</strong> {new Date(selectedEmployee.joiningDate).toLocaleDateString()}</p>
                <button className="close-dialog-btn" onClick={() => setShowDialog(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewEmployee;
