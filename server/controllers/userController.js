// controllers/userController.js
// Fully rewritten from Mongoose → Sequelize (PostgreSQL RDS)

const { User, Job, Application } = require('../models/index');
const { uploadResume } = require('../config/s3');

// ── Get User Data ─────────────────────────────────────────────
const getUserData = async (req, res) => {
  try {
    // req.auth is set by clerkMiddleware
    const user = await User.findByPk(req.auth.userId);

    if (!user) {
      return res.json({ success: false, message: 'User Not Found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Apply For Job ─────────────────────────────────────────────
const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const applicantId = req.auth.userId;

  try {
    // Prevent duplicate applications
    const isAlreadyApplied = await Application.findOne({
      where: { jobId, applicantId },
    });

    if (isAlreadyApplied) {
      return res.json({ success: false, message: 'Already Applied' });
    }

    const jobData = await Job.findByPk(jobId);
    if (!jobData) {
      return res.json({ success: false, message: 'Job Not Found' });
    }

    await Application.create({
      companyId: jobData.companyId,
      applicantId,
      jobId,
      date: Date.now(),
      status: 'pending',
    });

    res.json({ success: true, message: 'Applied Successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get User Applied Applications ─────────────────────────────
const getUserJobApplications = async (req, res) => {
  try {
    const applicantId = req.auth.userId;

    const applications = await Application.findAll({
      where: { applicantId },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'description', 'location', 'category', 'level', 'salary'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!applications || applications.length === 0) {
      return res.json({ success: false, message: 'No job applications found for this user.' });
    }

    return res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Update User Resume ────────────────────────────────────────
const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const updates = {};
    if (req.file) {
      // multer-s3 sets req.file.location to the S3 URL
      updates.resume = req.file.location;
    }

    if (Object.keys(updates).length === 0) {
      return res.json({ success: false, message: 'No file uploaded.' });
    }

    await User.update(updates, { where: { id: userId } });

    return res.json({ success: true, message: 'Resume Updated' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserData,
  applyForJob,
  getUserJobApplications,
  updateUserResume,
};