const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      // For local employer accounts, we can manually generate a UUID string
      // or let Sequelize do it if we keep defaultValue.
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('jobseeker', 'employer', 'admin'),
      defaultValue: 'jobseeker',
    },
    // Profile
    phone: { type: DataTypes.STRING(20) },
    location: { type: DataTypes.STRING(200) },
    bio: { type: DataTypes.TEXT },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    // S3 URLs (already using S3 — keep same logic)
    profileImage: { type: DataTypes.STRING(500) },
    resume: { type: DataTypes.STRING(500) },
    // Employer fields
    companyName: { type: DataTypes.STRING(200) },
    companyWebsite: { type: DataTypes.STRING(300) },
    companyLogo: { type: DataTypes.STRING(500) },
    // Auth
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpire: { type: DataTypes.DATE },
  },
  {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Instance method: compare password
User.prototype.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Instance method: hide password from JSON output
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.resetPasswordToken;
  delete values.resetPasswordExpire;
  return values;
};

module.exports = User;
