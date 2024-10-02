const express = require('express');
const dailyRecordsController = require('../services/dailyRecords');
const router = express.Router();

router.post('/attendance', dailyRecordsController.createAttendance);
router.get('/attendance/:empId', dailyRecordsController.getUserAttendance);
router.get('/attendance', dailyRecordsController.getAllAttendance);
router.put('/attendance/:id', dailyRecordsController.updateAttendance);
router.delete('/attendance/:id', dailyRecordsController.deleteAttendance);
router.post('/attendance/logout', dailyRecordsController.logoutAttendance);
router.put('/signOut', dailyRecordsController.signOut);

module.exports = router;