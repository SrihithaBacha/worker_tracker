const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Employee = require('../models/employee');
const Site = require('../models/sites');
const SiteAdmin=require('../models/siteAdmin');
const DailyRecord = require('../models/dailyRecords');
const nodemailer = require('nodemailer'); 
const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.email_username, 
    pass: process.env.email_password,  
  },
});

const addEmployee = async (req, res) => {
  try {
    const { siteId, name, email, contact, dp } = req.body;

    if (!siteId || !name || !email || !contact) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const existingEmployee = await Employee.findOne({ email, isDeleted: false });
    if (existingEmployee) {
      return res.status(409).json({ message: 'Employee with this email already exists.' });
    }

    const empId = `EMP-${uuidv4()}`;
    const newEmployee = new Employee({
      empId,
      siteId,
      name,
      email,
      contact,
      dp: dp || '',
      password: name,
      joiningDate: new Date(),
    });

    await newEmployee.save();

   
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to the Company',
      text: `Dear ${name},\n\nYou have been successfully added to the system as an employee. Your default login password is your name: ${name}. Please change it after logging in.\n\nBest regards,\nCompany Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({
      message: 'Employee added successfully.',
      employee: {
        empId: newEmployee.empId,
        name: newEmployee.name,
        email: newEmployee.email,
        contact: newEmployee.contact,
        dp: newEmployee.dp,
        joiningDate: newEmployee.joiningDate,
      },
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get Employees by Site ID
const getEmployees = async (req, res) => {
  try {
    const { siteId } = req.params;
    const employees = await Employee.find({ siteId, isDeleted: false }).select('-password');
    res.status(200).json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get Employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id: empId } = req.params;
    if (!empId) {
      return res.status(400).json({ message: 'Employee ID is required.' });
    }

    const employee = await Employee.findOne({ empId, isDeleted: false }).select('-password');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.status(200).json({ employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get Sites under a Site Admin
const getSitesUnderSiteAdmin = async (req, res) => {
  try {
    const siteadminId = req.params.id;

    if (siteadminId) {
      const sites = await Site.find({ siteadminId }).select('siteId name location progress');
      return res.status(200).json({ sites });
    } else {
      return res.status(400).json({ message: 'Invalid identifier or missing siteadminId.' });
    }
  } catch (error) {
    console.error('Error fetching sites under site admin:', error);
    res.status(500).json({ message: 'No sites found' });
  }
};

// Get Site Details
const getSiteDetails = async (req, res) => {
  try {
    const { id: siteId } = req.params;


    const site = await Site.findOne({ siteId });
    if (!site) {
      return res.status(404).json({ message: 'Site not found.' });
    }

    res.status(200).json({ site });
  } catch (error) {
    console.error('Error fetching site details:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateSiteDetails = async (req, res) => {
  try {
    const { id: siteId } = req.params;
    const { progress, progressImages, siteImage, siteInfo } = req.body;

    if (!siteId) {
      return res.status(400).json({ message: 'Site ID is required in the URL parameter.' });
    }

    const site = await Site.findOne({ siteId });
    if (!site) {
      return res.status(404).json({ message: 'Site not found.' });
    }

    if (progress !== undefined) {
      if (progress < 0 || progress > 100) {
        return res.status(400).json({ message: 'Progress must be between 0 and 100.' });
      }
      site.progress = progress;
    }

    if (progressImages) {
      if (!Array.isArray(progressImages)) {
        return res.status(400).json({ message: 'progressImages must be an array of URLs.' });
      }
      site.progressImages = progressImages;
    }

    if (siteImage) {
      site.siteImage = siteImage;
    }

    if (siteInfo) {
      site.siteInfo = siteInfo;
    }

    await site.save();
    res.status(200).json({ message: 'Site details updated successfully.', site });
  } catch (error) {
    console.error('Error updating site details:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getDailyRecords = async (req, res) => {
  try {
    const { id: siteId } = req.params;
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const records = await DailyRecord.find({
      siteId,
      checkIn: { $gte: startOfDay, $lte: endOfDay },
    });

    const no_of_presentees= await DailyRecord.countDocuments({
      siteId,
      checkIn: { $gte: startOfDay, $lte: endOfDay },
    })
    res.status(200).json({ records , "presentees":no_of_presentees });
  } catch (error) {
    console.error('Error fetching daily records:', error);
    res.status(500).json({ message: 'Internal server error.'});
  }
};

const updateDailyRecords = async (req, res) => {
  try {
    const { empId, remark, checkIn } = req.body;

    const dailyRecord = await DailyRecord.findOne({ empId, checkIn });

    if (!dailyRecord) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    if (remark) {
      dailyRecord.work.remark = remark;
    }

    await dailyRecord.save();
    res.status(200).json({ message: 'Record updated successfully.', dailyRecord });
  } catch (error) {
    console.error('Error updating daily records:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const removeEmployee = async (req, res) => {
  try {
    const { id: empId } = req.params;

    const employee = await Employee.findOne({ empId, isDeleted: false });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    employee.isDeleted = true;
    await employee.save();

    res.status(200).json({ message: 'Employee removed successfully.' });
  } catch (error) {
    console.error('Error removing employee:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getSiteByEmail = async(req,res)=>{
  try {
    const email = req.query.email; 

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const siteAdmin = await SiteAdmin.findOne({ email: email });
    if (!siteAdmin) {
      return res.status(404).json({ message: 'Site admin not found' });
    }

    // Find sites by siteadminId from the SiteAdmin collection
    const sites = await Site.find({ siteadminId: siteAdmin.siteadminId });

    if (!sites.length) {
      return res.status(404).json({ message: 'No sites found for this site admin' });
    }

    // Return the sites associated with the site admin
    return res.status(200).json({sites:sites , siteAdmin:siteAdmin});
    
  } catch (error) {
    console.error('Error fetching site details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSiteByEmail,
  addEmployee,
  getEmployees,
  getEmployeeById,
  getSiteDetails,
  updateSiteDetails,
  getDailyRecords,
  updateDailyRecords,
  removeEmployee,
  getSitesUnderSiteAdmin,
};
