const express = require('express');
const { getAuth } = require('@clerk/express');
const { applyForJob, getJobApplications, getMyApplications, updateStatus, withdrawApplication } = require('../controllers/application');
const { protectCompany } = require('../middleware/authMiddleware');
const { uploadResume } = require('../config/s3');

const router = express.Router();

// Custom requireAuth to avoid deprecation warning
const requireClerkAuth = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  req.auth = auth;
  next();
};

// User (Applicant) routes — protected by Clerk
router.post('/:jobId/apply', requireClerkAuth, uploadResume.single('resume'), applyForJob);
router.get('/my-applications', requireClerkAuth, getMyApplications);
router.put('/:id/withdraw', requireClerkAuth, withdrawApplication);

// Employer / Company routes — protected by custom JWT
router.get('/job/:jobId', protectCompany, getJobApplications);
router.put('/:id/status', protectCompany, updateStatus);

module.exports = router;
