import '../config/database';

const siteSchema = new mongoose.Schema({
  siteId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  siteadminId: { type: String, required: true },  // Reference to the site admin
  progress: { type: Number, default: 0 },  // Site progress in percentage
  progressImages: [{ type: String }],  // Array of URLs for progress images
  siteImage: { type: String },  // URL to the main site image
  siteInfo: { type: String },  // Additional information about the site
}, { timestamps: true });


  module.exports = mongoose.model('sites', siteSchema);

