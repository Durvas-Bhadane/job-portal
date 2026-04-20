// controllers/companyController.js
// Fully rewritten from Mongoose → Sequelize (PostgreSQL RDS)

const bcrypt = require('bcryptjs');
const { Company, Job, Application, User } = require('../models/index');
const generateToken = require('../utils/generateToken');
const { uploadCompanyLogo } = require('../config/s3');

// ── Register a new company ────────────────────────────────────
const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Missing Details' });
  }

  try {
    const companyExists = await Company.findOne({ where: { email } });
    if (companyExists) {
      return res.json({ success: false, message: 'Company already registered' });
    }

    // S3 image URL comes from multer-s3 middleware (req.file.location)
    const imageUrl = req.file ? req.file.location : null;

    // Password is hashed by the beforeCreate hook in Company model
    const company = await Company.create({ name, email, password, image: imageUrl });

    res.json({
      success: true,
      company,
      token: generateToken(company.id, 'employer'),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Login Company ─────────────────────────────────────────────
const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Explicitly include password (excluded in toJSON)
    const company = await Company.findOne({
      where: { email },
      attributes: { include: ['password'] },
    });

    if (!company) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await company.matchPassword(password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      company,
      token: generateToken(company.id, 'employer'),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get Company Data ──────────────────────────────────────────
const getCompanyData = async (req, res) => {
  try {
    res.json({ success: true, company: req.company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Post New Job ──────────────────────────────────────────────
const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;
  const companyId = req.company.id;

  try {
    const newJob = await Job.create({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
      isActive: true,
      visible: true,
    });

    res.json({ success: true, newJob });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get Company Job Applicants ────────────────────────────────
const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company.id;

    // Sequelize equivalent of .populate()
    const applications = await Application.findAll({
      where: { companyId },
      include: [
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'profileImage', 'resume'],
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'category', 'level', 'salary'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get Company Posted Jobs ───────────────────────────────────
const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company.id;

    const jobs = await Job.findAll({
      where: { companyId },
      include: [
        {
          model: Application,
          as: 'applications',
          attributes: ['id'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Add applicant count
    const jobsData = jobs.map((job) => ({
      ...job.toJSON(),
      applicants: job.applications ? job.applications.length : 0,
    }));

    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Change Job Application Status ─────────────────────────────
const ChangeJobApplicationsStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    // Mongoose: findOneAndUpdate({ _id: id }, { status })
    // Sequelize:
    const [updated] = await Application.update({ status }, { where: { id } });

    if (!updated) {
      return res.json({ success: false, message: 'Application not found.' });
    }

    res.json({ success: true, message: 'Status Changed' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Toggle Job Visibility ─────────────────────────────────────
const changeVisiblity = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company.id;

    // Mongoose: Job.findById(id)
    const job = await Job.findByPk(id);

    if (!job) {
      return res.json({ success: false, message: 'Job not found.' });
    }

    if (companyId !== job.companyId) {
      return res.json({ success: false, message: 'Not authorized.' });
    }

    await job.update({ visible: !job.visible });

    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  ChangeJobApplicationsStatus,
  changeVisiblity,
};