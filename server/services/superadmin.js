const superAdmin=require('../models/superAdmin');
const Sites=require('../models/sites');
const SiteAdmins=require('../models/siteAdmin');
// const getIdByEmail = async (req, res) => {
//     const email = req.params.email;
//     console.log(email)
//     try {
//         const user = await superAdmin.findOne({ email: email });
//         if (!user) {
//             return res.status(404).json({ message: "not found" }); // Ensure a return here to avoid sending another response later.
//         }
//         res.status(200).json({ id: user.id });
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
// };
const getSiteAdmins=async (req,res)=>{
    const id = req.params.id;
    console.log("Received superadminId: " + id);
    try {
        const siteadmins = await SiteAdmins.find({superadminId:id,isDeleted:false});
        if (!siteadmins) {
            return res.status(404).json({ message: "not found" }); // Ensure a return here to avoid sending another response later.
        }
        console.log(siteadmins);
        res.status(200).json({ details: siteadmins});
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
const getSitesById=async(req,res)=>{
    const id = req.params.id;
    console.log(id);
    try {
        const sites = await Sites.find({siteadminId:id});
        if (!sites) {
            return res.status(404).json({ message: "not found" }); // Ensure a return here to avoid sending another response later.
        }
        console.log(sites);
        res.status(200).json({ details: sites});
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
const postSiteAdmin = async (req, res) => {
    try {
        const { siteadminId, name, email, password, isDeleted,superadminId } = req.body;

        // Create a new site admin document
        const newSiteAdmin = new SiteAdmins({
            siteadminId,
            name,
            email,
            password, // Ensure you hash the password before saving it in production
            isDeleted: isDeleted || false, // Default value if not provided
            superadminId
        });
     console.log(newSiteAdmin);
        // Save the new site admin to the database
        await newSiteAdmin.save();

        // Send a success response
        res.status(201).json({ message: 'SiteAdmin added successfully', admin: newSiteAdmin });
    } catch (err) {
        // Handle errors and send a 500 response
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to add site admin', details: err.message });
    }
};
const postSites = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { siteId,name, location, siteImage, siteInfo, siteadminId } = req.body;

        // Create a new site object
        const newSite = new Sites({
            siteId,
            name,
            location,
            siteImage,
            siteInfo,
            siteadminId,
            progress: 0, // Default progress
            progressImages: [], // Default empty array for progress images
         // Assuming siteId will be generated later
        });

        // Save the new site to the database
        await newSite.save();

        // Send a success response
        res.status(201).json({ message: 'Site added successfully', site: newSite });
    } catch (err) {
        // Handle errors and send a 500 response
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to add site', details: err.message });
    }
};
const postSuperAdmin=async(req,res)=>{
    try { // Destructure the required fields from the request body
        const { id,name, email, password, isDeleted } = req.body;

        // Create a new site object
        const newSuperAdmin = new superAdmin({
            id,
            name,
            email,
            password,
            isDeleted
        });

      
        await newSuperAdmin.save();
        // Send a success response
        console.log("Site added successfully");
        res.status(201).json({ message: 'SuperAdmin added successfully', superAdmin: newSuperAdmin });
    } catch (err) {
        // Handle errors and send a 500 response
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to add superAdmin', details: err.message });
    }
}
const updateSite=async(req,res)=>{
    try {
        // Get site email from request params
        const siteId = req.params.id;
  
        const updateData = {
          name: req.body.name,
          location: req.body.location,
          siteadminId: req.body.siteadminId,
          progress: req.body.progress,
          progressImages: req.body.progressImages,
          siteImage: req.body.siteImage,
          siteInfo: req.body.siteInfo
        };
        // Find the site by email and update it with the new data
        const updatedSite = await Sites.findOneAndUpdate(
          { siteId: siteId }, // Find by email
          { $set: updateData }, // Update fields
          { new: true } // Return the updated document
        );
    
        if (!updatedSite) {
          // If no site found with the provided email
          return res.status(404).json({ error: 'Site not found' });
        }
    
        // Return the updated site details in the response
        res.status(200).json({ message: 'Site updated successfully', updatedSite });
    
      }catch (err) {
        // Handle errors and send a 500 response
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to update site', details: err.message });
    }
}
const deleteSite=async(req,res)=>{
    try {
        const siteId = req.params.id;
        const deletedSite = await Sites.findOneAndDelete({siteId:siteId});
    
        if (!deletedSite) {
          // If no site found with the provided email
          return res.status(404).json({ error: 'Site not found' });
        }
    
        // Return the updated site details in the response
        res.status(200).json({ message: 'Site deleted successfully', deletedSite });
    
      }catch (err) {
        // Handle errors and send a 500 response
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to delete site', details: err.message });
    }
}
module.exports={
    getSiteAdmins,
    getSitesById,
    postSiteAdmin,
    postSites,
    postSuperAdmin,
    updateSite,
    deleteSite
}