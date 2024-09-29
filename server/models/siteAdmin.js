const mongoose = require('../config/database');

const siteadminSchema = new mongoose.Schema({
    siteadminId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Store as a hashed password
    superadminId: { type: String, required: true },  // Reference to the superadmin
    isDeleted: { type: Boolean, default: false }
  }, { timestamps: true });
  

  module.exports = mongoose.model('siteadmin', siteadminSchema);

