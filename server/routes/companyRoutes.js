const express = require('express');
const {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  ChangeJobApplicationsStatus,
  changeVisiblity
} = require('../controllers/companyController');
const { uploadCompanyLogo } = require('../config/s3');
const { protectCompany } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a company
router.post('/register', uploadCompanyLogo.single('image'), registerCompany);

// Company login
router.post('/login', loginCompany);

// Get company data
router.get('/company', protectCompany, getCompanyData);

// Post a job
router.post('/post-job', protectCompany, postJob);

// Get Applicants Data of Company
router.get('/applicants', protectCompany, getCompanyJobApplicants);

// Get Company Job List
router.get('/list-jobs', protectCompany, getCompanyPostedJobs);

// Change Applications Status 
router.post('/change-status', protectCompany, ChangeJobApplicationsStatus);

// Change Applications Visibility 
router.post('/change-visiblity', protectCompany, changeVisiblity);

module.exports = router;