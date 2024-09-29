const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const attendanceRoutes = require('./controllers/dailyRecords.js');
const employeeRoutes = require('./controllers/employee.js');
const { login } = require('./controllers/authController.js'); // Ensure this path is correct
const Site = require('./models/sites');
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use('/api', attendanceRoutes);
app.use('/api/employees', employeeRoutes);

app.post('/api/sites/:siteId/images', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const site = await Site.findById(req.params.siteId);
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    site.progressImages.push(image);
    await site.save();

    res.status(201).json(site);
  } catch (error) {
    console.error('Error adding image to site:', error);
    res.status(500).json({ error: 'Failed to add image to site' });
  }
});

app.post('/api/login', login);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});