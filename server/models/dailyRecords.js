const mongoose = require('../config/database');
const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

const dailyRecordSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'sites', required: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  checkInImage: { type: String },//base64
  checkOutImage: { type: String },//base64
  workStatus: { type: String },
  location: { type: locationSchema, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('dailyRecords', dailyRecordSchema);