// controllers/auth.js
// Shows Sequelize equivalents of common Mongoose patterns.
// Replace the relevant sections in your existing auth controller.

const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

// ─────────────────────────────────────────────────────────────
// REGISTER
// Mongoose:  const user = await User.create({ ... })
// Sequelize: same — User.create({ ... }) works identically
// ─────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check duplicate — Mongoose: User.findOne({ email })
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Create user (password hashed in beforeCreate hook)
    const user = await User.create({ name, email, password, role });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Mongoose: User.findOne({ email }).select('+password')
    // Sequelize: attributes option includes all by default; password is
    //            excluded in toJSON() but we need it here for comparison.
    const user = await User.findOne({
      where: { email },
      attributes: { include: ['password'] }, // explicitly pull password back
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET CURRENT USER  /api/auth/me
// ─────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    // Mongoose: User.findById(req.user.id)
    const user = await User.findByPk(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE PROFILE
// ─────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'location', 'bio', 'skills', 'companyName', 'companyWebsite'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    // Handle S3 uploads (same as before — multer sets req.file.location)
    if (req.file) {
      if (req.file.fieldname === 'profileImage') updates.profileImage = req.file.location;
      if (req.file.fieldname === 'resume') updates.resume = req.file.location;
    }

    // Mongoose: User.findByIdAndUpdate(id, updates, { new: true })
    const [, [user]] = await User.update(updates, {
      where: { id: req.user.id },
      returning: true,
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// Helper — sign JWT and send response
// ─────────────────────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
  res.status(statusCode).json({ success: true, token, data: user });
};
