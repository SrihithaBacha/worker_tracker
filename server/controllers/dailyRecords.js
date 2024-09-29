const express = require('express');
const dailyRecordsController = require('../services/dailyRecords');
const router = express.Router();

router.post('/attendance', dailyRecordsController.createAttendance);
router.get('/attendance/:employeeId', dailyRecordsController.getUserAttendance);
router.get('/attendance', dailyRecordsController.getAllAttendance);
router.put('/attendance/:id', dailyRecordsController.updateAttendance);
router.delete('/attendance/:id', dailyRecordsController.deleteAttendance);
router.post('/attendance/logout', dailyRecordsController.logoutAttendance);

module.exports = router;