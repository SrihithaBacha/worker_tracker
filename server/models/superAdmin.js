const mongoose = require('../config/database');

const superadminSchema = new mongoose.Schema({
    id: { type: String, required: true },  // Unique ID for the superadmin
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Store as a hashed password
    isDeleted: { type: Boolean, default: false }  // Soft delete flag
  }, { timestamps: true });  // Automatically adds createdAt and updatedAt
  

  module.exports = mongoose.model('superadmin', superadminSchema);

