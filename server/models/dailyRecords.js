import '../config/database';

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

  module.exports = mongoose.model('dailyRecords', dailyRecordSchema);

