const express = require('express');
const employeeController = require('../services/employee');
const router = express.Router();

router.post('/employee', employeeController.createEmployee);
router.get('/employee/:id', employeeController.getEmployeeById);
router.get('/employee', employeeController.getAllEmployees);
router.put('/employee/:id', employeeController.updateEmployee);
router.delete('/employee/:id', employeeController.deleteEmployee);

module.exports = router;