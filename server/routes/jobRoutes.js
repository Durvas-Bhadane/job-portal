const express = require('express');
const { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs } = require('../controllers/job');
const { protectCompany } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Employer / Company protected routes
router.post('/', protectCompany, createJob);
router.get('/my-jobs', protectCompany, getMyJobs);
router.put('/:id', protectCompany, updateJob);
router.delete('/:id', protectCompany, deleteJob);

module.exports = router;