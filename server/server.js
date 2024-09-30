const express = require("express");
const dotenv = require("dotenv");
const path = require('path');
const cors = require('cors');
const {login}=require('./controllers/authController');
const attendanceRoutes = require('./controllers/dailyRecords.js');
const Site = require('./models/sites');

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
dotenv.config();
app.use(express.json({ limit: '10mb' }));
// Increase URL-encoded payload limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.post('/api/login',login);
//app.use( require("./controllers/employee") );
app.use( require("./controllers/siteadmin") );
app.use( require("./controllers/superadmin") );

app.use('/api', attendanceRoutes);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

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


const multer = require('multer');

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

  // Update the site with the new image reference in your database
  // Assuming you have a Site model
  const updatedSite = await Site.findOneAndUpdate(
    { "siteId": siteId },  // Use an object as the filter
    { $push: { progressImages: imagePath } },
    { new: true }  // Return the updated document
  );
  
  res.json({ progressImages: updatedSite.progressImages });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
