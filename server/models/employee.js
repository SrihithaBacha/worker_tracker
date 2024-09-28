const mongoose = require('mongoose');
require('../config/database');

const employeeSchema = new mongoose.Schema({
    empId: { type: String, required: true, unique: true },
    siteId: { type: String, required: true },  // Reference to the site
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Store as a hashed password
    name: { type: String, required: true },
    contact: { type: String, required: true },
    dp: { type: String },  // URL to the employee's display picture
    joiningDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false }
  }, { timestamps: true });
  
  

  module.exports = mongoose.model('employee', employeeSchema);

