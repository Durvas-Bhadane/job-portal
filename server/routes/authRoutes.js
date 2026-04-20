const express = require('express');
const { register, login, getMe, updateProfile } = require('../controllers/auth');
const { protectUser } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../config/s3');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected user routes
router.get('/me', protectUser, getMe);

// Allow either profileImage or resume upload when updating profile
router.put('/update-profile', protectUser, uploadProfileImage.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), updateProfile);

module.exports = router;
