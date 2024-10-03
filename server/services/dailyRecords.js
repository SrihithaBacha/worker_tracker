const mongoose = require('mongoose');
const Attendance = require('../models/dailyRecords');

const createAttendance = async (req, res) => {
  try {
    const { empId, siteId, checkIn, checkOut, selfies, location, work } = req.body;

    // Validate required fields
    if (!empId || !siteId || !checkIn || !location || !work || !work.workAssigned || !work.workStatus) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    // Validate checkIn is a valid date
    const checkInDate = new Date(checkIn);
    if (isNaN(checkInDate.getTime())) {
      return res.status(400).send({ error: 'Invalid check-in time' });
    }

    // Calculate the start and end of the day for the check-in time
    const startOfDay = new Date(checkInDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(checkInDate.setHours(23, 59, 59, 999));

    // Log the date range for attendance check
    console.log('Date range for attendance check:', { startOfDay, endOfDay });

    // Find existing attendance record for the day
    let attendance = await Attendance.findOne({
      empId,
      checkIn: { $gte: startOfDay, $lte: endOfDay }
    });

    if (attendance) {
      // Update the existing selfie if attendance record exists
      if (selfies && selfies.length > 0) {
        attendance.selfies[0] = selfies[0]; // Update login selfie
      }
      attendance.checkIn = checkIn;
      attendance.checkOut = checkOut;
      attendance.location = location;
      attendance.work = work;
      await attendance.save();
    } else {
      // Create a new attendance record if none exists
      attendance = new Attendance({
        empId,
        siteId,
        checkIn,
        checkOut,
        selfies: selfies ? [selfies[0]] : [], // Initialize with login selfie
        location,
        work
      });
      await attendance.save();
    }

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
    const { empId, checkOut, selfies, location } = req.body;

    // Log the incoming data
    console.log('Incoming logout data:', req.body);

    // Find and update the attendance record for the day
    const attendance = await Attendance.findOne({
      empId,
      checkIn: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    if (!attendance) {
      return res.status(404).send({ error: 'Attendance record not found' });
    }

    if (selfies && selfies.length > 0) {
      attendance.selfies[1] = selfies[0]; // Update logout selfie
    }
    attendance.checkOut = checkOut;
    attendance.location = location;
    await attendance.save();

    res.status(200).send(attendance);
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(400).send({ error: 'Failed to log out' });
  }
};

const signOut = async (req, res) => {
  const { empId, siteId, workStatus } = req.body;

  if (!empId || !siteId || !workStatus) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Calculate the start and end of the day for the current date
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    // Find the existing attendance record for the day
    const attendance = await Attendance.findOne({
      empId,
      siteId,
      checkIn: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Update the workStatus inside the work object
    attendance.work.workStatus = workStatus;
    await attendance.save();

    res.status(200).json({ message: 'Work status updated successfully', record: attendance });
  } catch (error) {
    console.error('Error updating work status:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    const { empId } = req.params;

    // Validate the empId
    if (!empId) {
      return res.status(400).send({ error: 'Employee ID is required' });
    }

    // Find attendance records for the given empId
    const attendanceRecords = await Attendance.find({ empId });

    if (!attendanceRecords || attendanceRecords.length === 0) {
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
    const { siteId } = req.body;

    // Validate the siteId
    if (siteId && !mongoose.Types.ObjectId.isValid(siteId)) {
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
  deleteAttendance,
  signOut,
};