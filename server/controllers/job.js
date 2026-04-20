// controllers/job.js
// Sequelize equivalents for all common Mongoose job queries.

const { Op } = require('sequelize');
const { Job, User, Application } = require('../models/index');

// ─────────────────────────────────────────────────────────────
// GET ALL JOBS  (with search, filter, pagination)
// Mongoose: Job.find({ ...filters }).populate('employer').skip().limit()
// ─────────────────────────────────────────────────────────────
exports.getJobs = async (req, res) => {
  try {
    const {
      keyword, location, jobType, category, experience,
      salaryMin, salaryMax, page = 1, limit = 10,
    } = req.query;

    const where = { isActive: true };

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${keyword}%` } },
        { description: { [Op.iLike]: `%${keyword}%` } },
        { company: { [Op.iLike]: `%${keyword}%` } },
      ];
    }
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (jobType) where.jobType = jobType;
    if (category) where.category = category;
    if (experience) where.experience = experience;
    if (salaryMin) where.salaryMin = { [Op.gte]: Number(salaryMin) };
    if (salaryMax) where.salaryMax = { [Op.lte]: Number(salaryMax) };

    const offset = (Number(page) - 1) * Number(limit);

    // Mongoose: .populate('employer', 'name email companyName companyLogo')
    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['id', 'name', 'email', 'companyName', 'companyLogo'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: jobs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET SINGLE JOB
// ─────────────────────────────────────────────────────────────
exports.getJob = async (req, res) => {
  try {
    // Mongoose: Job.findById(id).populate(...)
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: User, as: 'employer', attributes: ['id', 'name', 'companyName', 'companyLogo', 'location'] },
      ],
    });

    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    // Increment view count
    await job.increment('views');

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// CREATE JOB
// ─────────────────────────────────────────────────────────────
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, employerId: req.user.id });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE JOB
// ─────────────────────────────────────────────────────────────
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.employerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Mongoose: Job.findByIdAndUpdate(id, body, { new: true })
    await job.update(req.body);
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE JOB
// ─────────────────────────────────────────────────────────────
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.employerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Mongoose: Job.findByIdAndDelete(id)
    await job.destroy();
    res.status(200).json({ success: true, message: 'Job deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET EMPLOYER'S OWN JOBS
// ─────────────────────────────────────────────────────────────
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { employerId: req.user.id },
      include: [
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
