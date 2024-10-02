const express = require("express");
const dotenv = require("dotenv");
const path = require('path');
const cors = require('cors');
const { login } = require('./controllers/authController');
const attendanceRoutes = require('./controllers/dailyRecords.js');
const Site = require('./models/sites');
const multer = require('multer');

dotenv.config(); // Load environment variables

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.post('/api/login', login);
app.use(require("./controllers/siteadmin"));
app.use(require("./controllers/superadmin"));
app.use('/api', attendanceRoutes);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets'); // Store images in the assets folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post('/sites/progressImages', upload.single('image'), async (req, res) => {
  const { siteId } = req.body;
  const imagePath = req.file.filename; // Get the stored image filename

  try {
    // Update the site with the new image reference in your database
    const updatedSite = await Site.findOneAndUpdate(
      { siteId },  // Use an object as the filter
      { $push: { progressImages: { image: imagePath } } },
      { new: true, runValidators: true }  // Return the updated document
    );

    if (!updatedSite) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.status(201).json({ progressImages: updatedSite.progressImages });
  } catch (error) {
    console.error('Error adding image to site:', error);
    res.status(500).json({ error: 'Failed to add image to site' });
  }
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});