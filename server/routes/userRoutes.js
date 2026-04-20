const express = require('express');
const { getAuth } = require('@clerk/express');
const {
  getUserData,
  applyForJob,
  getUserJobApplications,
  updateUserResume
} = require('../controllers/userController');
const { uploadResume } = require('../config/s3');

// Custom requireAuth to avoid deprecation warning
const requireClerkAuth = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  req.auth = auth;
  next();
};

const router = express.Router();

// Apply Clerk's requireAuth middleware to all user routes
router.use(requireClerkAuth);

// Get user Data
router.get('/user', getUserData);

// Apply for a job
router.post('/apply', applyForJob);

// Get applied jobs data
router.get('/applications', getUserJobApplications);

// Update user profile (resume)
router.post('/update-resume', uploadResume.single('resume'), updateUserResume);

module.exports = router;