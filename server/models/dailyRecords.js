const mongoose = require('../config/database');
// const locationSchema = new mongoose.Schema({
//   latitude: { type: Number, required: true },
//   longitude: { type: Number, required: true }
// });

// const dailyRecordSchema = new mongoose.Schema({
//   employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true },
//   site: { type: mongoose.Schema.Types.ObjectId, ref: 'sites', required: true },
//   checkInTime: { type: Date },
//   checkOutTime: { type: Date },
//   checkInImage: { type: String },//base64
//   checkOutImage: { type: String },//base64
//   workStatus: { type: String },
//   location: { type: locationSchema, required: true },
//   createdAt: { type: Date, default: Date.now }
// });
const dailyRecordSchema = new mongoose.Schema({
  empId: { type: String, required: true },  // Reference to the employee
  siteId: { type: String, required: true },  // Reference to the site
  checkIn: { type: Date, required: true },  // Check-in time
  checkOut: { type: Date },  // Check-out time
  selfies: [{ type: String }],  // Array of selfie URLs
  location: { 
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true }
  },
  work: { 
    workAssigned: { type: String, required: true },
    workStatus: { type: String, required: true, enum: ['pending', 'in-progress', 'completed'] },
    remark: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('dailyrecords', dailyRecordSchema);