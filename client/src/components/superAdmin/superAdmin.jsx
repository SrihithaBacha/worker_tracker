import React, { useEffect, useState } from "react";
import "./superAdmin.css";
import { getSites, addSite } from '../../services/siteService';
// import { addUser } from '../services/addUserService';
// import { addSiteAdmin } from '../services/siteAdminService';
import { addSiteAdmin } from '../../services/addSiteAdmin';
import { addSuperAdmin } from '../../services/addSuperAdmin';
import { updateSiteAdmin } from "../../services/updateSiteAdmin";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircleProgressBar from './CircleProgressBar';
import Popup from "./popup";
import Modal from "./Modal";
const SuperAdmin = () => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateStatus,setUpdateStatus]=useState(false);
  const [deleteStatus,setDeleteStatus]=useState(false);
  const [sites, setSites] = useState([]);
  const [sitePopup, setSitePopup] = useState(false);
  const [siteAdminPopup, setSiteAdminPopup] = useState(false);
  const [superAdminPopup, setSuperAdminPopup] = useState(false);
  const [siteadmins, setSiteadmins] = useState([]);
  const [deleteSiteName,setDeleteSiteName]=useState('');
  const [deleteSiteId,setDeleteSiteId]=useState('');
  const [updateSiteForm, setUpdateSiteForm] = useState(
    {
      siteId: "",
      name: "",
      location: "",
      siteadminId: "",
      progress: 0,
      progressImages: [],
      siteImage: "",
      siteInfo: "",
    }
  );
  const [formdata, setFormdata] = useState(
    {
      siteId: "",
      name: "",
      location: "",
      siteadminId: "",
      progress: 0,
      progressImages: [],
      siteImage: "",
      siteInfo: "",
    }
  );
  const [siteAdminFormdata, setSiteAdminFormdata] = useState({
    siteAdminId: "",
    name: "",
    email: "",
    password: "123456",
    superadminId: "",
    isDeleted: false
  });
  const [superAdminFormdata, setSuperAdminFormdata] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    isDeleted: false
  });
  const [view, setView] = useState('home'); // State to control the visible section
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [prevCard, setPrevCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state
  const [progress, setProgress] = useState(70);
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    if (selectedCard && !isAnimating) {
      setIsAnimating(true); // Start animation
      setPrevCard(selectedCard); // Store the currently selected card
      setTimeout(() => {
        setSelectedCard(card); // Set the new selected card after the closing animation
        setSelectedCardId(card.id);
        setIsAnimating(false); // Reset animation state
      }, 500); // Match with animation duration
    } else {
      setSelectedCard(card); // Set the new selected card if none is selected
      setSelectedCardId(card.id);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    if (!token) {
      navigate('/login'); // Redirect if not logged in
    } else {
      fetchSiteAdmins(); // Fetch site admins when the component mounts
    }
  }, []);
  useEffect(() => {
    if (sites.length > 0 && !selectedCard) {
      setSelectedCard(sites[0]); // Set first site as default selected card
    }
  }, [sites, selectedCard]);
  // Call fetchSites when siteadmins array is updated
  useEffect(() => {
    if (siteadmins.length > 0) {
      fetchSites(siteadmins); // Fetch sites only when siteadmins is updated and not empty
    }
  }, [siteadmins]);
  const fetchSiteAdmins = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      //const superAdminId=await axios.get(`http://localhost:5000/api/superadmins/${user.email}`);
      //console.log(superAdminId.data.id);
      const response = await axios.get(`http://localhost:5000/api/siteadmins/${user.id}`); // correct URL
      setSiteadmins(response.data.details);
      console.log(response.data.details)
      //fetchSiteAdminDetails(response.data[0].id);
      // Set the first site as the selected card if sites are available
      if (response.data.length > 0) {
        setSelectedCard(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };
  const fetchSites = async (admins) => {
    try {
      for (let i = 0; i < admins.length; i++) {
        let allSites = []; // Initialize an array to hold all site data
        for (let i = 0; i < admins.length; i++) {
          const response = await axios.get(`http://localhost:5000/api/sites/${admins[i].siteadminId}`);
          allSites = [...allSites, ...response.data.details]; // Accumulate the sites from each request
        }
        setSites(allSites); // Update state with the accumulated sites
        console.log(allSites); // Verify all sites are fetched
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  }
  const fetchSiteAdminDetails = async (mycard) => {
    try {
      console.log(mycard);
      const response = await axios.get(`http://localhost:5000/api/siteadmins/${mycard}`);
      console.log(response.data);
      setProgress(response.data.progress);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  }
  const generateId = (name) => {
    // Get the first 4 letters of the name, or as many as available
    console.log("called");
    const namePart = name.substring(0, 4).toLowerCase();

    // Generate a random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999

    // Combine both parts and ensure the total length does not exceed 8
    return (namePart + randomNum).substring(0, 8);
  };
const updateSite = (site) => {
  // Open the modal
  setUpdateModalOpen(true);

  // Find the matching site in the sites array
  const matchedSite = sites.find(s => s.siteId === site.siteId);

  // Only update the form state if a matching site is found
  if (matchedSite) {
    setUpdateSiteForm({
      siteId: matchedSite.siteId,
      name: matchedSite.name,
      location: matchedSite.location,
      siteadminId: matchedSite.siteadminId,
      progress: matchedSite.progress,
      progressImages: matchedSite.progressImages,
      siteImage: matchedSite.siteImage,
      siteInfo: matchedSite.siteInfo,
    });
  }
};
const deleteSite=(site)=>{

  setDeleteSiteName(site.name);
  setDeleteSiteId(site.siteId);

  setDeleteModalOpen(true);
}
const handleDeleteSite=async ()=>{
  const response = await axios.delete(`http://localhost:5000/api/sites/${deleteSiteId}`);
 if(response.data.message=="Site deleted successfully"){
  setDeleteStatus(true);
          setTimeout(() => {
            setDeleteStatus(false);
              setDeleteModalOpen(false); // Close the modal after 2 seconds
          }, 2000);
          fetchSiteAdmins(); 
          setSelectedCard(sites[0])
 }
}
const handleUpdateSite=async (e)=>{
  e.preventDefault();
    try {
      const res = await updateSiteAdmin(
        {
          siteId: updateSiteForm.siteId,
          name: updateSiteForm.name,
          location: updateSiteForm.location,
          siteadminId:updateSiteForm.siteadminId,
          progress: updateSiteForm.progress,
          progressImages:updateSiteForm.progressImages,
          siteImage:updateSiteForm.siteImage,
          siteInfo:updateSiteForm.siteInfo,
        });
        if (res.message === "Site updated successfully") {
          setUpdateStatus(true);
          
          // Set a timeout for 2 seconds (2000 milliseconds)
          setTimeout(() => {
            setUpdateStatus(false);
              setUpdateModalOpen(false); // Close the modal after 2 seconds
          }, 2000);
          fetchSiteAdmins(); 
      }
      
    } catch (error) {
      console.error('Error updating site:', error.response ? error.response.data : error.message);
    }
}
  const handleAddSiteAdmin = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'))
    const generatedId = generateId(siteAdminFormdata.name);
    const superAdminId = user.id;
    try {
      const res = await addSiteAdmin(
        {
          siteadminId: generatedId,
          name: siteAdminFormdata.name,
          email: siteAdminFormdata.email,
          password: siteAdminFormdata.password,
          isDeleted: siteAdminFormdata.isDeleted,
          superadminId: superAdminId
        });
      if (res.message === "SiteAdmin added successfully") {
        setSiteAdminPopup(true);
        
      }
    } catch (error) {
      console.error('Error adding site:', error.response ? error.response.data : error.message);
    }
  }
  const handleAddSite = async (e) => {
    e.preventDefault();
    try {
      const generatedId = generateId(formdata.name)
      const res = await addSite(
        {
          siteId: generatedId,
          name: formdata.name,
          location: formdata.location,
          siteadminId: formdata.siteadminId,
          progress: 0,
          progressImages: [],
          siteImage: formdata.siteImage,
          siteInfo: formdata.siteInfo,
        });
      if (res.message === "Site added successfully") {
        const newSite = {
          siteId: generatedId,
          name: formdata.name,
          location: formdata.location,
          siteadminId: formdata.siteadminId,
          progress: 0,
          progressImages: [],
          siteImage: formdata.siteImage,
          siteInfo: formdata.siteInfo,
        };
        setSites(prevSites => [...prevSites, newSite]);
        setSitePopup(true);
      }
      //fetchSites();
    } catch (error) {
      console.error('Error adding site:', error.response ? error.response.data : error.message);
    }
  };
  const handleAddSuperAdmin = async (e) => {

    e.preventDefault();
    try {
      const generatedId = generateId(superAdminFormdata.name)
      const res = await addSuperAdmin(
        {
          id: generatedId,
          name: superAdminFormdata.name,
          email: superAdminFormdata.email,
          password: '123456',
          isDeleted: false
        });
      if (res.message === 'SuperAdmin added successfully') {
        setSuperAdminPopup(true);
      }
    } catch (error) {
      console.error('Error adding superAdmin:', error.response ? error.response.data : error.message);
    }
  }

  return (
    <>
      <h1 className="pagehead">Employee Work Tracking System</h1>
      <nav className="navbarr">

        <ul className="nav-links">

          <li
            onClick={() => setView('home')}
            className={view === 'home' ? 'active' : ''} // Highlight if active
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
            </svg>Home
          </li>
          <li
            onClick={() => setView('addSite')}
            className={view === 'addSite' ? 'active' : ''} // Highlight if active
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-buildings-fill" viewBox="0 0 16 16">
              <path d="M15 .5a.5.5 0 0 0-.724-.447l-8 4A.5.5 0 0 0 6 4.5v3.14L.342 9.526A.5.5 0 0 0 0 10v5.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V14h1v1.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zM2 11h1v1H2zm2 0h1v1H4zm-1 2v1H2v-1zm1 0h1v1H4zm9-10v1h-1V3zM8 5h1v1H8zm1 2v1H8V7zM8 9h1v1H8zm2 0h1v1h-1zm-1 2v1H8v-1zm1 0h1v1h-1zm3-2v1h-1V9zm-1 2h1v1h-1zm-2-4h1v1h-1zm3 0v1h-1V7zm-2-2v1h-1V5zm1 0h1v1h-1z" />
            </svg> Add a Site
          </li>
          <li
            onClick={() => setView('addSiteAdmin')}
            className={view === 'addSiteAdmin' ? 'active' : ''} // Highlight if active
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-check" viewBox="0 0 16 16">
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
            </svg> Add a Site Admin
          </li>
          <li
            onClick={() => setView('addSuperAdmin')}
            className={view === 'addSuperAdmin' ? 'active' : ''} // Highlight if active
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-gear" viewBox="0 0 16 16">
              <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
            </svg>Add a Super Admin
          </li>
          <li
            onClick={() => setView('viewSiteAdmins')}
            className={view === 'viewSiteAdmins' ? 'active' : ''} // Highlight if active
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-view-stacked" viewBox="0 0 16 16">
              <path d="M3 0h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm0 8h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z" />
            </svg>View site admins
          </li>
        </ul>
      </nav>

      <div className="mainContainer">
      {isUpdateModalOpen && (
        <div className="modal-overlay" onClick={() => setUpdateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="form-title">Update a New Site</h2>
            <form onSubmit={handleUpdateSite} className="form">
              <input
                type="text"
                placeholder="Site Name"
                value={updateSiteForm.name}
                onChange={(e) => setUpdateSiteForm({ ...updateSiteForm, name: e.target.value })}
                required
                className="input-field"
              />

              <input
                type="text"
                placeholder="Location"
                value={updateSiteForm.location}
                onChange={(e) => setUpdateSiteForm({ ...updateSiteForm, location: e.target.value })}
                required
                className="input-field"
              />
              <select
                value={updateSiteForm.siteadminId}
                onChange={(e) => setUpdateSiteForm({ ...updateSiteForm, siteadminId: e.target.value })}
                required
                className="select-field"
              >
                <option value="">Select Site Admin</option>
                {siteadmins.map((admin) => (
                  <option key={admin.siteadminId} value={admin.siteadminId}>
                    {admin.siteadminId}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Image URL"
                value={updateSiteForm.siteImage}
                onChange={(e) => setUpdateSiteForm({ ...updateSiteForm, siteImage: e.target.value })}
                required
                className="input-field"
              />
              <input
                type="text"
                placeholder="Info"
                value={updateSiteForm.siteInfo}
                onChange={(e) => setUpdateSiteForm({ ...updateSiteForm, siteInfo: e.target.value })}
                required
                className="input-field"
              />
               <button type="submit" className="submit-button">Update Site</button>
            </form>
            {updateStatus && (
              <Popup message="Site updated successfully" />
            )}
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2 className="form-title">Delete</h2>
            <p>Are you sure you want to delete? <p className="delete-site-name">{deleteSiteName}</p></p>
            <button className="delete-site-conform" onClick={() => handleDeleteSite(deleteSiteId)}>Confirm</button> 

            <button className="delete-site-cancel" onClick={() => setDeleteModalOpen(false)}>Close</button>
            {deleteStatus && (
              <Popup message="Site deleted successfully" />
            )}
          </div>
        </div>
      )}
        {view === 'home' && (
          <div className="container">
            <div className="card-container">
              {sites.length > 0 && sites.map((site) => (

                <div
                  key={site.id}
                  className="card"
                  style={{
                    backgroundImage: `url(${site.siteImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                  onClick={() => handleCardClick(site)}
                >
                  <span className="site-tag">{site.name}</span>
                </div>
              ))}
            </div>
            <div className="detail-view">
              {prevCard && isAnimating && (
                <div className="detail-content closing">
                  <h2>{prevCard.name}</h2>
                  <p>{prevCard.info}</p>
                </div>
              )}
              {selectedCard && !isAnimating && (

                <div className="detail-content opening" style={{paddingRight:"20px"}}>
                  <div className="site-actions">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" onClick={() => updateSite(selectedCard)}ill="currentColor" className="bi bi-pencil-square site-edit" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" onClick={() => deleteSite(selectedCard)} fill="currentColor" className="bi bi-trash-fill site-delete" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                  </svg>
                  </div>
                  <p id="selectedCardName">{selectedCard.name}</p>
                  <img src={selectedCard.siteImage} alt={selectedCard.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
                  <ul id="info-list">
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-crosshair2 icons" viewBox="0 0 16 16">
                        <path d="M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0m-.5 2.02A6 6 0 0 0 2.02 7.5h1.005A5 5 0 0 1 7.5 3.025zm1 1.005A5 5 0 0 1 12.975 7.5h1.005A6 6 0 0 0 8.5 2.02zM12.975 8.5A5 5 0 0 1 8.5 12.975v1.005a6 6 0 0 0 5.48-5.48zM7.5 12.975A5 5 0 0 1 3.025 8.5H2.02a6 6 0 0 0 5.48 5.48zM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0" />
                      </svg>
                      <p
                        style={{ fontWeight: "bold" }}
                      >
                        {selectedCard.location}
                      </p>
                    </li>
                    <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-check icons" viewBox="0 0 16 16">
                      <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                    </svg>
                      <p id="siteAdminName"><span className="assignedTo">Assigned To </span>{selectedCard.siteAdminId || "NA"}</p></li>
                    <li>

                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-newspaper icons" viewBox="0 0 16 16">
                        <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z" />
                        <path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z" />
                      </svg> <p style={{ fontWeight: "bold" }}>{selectedCard.siteInfo}</p>
                    </li>


                  </ul>
                  <div className="circleProgress"><CircleProgressBar className="circleProgress" size={150} progress={selectedCard.progress} strokeWidth={10} />
                  </div>

                </div>
              )}
              {!selectedCard && !isAnimating && sites.length > 0 && (
                <div className="detail-content">
                  <h2>{sites[0].name}</h2>
                  <img src={sites[0].image} alt={sites[0].name} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
                  <p>{sites[0].info}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'addSite' && (
          <div className="add-site-container">
            <h2 className="form-title">Add a New Site</h2>
            <form onSubmit={handleAddSite} className="form">
              <input
                type="text"
                placeholder="Site Name"
                value={formdata.name}
                onChange={(e) => setFormdata({ ...formdata, name: e.target.value })}
                required
                className="input-field"
              />

              <input
                type="text"
                placeholder="Location"
                value={formdata.location}
                onChange={(e) => setFormdata({ ...formdata, location: e.target.value })}
                required
                className="input-field"
              />
              <select
                value={formdata.siteadminId}
                onChange={(e) => setFormdata({ ...formdata, siteadminId: e.target.value })}
                required
                className="select-field"
              >
                <option value="">Select Site Admin</option>
                {siteadmins.map((admin) => (
                  <option key={admin.siteadminId} value={admin.siteadminId}>
                    {admin.siteadminId}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Image URL"
                value={formdata.siteImage}
                onChange={(e) => setFormdata({ ...formdata, siteImage: e.target.value })}
                required
                className="input-field"
              />
              <input
                type="text"
                placeholder="Info"
                value={formdata.siteInfo}
                onChange={(e) => setFormdata({ ...formdata, siteInfo: e.target.value })}
                required
                className="input-field"
              />
              <button type="submit" className="submit-button">Add Site</button>
            </form>
            {sitePopup && (
              <Popup message="Site added successfully" />
            )}
          </div>
        )}


        {view === 'addSiteAdmin' && (
          <div className="add-siteadmin-container">
            <h2 className="form-title">Add a New SiteAdmin</h2>
            <form onSubmit={handleAddSiteAdmin}>
              <input
                type="text"
                className="input-field"
                placeholder="siteAdmin Name"
                value={siteAdminFormdata.name}
                onChange={(e) => setSiteAdminFormdata({ ...siteAdminFormdata, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="siteAdmin Email"
                className="input-field"
                value={siteAdminFormdata.email}
                onChange={(e) => setSiteAdminFormdata({ ...siteAdminFormdata, email: e.target.value })}
                required
              />

              <button className="submit-button" type="submit">Add SiteAdmin</button>
            </form>
            {siteAdminPopup && (
              <Popup message="Siteadmin added successfully" />
            )}
          </div>
        )}
        {view === 'addSuperAdmin' && (
          <div className="add-superadmin-container">
            <h2 className="form-title">Add Superadmin</h2>
            <form onSubmit={handleAddSuperAdmin}>
              <input
                type="text"
                className="input-field"
                placeholder="superAdmin Name"
                value={superAdminFormdata.name}
                onChange={(e) => setSuperAdminFormdata({ ...superAdminFormdata, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="superAdmin Email"
                className="input-field"
                value={superAdminFormdata.email}
                onChange={(e) => setSuperAdminFormdata({ ...superAdminFormdata, email: e.target.value })}
                required
              />

              <button className="submit-button" type="submit">Add SuperAdmin</button>
            </form>
            {superAdminPopup && (
              <Popup message="Superadmin added successfully" />
            )}
          </div>
        )}
        {view === 'viewSiteAdmins' && (
          <div className="view-siteadmins-container">
            <p style={{
              fontSize: "30px",
              fontWeight: "bold",
              fontFamily: "sans-serif"
            }}>
              <h2 className="form-title">view siteAdmins</h2>
            </p>
            <div className="siteadmins-grid">
              {siteadmins.map((admin) => (

                <div class="Admincard" key={admin._id}>
                  <div class="card-photo"></div>
                  <div class="card-title">
                    <h4>{admin.name}</h4>
                    <h6>{admin.siteadminId}</h6>
                    <p style={{ fontSize: "15px" }}>{admin.email}</p>
                  </div>
                  <div class="card-socials">
                    <button class="card-socials-btn facebook">
                      <svg data-name="Layer 21" height="24" id="Layer_21" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" class="icon"><title></title><path d="M16.75,9H13.5V7a1,1,0,0,1,1-1h2V3H14a4,4,0,0,0-4,4V9H8v3h2v9h3.5V12H16Z"></path></svg>
                    </button>
                    <button class="card-socials-btn github">
                      <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                    </button>
                    <button class="card-socials-btn linkedin">
                      <svg xmlns="http://www.w3.org/2000/svg" width="512" viewBox="0 0 512 512" height="512"><path d="m51.326 185.85h90.011v270.872h-90.011zm45.608-130.572c-30.807 0-50.934 20.225-50.934 46.771 0 26 19.538 46.813 49.756 46.813h.574c31.396 0 50.948-20.814 50.948-46.813-.589-26.546-19.551-46.771-50.344-46.771zm265.405 124.209c-47.779 0-69.184 26.28-81.125 44.71v-38.347h-90.038c1.192 25.411 0 270.872 0 270.872h90.038v-151.274c0-8.102.589-16.174 2.958-21.978 6.519-16.174 21.333-32.923 46.182-32.923 32.602 0 45.622 24.851 45.622 61.248v144.926h90.024v-155.323c0-83.199-44.402-121.911-103.661-121.911z"></path></svg>
                    </button>
                  </div>
                </div>

              ))}
            </div>
          </div>
        )}


      </div>
    </>
  );
};

export default SuperAdmin;
