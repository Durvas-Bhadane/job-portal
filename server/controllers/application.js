// controllers/application.js

const { Application, Job, User } = require('../models/index');

// ─────────────────────────────────────────────────────────────
// APPLY FOR A JOB
// ─────────────────────────────────────────────────────────────
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check job exists and is active
    const job = await Job.findByPk(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, message: 'Job not found or no longer active.' });
    }

    // Prevent duplicate application (unique index on jobId + applicantId)
    const existing = await Application.findOne({
      where: { jobId, applicantId: req.auth.userId },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job.' });
    }

    // Resume URL from S3 (multer-s3 sets req.file.location)
    const resumeUrl = req.file?.location || req.user.resume;

    const application = await Application.create({
      jobId,
      applicantId: req.auth.userId,
      coverLetter: req.body.coverLetter,
      resumeUrl,
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET APPLICATIONS FOR A JOB  (employer)
// ─────────────────────────────────────────────────────────────
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.employerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email', 'phone', 'profileImage', 'skills', 'location'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET MY APPLICATIONS  (job seeker)
// ─────────────────────────────────────────────────────────────
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { applicantId: req.auth.userId },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company', 'location', 'jobType', 'isActive'],
          include: [
            { model: User, as: 'employer', attributes: ['id', 'companyName', 'companyLogo'] },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE APPLICATION STATUS  (employer)
// ─────────────────────────────────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { status, employerNote } = req.body;

    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'job' }],
    });

    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });
    if (application.job.employerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await application.update({ status, ...(employerNote && { employerNote }) });
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// WITHDRAW APPLICATION  (job seeker)
// ─────────────────────────────────────────────────────────────
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });
    if (application.applicantId !== req.auth.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await application.update({ status: 'withdrawn' });
    res.status(200).json({ success: true, message: 'Application withdrawn.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
