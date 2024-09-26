const express = require('express');
import services from '../services/siteadmin';
const app=express();

app.get('/employee',services.getEmployees);
app.get('/employee/:id',services.getEmployeeById);
app.post('/employee',services.addEmployee);
app.get('/sites/:id',services.getSiteDetails);
app.put('/sites/:id',services.updateSiteDetails);
app.get('/dailyrecords/:id',services.getDailyRecords);
app.put('/dailyrecords/',services.updateDailyRecords);

module.exports=app;