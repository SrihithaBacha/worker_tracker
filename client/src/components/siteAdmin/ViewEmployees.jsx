// src/components/EmployeeTable.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ViewEmployee.css';
import Navbar from './Navbar';

const EmployeeTable = () => {
  // Retrieve siteId from localStorage
  const siteId = localStorage.getItem('siteId');

  // State variables
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [remarkInput, setRemarkInput] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch employees on component mount
  useEffect(() => {
    if (!siteId) {
      setErrorMessage('Site ID not found. Please log in again.');
      return;
    }

    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/employee/${siteId}`);
        setEmployees(response.data);
        setFilteredEmployees(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching employees:', error);
        setErrorMessage('Failed to load employees.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [siteId]);

  // Handle search query
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = employees.filter(emp =>
      emp.emp_name.toLowerCase().includes(query.toLowerCase()) ||
      emp.emp_id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  // Handle opening the dialog box with employee details
  const handleHamburgerClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDialog(true);
  };

  // Handle deleting an employee
  const handleDelete = async (emp_id) => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/employee/${siteId}/${emp_id}`);
      await axios.delete(`http://localhost:5000/users/${emp_id}`);
      setEmployees(employees.filter(emp => emp.emp_id !== emp_id));
      setFilteredEmployees(filteredEmployees.filter(emp => emp.emp_id !== emp_id));
      setSuccessMessage('Employee deleted successfully.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting employee:', error);
      setErrorMessage('Error deleting employee.');
      setSuccessMessage('');
    }
  };

  // Handle remarks input change
  const handleRemarksChange = (emp_id, value) => {
    setRemarkInput((prev) => ({ ...prev, [emp_id]: value }));
  };

  // Handle adding remarks
  const handleAddRemark = async (employee) => {
    if (!remarkInput[employee.emp_id] || remarkInput[employee.emp_id].trim() === '') {
      setErrorMessage('Remark cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const updatedEmployee = { ...employee, today_remarks: remarkInput[employee.emp_id] };
      await axios.put(`http://localhost:5000/employee/${siteId}/${employee.emp_id}`, updatedEmployee);
      setEmployees(employees.map(emp => (emp.emp_id === employee.emp_id ? updatedEmployee : emp)));
      setFilteredEmployees(filteredEmployees.map(emp => (emp.emp_id === employee.emp_id ? updatedEmployee : emp)));
      setRemarkInput((prev) => ({ ...prev, [employee.emp_id]: '' }));
      setSuccessMessage('Remark added successfully.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding remark:', error);
      setErrorMessage('Failed to add remark.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Toggle the add remark input field
  const toggleRemarkInput = (emp_id) => {
    setRemarkInput((prev) => ({
      ...prev,
      [emp_id]: prev[emp_id] ? '' : '',
    }));
    setErrorMessage('');
    setSuccessMessage('');
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
                <th>Work Assigned</th>
                <th>Work Status</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.emp_id}>
                    <td className="employee-name">
                      {employee.dp ? (
                        <img src={employee.dp} alt="DP" className="dp-image" />
                      ) : (
                        <div className="dp-placeholder">No Image</div>
                      )}
                      {employee.emp_name}
                      <button
                        className="hamburger-menu"
                        onClick={() => handleHamburgerClick(employee)}
                        aria-label={`View details of ${employee.emp_name}`}
                      >
                        &#x2630;
                      </button>
                    </td>
                    <td>{employee.today_status === 'Present' ? '✅' : '❌'}</td>
                    <td>{employee.total_attendances} / 30</td>
                    <td>{employee.check_in_time ? new Date(employee.check_in_time).toLocaleTimeString() : 'N/A'}</td>
                    <td>{employee.check_out_time ? new Date(employee.check_out_time).toLocaleTimeString() : 'N/A'}</td>
                    <td>{employee.today_work_assigned}</td>
                    <td>{employee.today_work_status}</td>
                    <td>
                      {employee.today_remarks ? (
                        <span>{employee.today_remarks}</span>
                      ) : (
                        <button
                          className="add-remark-btn"
                          onClick={() => toggleRemarkInput(employee.emp_id)}
                        >
                          Add Remark
                        </button>
                      )}
                      {remarkInput.hasOwnProperty(employee.emp_id) && (
                        <div className="remark-input-container">
                          <input
                            type="text"
                            value={remarkInput[employee.emp_id] || ''}
                            onChange={(e) => handleRemarksChange(employee.emp_id, e.target.value)}
                            placeholder="Enter remark"
                            className="remark-input"
                          />
                          <button
                            className="submit-remark-btn"
                            onClick={() => handleAddRemark(employee)}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(employee.emp_id)}
                        aria-label={`Delete ${employee.emp_name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">
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
                <p><strong>ID:</strong> {selectedEmployee.emp_id}</p>
                <p><strong>Name:</strong> {selectedEmployee.emp_name}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Job Title:</strong> {selectedEmployee.job_title}</p>
                <p><strong>Contact:</strong> {selectedEmployee.contact}</p>
                <p><strong>Work Type:</strong> {selectedEmployee.workertype}</p>
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

export default EmployeeTable;
