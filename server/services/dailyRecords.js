const mongoose = require('mongoose');
const Attendance = require('../models/dailyRecords');

const createAttendance = async (req, res) => {
  try {
    const { employee, site, checkInTime, checkOutTime, checkInImage, checkOutImage, workStatus, location } = req.body;
    

    // Validate required fields
    if (!employee || !site || !checkInImage || !location) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    // Validate ObjectId for site and employee
    if (!mongoose.Types.ObjectId.isValid(site)) {
      return res.status(400).send({ error: 'Invalid site ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(employee)) {
      return res.status(400).send({ error: 'Invalid employee ID' });
    }

    // Convert site and employee to ObjectId
    const siteObjectId = mongoose.Types.ObjectId.isValid(site) 
  ? new mongoose.Types.ObjectId(site) 
  : null;

const employeeObjectId = mongoose.Types.ObjectId.isValid(employee) 
  ? new mongoose.Types.ObjectId(employee) 
  : null;

// If either is invalid, return an error response
if (!siteObjectId) {
  return res.status(400).send({ error: 'Invalid site ID' });
}

if (!employeeObjectId) {
  return res.status(400).send({ error: 'Invalid employee ID' });
}

    // Validate checkInTime is a valid date
    const checkInDate = new Date(checkInTime);
    if (isNaN(checkInDate.getTime())) {
      return res.status(400).send({ error: 'Invalid check-in time' });
    }

    // Calculate the start and end of the day for the check-in time
    const startOfDay = new Date(checkInDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(checkInDate.setHours(23, 59, 59, 999));

    // Log the date range for attendance check
    console.log('Date range for attendance check:', { startOfDay, endOfDay });

    // Find and update existing attendance record for the day
    let attendance = await Attendance.findOneAndUpdate(
      { employee: employeeObjectId, checkInTime: { $gte: startOfDay, $lte: endOfDay } },
      {
        employee: employeeObjectId,
        site: siteObjectId,
        checkInTime,
        checkOutTime,
        checkInImage,
        checkOutImage,
        workStatus,
        location
      },
      { new: true, upsert: true, setDefaultsOnInsert: true } // upsert: creates new if none found
    );

    // Log the attendance update or creation
    console.log('Attendance record updated/created:', attendance);

    res.status(201).send(attendance);

  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).send({ error: 'Internal server error while submitting attendance' });
  }
};


const logoutAttendance = async (req, res) => {
  try {
    const { employee, checkOutTime, checkOutImage, location } = req.body;

    // Log the incoming data
    console.log('Incoming logout data:', req.body);

    // Find and update the attendance record for the day
    const attendance = await Attendance.findOneAndUpdate(
      { employee, checkInTime: { $gte: new Date().setHours(0, 0, 0, 0) } },
      { checkOutTime, checkOutImage, location },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).send({ error: 'Attendance record not found' });
    }

    res.status(200).send(attendance);
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(400).send({ error: 'Failed to log out' });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find();
    res.status(200).send(attendanceRecords);
  } catch (error) {
    res.status(400).send({ error: 'Failed to fetch attendance records' });
  }
};

const getUserAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Validate the employeeId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).send({ error: 'Invalid employee ID' });
    }

    // Find attendance records for the given employeeId
    const attendanceRecords = await Attendance.find({ employee: employeeId });

    if (!attendanceRecords) {
      return res.status(404).send({ error: 'No attendance records found for this employee' });
    }

    res.status(200).send(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).send({ error: 'Failed to fetch attendance records' });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { site } = req.body;
    // Check if site is a valid ObjectId string
    if (site && mongoose.Types.ObjectId.isValid(site)) {
      req.body.site = new mongoose.Types.ObjectId(site);
    } else if (site) {
      return res.status(400).send({ error: 'Invalid site ID' });
    }

    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!attendance) {
      return res.status(404).send({ error: 'Attendance record not found' });
    }
    res.status(200).send(attendance);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update attendance record' });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).send({ error: 'Attendance record not found' });
    }
    res.status(200).send(attendance);
  } catch (error) {
    res.status(400).send({ error: 'Failed to delete attendance record' });
  }
};



module.exports = {
  createAttendance,
  logoutAttendance,
  getAllAttendance,
  getUserAttendance,
  updateAttendance,
  deleteAttendance
};