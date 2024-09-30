const express = require('express');
const services=require('../services/siteadmin');
const app=express();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post('/sites/progressImages', upload.single('image'),services.updateProgressImages);
app.get('/employee/undersite/:id',services.getEmployees);
app.get('/employee/:id',services.getEmployeeById);
app.post('/employee',services.addEmployee);
app.get('/sites/:id',services.getSiteDetails);
app.get('/sites-email',services.getSiteByEmail);
app.get('/sites/undersiteadmin/:id',services.getSitesUnderSiteAdmin);
app.put('/sites/:id',services.updateSiteDetails);
app.get('/dailyrecords/:id',services.getDailyRecords);
app.put('/dailyrecords',services.updateDailyRecords);
app.put('/employee/delete/:id',services.removeEmployee);

module.exports=app;
